import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp,schedule} from '../src/server.mjs';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('schedules conserve principal, clamp month ends and reconcile interest',()=>{
 for(const method of ['FLAT','REDUCING_BALANCE'])for(const months of [1,3,12,120])for(const rate of [0,2800,10000]){
 const rows=schedule(100001,rate,months,method,'2026-01-31');
 assert.equal(rows.reduce((s,r)=>s+r.principal,0),100001);
 assert.ok(rows.every(r=>Number.isInteger(r.amount)&&r.interest>=0&&r.principal>=0));
 assert.equal(rows[0].dueDate,'2026-02-28');
 if(method==='FLAT')assert.equal(rows.reduce((s,r)=>s+r.interest,0),Math.round(100001*rate*months/120000));
 }
 const rows=schedule(100000,1200,12,'REDUCING_BALANCE','2026-01-01');
 assert.equal(rows[0].interest,1000);assert.ok(rows.at(-1).principal>0);
});

test('persistent tenant-isolated lifecycle, idempotent repayments, journals and client permissions',async t=>{
 const dir=mkdtempSync(join(tmpdir(),'abc-test-')); const filename=join(dir,'db.sqlite');let app=createApp({filename});
 await new Promise(r=>app.server.listen(0,'127.0.0.1',r));let url=`http://127.0.0.1:${app.server.address().port}`;
 t.after(async()=>{await new Promise(r=>app.server.close(r));app.close();rmSync(dir,{recursive:true,force:true});});
 async function req(path,body,cookie){const res=await fetch(url+'/api'+path,{method:body?'POST':'GET',headers:{...(body?{'content-type':'application/json'}:{}),...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});return {status:res.status,value:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]};}
 const a=await req('/auth/register',{name:'Admin A',company:'Company A',email:'a@example.com',password:'A strong password 123'});assert.equal(a.status,201);const ca=a.cookie;
 const b=await req('/auth/register',{name:'Admin B',company:'Company B',email:'b@example.com',password:'B strong password 123'});const cb=b.cookie;
 assert.equal((await req('/workspace')).status,401);
 const borrower=(await req('/borrowers',{name:'Borrower',phone:'0971234567',nrc:'123/45/6',address:'Ndola'},ca)).value;
 assert.equal((await req('/borrowers',{name:'Duplicate',phone:'0971',nrc:'123/45/6',address:'Ndola'},ca)).status,409);
 const product=(await req('/products',{name:'Business',code:'BIZ',minPrincipal:'100',maxPrincipal:'10000',annualRate:'12',maxMonths:12,method:'REDUCING_BALANCE',collateralRequired:true},ca)).value;
 const input={borrowerId:borrower.id,productId:product.id,principal:'1000',months:3,purpose:'Working capital',collateral:'Machine'};
 assert.equal((await req('/loans',input,cb)).status,404);
 assert.equal((await req('/loans',{...input,principal:'1'},ca)).status,400);
 const loan=(await req('/loans',input,ca)).value;
 assert.equal((await req(`/loans/${loan.id}/disburse`,{date:'2026-01-31'},ca)).status,409);
 assert.equal((await req(`/loans/${loan.id}/approve`,{},ca)).status,201);
 const disbursed=await req(`/loans/${loan.id}/disburse`,{date:'2026-01-31'},ca);assert.equal(disbursed.status,201);
 assert.equal((await req(`/loans/${loan.id}/disburse`,{date:'2026-01-31'},ca)).status,409);
 const paymentBody={loanId:loan.id,amount:'100',date:'2026-02-01',method:'Cash',idempotencyKey:'payment-1'};
 const p1=await req('/payments',paymentBody,ca);assert.equal(p1.status,201);assert.equal(p1.value.amount,10000);
 const retry=await req('/payments',paymentBody,ca);assert.equal(retry.value.id,p1.value.id);
 assert.equal((await req('/payments',{...paymentBody,amount:'101'},ca)).status,409);
 assert.equal((await req('/payments',{...paymentBody,idempotencyKey:'bad',amount:'99999'},ca)).status,400);
 assert.equal((await req('/payments',{...paymentBody,idempotencyKey:'bad2',amount:'NaN'},ca)).status,400);
 const client=await req('/clients',{borrowerId:borrower.id,email:'client@example.com',password:'Client password 123'},ca);assert.equal(client.status,201);
 const login=await req('/auth/login',{email:'client@example.com',password:'Client password 123'});assert.equal(login.status,200);
 const clientState=await req('/workspace',undefined,login.cookie);assert.equal(clientState.value.loans.length,1);assert.equal(clientState.value.journals.length,0);
 assert.equal((await req('/borrowers',{name:'No access'},login.cookie)).status,403);
 const other=(await req('/workspace',undefined,cb)).value;assert.equal(other.loans.length,0);assert.equal(other.borrowers.length,0);assert.equal(other.payments.length,0);
 const state=(await req('/workspace',undefined,ca)).value;assert.equal(state.payments.length,1);assert.equal(state.loans[0].paid,10000);
 assert.ok(state.journals.some(j=>j.date==='2026-01-31'));assert.ok(state.journals.some(j=>j.date==='2026-02-01'));
 for(const j of state.journals)assert.equal(j.lines.reduce((s,x)=>s+x.debit,0),j.lines.reduce((s,x)=>s+x.credit,0));
 const balance=state.loans[0].total-10000;
 const final=await req('/payments',{...paymentBody,amount:(balance/100).toFixed(2),idempotencyKey:'final'},ca);assert.equal(final.status,201);
 assert.equal((await req('/workspace',undefined,ca)).value.loans[0].status,'Closed');
 await new Promise(r=>app.server.close(r));app.close();app=createApp({filename});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${app.server.address().port}`;
 assert.equal((await req('/workspace',undefined,ca)).value.payments.length,2);
 assert.equal((await req('/auth/logout',{},ca)).status,200);assert.equal((await req('/workspace',undefined,ca)).status,401);
});

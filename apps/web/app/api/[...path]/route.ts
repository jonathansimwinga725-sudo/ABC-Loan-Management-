import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (request.method === 'POST' && origin && new URL(origin).host !== url.host) return Response.json({error:'Origin not allowed.'},{status:403});
  const headers = new Headers({'content-type':'application/json','x-forwarded-host':url.host});
  const cookie = request.headers.get('cookie'); if (cookie) headers.set('cookie',cookie);
  if (origin) headers.set('origin',origin);
  try {
    const response = await fetch(`${process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000'}${url.pathname}${url.search}`,{method:request.method,headers,body:request.method==='GET'?undefined:await request.text(),cache:'no-store',signal:AbortSignal.timeout(15000),redirect:'error'});
    const output = new Headers({'content-type':'application/json','cache-control':'no-store'});
    const setCookie=response.headers.get('set-cookie');if(setCookie)output.set('set-cookie',setCookie);
    return new Response(await response.text(),{status:response.status,headers:output});
  } catch { return Response.json({error:'The service is unavailable. Please try again shortly.'},{status:503}); }
}
export const GET=proxy;
export const POST=proxy;

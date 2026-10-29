import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual, createHash, randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const fail = (message, status = 400) => { throw new HttpError(status, message); };
const text = (v, name, max = 200) => { if (typeof v !== 'string' || !v.trim() || v.trim().length > max) fail(`${name} is required (maximum ${max} characters).`); return v.trim(); };
const cents = (v) => {
  if (typeof v !== 'string' || !/^\d{1,9}(\.\d{1,2})?$/.test(v)) fail('Enter a positive amount with at most two decimal places.');
  const [whole, fraction = ''] = v.split('.');
  const n = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (n <= 0) fail('Amount must be greater than zero.'); return n;
};
const integer = (v, min, max, name) => { const n = Number(v); if (!Number.isInteger(n) || n < min || n > max) fail(`${name} must be between ${min} and ${max}.`); return n; };
const date = v => { if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0, 10) !== v) fail('Enter a valid date.'); return v; };
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lusaka' });
const hash = v => createHash('sha256').update(v).digest('hex');
function passwordHash(password, salt = randomBytes(16).toString('hex')) { return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }
function passwordMatches(password, stored) { const [salt, digest] = stored.split(':'); return timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(passwordHash(password, salt).split(':')[1], 'hex')); }
function validatePassword(v) { if (typeof v !== 'string' || v.length < 12 || v.length > 128) fail('Use a password of 12–128 characters.'); return v; }
function email(v) { const e = text(v, 'Email', 254).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) fail('Enter a valid email address.'); return e; }
function monthAfter(start, offset) { const d = new Date(`${start}T12:00:00Z`); const day = d.getUTCDate(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + offset); const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate(); d.setUTCDate(Math.min(day, end)); return d.toISOString().slice(0, 10); }
export function schedule(principal, annualBps, months, method, start) {
  let balance = principal;
  const rate = annualBps / 120000;
  const payment = rate === 0 ? principal / months : principal * rate / (1 - (1 + rate) ** -months);
  const flatInterest = Math.round(principal * annualBps * months / 120000);
  const rows = [];
  for (let i = 1; i <= months; i++) {
    const interest = method === 'FLAT' ? Math.floor(flatInterest / months) + (i === months ? flatInterest % months : 0) : Math.round(balance * rate);
    const capital = i === months ? balance : method === 'FLAT' ? Math.floor(principal / months) : Math.min(balance, Math.max(0, Math.round(payment) - interest));
    balance -= capital;
    rows.push({ number: i, dueDate: monthAfter(start, i), principal: capital, interest, amount: capital + interest });
  }
  return rows;
}

export function createApp({ filename = process.env.DATABASE_PATH || './data/abc.sqlite', secureCookies = process.env.COOKIE_SECURE === 'true' } = {}) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS companies(id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, borrower_id TEXT);
  CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), kind TEXT NOT NULL, data TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS records_tenant_kind ON records(company_id, kind);
  CREATE TABLE IF NOT EXISTS operations(company_id TEXT NOT NULL, key TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY(company_id, key));
  CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY, company_id TEXT NOT NULL, user_id TEXT NOT NULL, action TEXT NOT NULL, entity_id TEXT NOT NULL, created_at TEXT NOT NULL);`);
  const all = (sql, ...args) => db.prepare(sql).all(...args);
  const one = (sql, ...args) => db.prepare(sql).get(...args);
  const run = (sql, ...args) => db.prepare(sql).run(...args);
  const transaction = fn => { db.exec('BEGIN IMMEDIATE'); try { const out = fn(); db.exec('COMMIT'); return out; } catch (e) { db.exec('ROLLBACK'); throw e; } };
  const records = (u, kind) => all('SELECT id, data, created_at FROM records WHERE company_id = ? AND kind = ? ORDER BY created_at DESC, id', u.company_id, kind).map(r => ({ ...JSON.parse(r.data), id: r.id, createdAt: r.created_at }));
  const get = (u, kind, id) => { text(id, 'Record ID', 100); const r = one('SELECT * FROM records WHERE company_id = ? AND kind = ? AND id = ?', u.company_id, kind, id); if (!r) fail('Record not found.', 404); return { ...JSON.parse(r.data), id: r.id, createdAt: r.created_at }; };
  const audit = (u, action, id) => run('INSERT INTO audit VALUES(?,?,?,?,?,?)', randomUUID(), u.company_id, u.id, action, id, new Date().toISOString());
  const insert = (u, kind, data) => { const id = randomUUID(); const createdAt = new Date().toISOString(); run('INSERT INTO records VALUES(?,?,?,?,?)', id, u.company_id, kind, JSON.stringify(data), createdAt); audit(u, `${kind}.created`, id); return { ...data, id, createdAt }; };
  const update = (u, kind, row) => { run('UPDATE records SET data = ? WHERE company_id = ? AND kind = ? AND id = ?', JSON.stringify(row), u.company_id, kind, row.id); audit(u, `${kind}.${row.status || 'updated'}`, row.id); return row; };
  const publicUser = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, company: one('SELECT name FROM companies WHERE id = ?', u.company_id).name });
  const issueSession = (u, res) => { const token = randomBytes(32).toString('hex'); run('INSERT INTO sessions VALUES(?,?,?)', hash(token), u.id, Date.now() + 8 * 3600000); res.setHeader('Set-Cookie', `abc_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secureCookies ? '; Secure' : ''}`); };
  const attempts = new Map();
  function throttle(req) { const key = req.socket.remoteAddress; const now = Date.now(); for (const [k, v] of attempts) if (v.until < now) attempts.delete(k); const entry = attempts.get(key) || { count: 0, until: now + 900000 }; entry.count++; attempts.set(key, entry); if (entry.count > 30) fail('Too many attempts. Try again in 15 minutes.', 429); }
  function journal(u, reference, lines, postingDate = today()) {
    const debit = lines.reduce((s, l) => s + l.debit, 0), credit = lines.reduce((s, l) => s + l.credit, 0);
    if (debit !== credit || debit <= 0 || lines.some(l => !Number.isSafeInteger(l.debit) || !Number.isSafeInteger(l.credit) || l.debit < 0 || l.credit < 0 || (l.debit > 0) === (l.credit > 0))) throw new Error('Unbalanced journal');
    return insert(u, 'journal', { reference, date: postingDate, lines });
  }
  function snapshot(u) {
    const borrowers = records(u, 'borrower'), products = records(u, 'product');
    let loans = records(u, 'loan'), payments = records(u, 'payment');
    if (u.role === 'CLIENT') { loans = loans.filter(l => l.borrowerId === u.borrower_id); const ids = new Set(loans.map(l => l.id)); payments = payments.filter(p => ids.has(p.loanId)); return { borrowers: borrowers.filter(b => b.id === u.borrower_id), products: [], loans, payments, journals: [], audit: [] }; }
    return { borrowers, products, loans, payments, journals: records(u, 'journal'), audit: all('SELECT action, entity_id AS entityId, created_at AS createdAt FROM audit WHERE company_id = ? ORDER BY created_at DESC LIMIT 200', u.company_id) };
  }
  async function body(req) {
    if (!(req.headers['content-type'] || '').startsWith('application/json')) fail('Use application/json.', 415);
    let data = ''; for await (const chunk of req) { data += chunk; if (Buffer.byteLength(data) > 65536) fail('Request too large.', 413); }
    try { const value = JSON.parse(data); if (!value || Array.isArray(value) || typeof value !== 'object') fail('Expected an object.'); return value; } catch (e) { if (e instanceof HttpError) throw e; fail('Invalid JSON.'); }
  }
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, value) => { res.writeHead(status); res.end(JSON.stringify(value)); };
    try {
      const path = new URL(req.url, 'http://localhost').pathname.replace(/^\/api/, '');
      const method = req.method;
      if (method === 'GET' && path === '/health') return send(200, { status: 'ok', storage: 'sqlite' });
      if (!['GET', 'HEAD'].includes(method) && req.headers.origin && req.headers['x-forwarded-host'] && new URL(req.headers.origin).host !== req.headers['x-forwarded-host']) fail('Origin not allowed.', 403);
      if (method === 'POST' && ['/auth/register', '/auth/login'].includes(path)) {
        throttle(req); const b = await body(req); const mail = email(b.email); const password = validatePassword(b.password);
        if (path.endsWith('register')) {
          const name = text(b.name, 'Name'), company = text(b.company, 'Company name');
          if (one('SELECT id FROM users WHERE email = ?', mail)) fail('An account with that email already exists.', 409);
          const u = transaction(() => { const companyId = randomUUID(), id = randomUUID(); run('INSERT INTO companies VALUES(?,?,?)', companyId, company, new Date().toISOString()); run('INSERT INTO users VALUES(?,?,?,?,?,?,?)', id, companyId, name, mail, passwordHash(password), 'ADMIN', null); return one('SELECT * FROM users WHERE id = ?', id); });
          issueSession(u, res); return send(201, publicUser(u));
        }
        const u = one('SELECT * FROM users WHERE email = ?', mail);
        if (!u || !passwordMatches(password, u.password)) fail('Email or password is incorrect.', 401);
        issueSession(u, res); return send(200, publicUser(u));
      }
      const token = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('abc_session='))?.slice(12);
      const u = token && one('SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ? AND expires > ?', hash(token), Date.now());
      if (!u) fail('Please sign in.', 401);
      if (method === 'GET' && path === '/auth/me') return send(200, publicUser(u));
      if (method === 'POST' && path === '/auth/logout') { run('DELETE FROM sessions WHERE token = ?', hash(token)); res.setHeader('Set-Cookie', 'abc_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); return send(200, { ok: true }); }
      if (method === 'GET' && path === '/workspace') return send(200, snapshot(u));
      if (method !== 'POST') fail('Not found.', 404);
      if (u.role !== 'ADMIN') fail('Administrator access required.', 403);
      const b = await body(req);
      const result = transaction(() => {
        if (path === '/borrowers') {
          const name = text(b.name, 'Borrower name'), phone = text(b.phone, 'Phone', 30), nrc = text(b.nrc, 'NRC / registration number', 60);
          if (records(u, 'borrower').some(r => r.nrc.toLowerCase() === nrc.toLowerCase())) fail('A borrower with this NRC already exists.', 409);
          return insert(u, 'borrower', { name, phone, nrc, address: text(b.address, 'Address', 500), type: b.type === 'Business' ? 'Business' : 'Individual', kyc: 'Pending' });
        }
        if (path === '/products') {
          const name = text(b.name, 'Product name'), code = text(b.code, 'Product code', 40).toUpperCase();
          if (records(u, 'product').some(p => p.code === code)) fail('Product code already exists.', 409);
          const minPrincipal = cents(b.minPrincipal), maxPrincipal = cents(b.maxPrincipal); if (minPrincipal > maxPrincipal) fail('Minimum principal exceeds maximum.');
          if (typeof b.annualRate !== 'string' || !/^\d{1,3}(\.\d{1,2})?$/.test(b.annualRate)) fail('Enter an annual rate from 0 to 100%.');
          const annualBps = Math.round(Number(b.annualRate) * 100); if (annualBps > 10000) fail('Annual rate cannot exceed 100%.');
          const maxMonths = integer(b.maxMonths, 1, 120, 'Maximum term');
          if (!['FLAT', 'REDUCING_BALANCE'].includes(b.method)) fail('Choose a valid interest method.');
          return insert(u, 'product', { name, code, minPrincipal, maxPrincipal, annualBps, maxMonths, method: b.method, currency: 'ZMW', collateralRequired: b.collateralRequired === true, guarantorRequired: b.guarantorRequired === true });
        }
        if (path === '/loans') {
          const borrower = get(u, 'borrower', b.borrowerId), product = get(u, 'product', b.productId), principal = cents(b.principal);
          if (principal < product.minPrincipal || principal > product.maxPrincipal) fail('Amount is outside the product limits.');
          const months = integer(b.months, 1, product.maxMonths, 'Term');
          const collateral = typeof b.collateral === 'string' ? b.collateral.trim() : '', guarantor = typeof b.guarantor === 'string' ? b.guarantor.trim() : '';
          if (collateral.length > 1000 || guarantor.length > 1000) fail('Security details are too long.');
          if (product.collateralRequired && !collateral) fail('This product requires collateral.'); if (product.guarantorRequired && !guarantor) fail('This product requires a guarantor.');
          return insert(u, 'loan', { borrowerId: borrower.id, borrowerName: borrower.name, productId: product.id, productName: product.name, principal, months, annualBps: product.annualBps, method: product.method, currency: 'ZMW', collateral, guarantor, purpose: text(b.purpose, 'Purpose', 500), status: 'Pending', paid: 0, schedule: [] });
        }
        const match = path.match(/^\/loans\/([^/]+)\/(approve|reject|disburse)$/);
        if (match) {
          const loan = get(u, 'loan', match[1]); const action = match[2];
          if (['approve', 'reject'].includes(action)) { if (loan.status !== 'Pending') fail('Only pending loans can be reviewed.', 409); loan.status = action === 'approve' ? 'Approved' : 'Rejected'; }
          else {
            if (loan.status !== 'Approved') fail('Only approved loans can be disbursed.', 409);
            const start = date(b.date); if (start > today()) fail('Disbursement cannot be in the future.');
            loan.schedule = schedule(loan.principal, loan.annualBps, loan.months, loan.method, start); loan.total = loan.schedule.reduce((s, x) => s + x.amount, 0); loan.disbursedAt = start; loan.status = 'Active';
            journal(u, loan.id, [{ account: 'Loan principal receivable', debit: loan.principal, credit: 0 }, { account: 'Cash', debit: 0, credit: loan.principal }], start);
          }
          return update(u, 'loan', loan);
        }
        if (path === '/payments') {
          const key = text(b.idempotencyKey, 'Payment request key', 100);
          const previous = one('SELECT result FROM operations WHERE company_id = ? AND key = ?', u.company_id, key); if (previous) { const stored = JSON.parse(previous.result); if (stored.request !== hash(JSON.stringify(b))) fail('Payment request key was already used for different details.', 409); return stored.payment; }
          const loan = get(u, 'loan', b.loanId); if (loan.status !== 'Active') fail('Repayments require an active loan.', 409);
          const amount = cents(b.amount); if (amount > loan.total - loan.paid) fail('Payment exceeds the outstanding balance.');
          const paidAt = date(b.date); if (paidAt > today() || paidAt < loan.disbursedAt) fail('Payment date must be between disbursement and today.');
          if (!['Cash', 'Bank transfer', 'Mobile money'].includes(b.method)) fail('Select a payment method.');
          let prior = loan.paid, remaining = amount, capital = 0, interest = 0;
          for (const row of loan.schedule) {
            const oldInterest = Math.min(prior, row.interest); prior -= oldInterest;
            const oldCapital = Math.min(prior, row.principal); prior -= oldCapital;
            const payInterest = Math.min(remaining, row.interest - oldInterest); remaining -= payInterest; interest += payInterest;
            const payCapital = Math.min(remaining, row.principal - oldCapital); remaining -= payCapital; capital += payCapital;
          }
          loan.paid += amount; if (loan.paid === loan.total) loan.status = 'Closed'; update(u, 'loan', loan);
          const payment = insert(u, 'payment', { loanId: loan.id, borrowerName: loan.borrowerName, amount, principal: capital, interest, date: paidAt, method: b.method, reference: typeof b.reference === 'string' ? b.reference.slice(0, 200) : '', receipt: `ABC-${randomUUID().slice(0, 12).toUpperCase()}`, balanceAfter: loan.total - loan.paid });
          journal(u, payment.receipt, [{ account: 'Cash', debit: amount, credit: 0 }, ...(capital ? [{ account: 'Loan principal receivable', debit: 0, credit: capital }] : []), ...(interest ? [{ account: 'Interest income', debit: 0, credit: interest }] : [])], paidAt);
          run('INSERT INTO operations VALUES(?,?,?)', u.company_id, key, JSON.stringify({request: hash(JSON.stringify(b)), payment})); return payment;
        }
        const kyc = path.match(/^\/borrowers\/([^/]+)\/verify$/);
        if (kyc) { const row = get(u, 'borrower', kyc[1]); row.kyc = 'Verified'; return update(u, 'borrower', row); }
        if (path === '/clients') {
          const borrower = get(u, 'borrower', b.borrowerId), mail = email(b.email), password = validatePassword(b.password);
          if (one('SELECT id FROM users WHERE email = ?', mail)) fail('Email already registered.', 409);
          if (one('SELECT id FROM users WHERE company_id = ? AND borrower_id = ?', u.company_id, borrower.id)) fail('This borrower already has a login.', 409);
          const id = randomUUID(); run('INSERT INTO users VALUES(?,?,?,?,?,?,?)', id, u.company_id, borrower.name, mail, passwordHash(password), 'CLIENT', borrower.id); audit(u, 'client.invited', id); return { id, email: mail };
        }
        if (path === '/settings') { const name = text(b.company, 'Company name'); run('UPDATE companies SET name = ? WHERE id = ?', name, u.company_id); audit(u, 'company.updated', u.company_id); return { company: name }; }
        fail('Not found.', 404);
      });
      send(201, result);
    } catch (e) { if (!(e instanceof HttpError)) console.error('Request failed:', e); send(e.status || 500, { error: e instanceof HttpError ? e.message : 'An unexpected error occurred. Please try again.' }); }
  });
  server.requestTimeout = 30000; server.headersTimeout = 10000;
  return { server, close: () => db.close(), db };
}

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT || 8787);
const trialLimit = 3;
const planAmount = Number(process.env.PREMIUM_AMOUNT || 100);
const usage = new Map();
const payments = new Map();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(express.json());

function normalisePhone(value) {
  const digits = String(value || '').replace(/\\D/g, '');
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.startsWith('7')) return `254${digits}`;
  return digits;
}

function timestamp() {
  const date = new Date();
  const parts = [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
  return parts.map((part) => String(part).padStart(2, '0')).join('');
}

function trialRecord(phone) {
  if (!usage.has(phone)) usage.set(phone, { freeDocuments: 0, premiumUntil: 0 });
  return usage.get(phone);
}

function hasPremiumAccess(phone) {
  return trialRecord(phone).premiumUntil > Date.now();
}

app.get('/api/access/:phone', (req, res) => {
  const phone = normalisePhone(req.params.phone);
  const record = trialRecord(phone);
  res.json({ phone, freeLimit: trialLimit, freeUsed: record.freeDocuments, freeRemaining: Math.max(0, trialLimit - record.freeDocuments), premium: hasPremiumAccess(phone), premiumUntil: record.premiumUntil || null });
});

app.post('/api/documents/claim', (req, res) => {
  const phone = normalisePhone(req.body.phone);
  if (!phone) return res.status(400).json({ error: 'A valid Kenyan phone number is required.' });
  const record = trialRecord(phone);
  if (!hasPremiumAccess(phone) && record.freeDocuments >= trialLimit) return res.status(402).json({ error: 'Your three free documents have been used. Please pay to continue.', requiresPayment: true });
  if (!hasPremiumAccess(phone)) record.freeDocuments += 1;
  return res.json({ allowed: true, freeUsed: record.freeDocuments, freeRemaining: Math.max(0, trialLimit - record.freeDocuments), premium: hasPremiumAccess(phone) });
});

async function darajaToken() {
  const base = process.env.MPESA_ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
  const credentials = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  const response = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${credentials}` } });
  if (!response.ok) throw new Error(`Daraja token request failed: ${response.status}`);
  return { token: (await response.json()).access_token, base };
}

app.post('/api/payments/stk-push', async (req, res) => {
  try {
    const phone = normalisePhone(req.body.phone);
    if (!/^2547\\d{8}$/.test(phone)) return res.status(400).json({ error: 'Enter a valid Safaricom number, for example 0712345678.' });
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET || !process.env.MPESA_SHORTCODE || !process.env.MPESA_PASSKEY || !process.env.MPESA_CALLBACK_URL) return res.status(503).json({ error: 'M-Pesa is not configured. Add Daraja credentials and an HTTPS callback URL on the server.' });

    const { token, base } = await darajaToken();
    const time = timestamp();
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${time}`).toString('base64');
    const checkout = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: time,
      TransactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
      Amount: planAmount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'KenyaTeacherToolkit',
      TransactionDesc: 'Teacher Toolkit premium access'
    }) });
    const result = await checkout.json();
    if (!checkout.ok || result.ResponseCode !== '0') return res.status(502).json({ error: result.errorMessage || result.ResponseDescription || 'M-Pesa request failed.' });
    payments.set(result.CheckoutRequestID, { phone, status: 'pending', createdAt: Date.now() });
    return res.json({ ok: true, checkoutRequestId: result.CheckoutRequestID, customerMessage: result.CustomerMessage || 'Check your phone and enter your M-Pesa PIN.' });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to start M-Pesa payment.', detail: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

app.get('/api/payments/:checkoutRequestId', (req, res) => {
  const payment = payments.get(req.params.checkoutRequestId);
  if (!payment) return res.status(404).json({ error: 'Payment not found.' });
  res.json({ status: payment.status });
});

app.post('/api/mpesa/callback', (req, res) => {
  const callback = req.body?.Body?.stkCallback;
  if (!callback) return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid callback payload' });
  const payment = payments.get(callback.CheckoutRequestID);
  if (payment) {
    payment.status = callback.ResultCode === 0 ? 'paid' : 'failed';
    if (callback.ResultCode === 0) {
      const record = trialRecord(payment.phone);
      record.premiumUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
    }
  }
  return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

app.listen(port, () => console.log(`Payment service listening on port ${port}`));

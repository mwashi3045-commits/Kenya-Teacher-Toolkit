# Monetisation setup

The app now has a server-side monetisation starter for a **3-document free trial**, followed by paid premium access through Safaricom M-Pesa Daraja STK Push.

## Access model

- A teacher enters a phone number.
- The server allows three document claims per phone number.
- The fourth claim returns HTTP `402` and requires payment.
- A successful payment grants 30 days of premium access in this starter implementation.
- The usage store is currently in memory for development only. Replace it with a database before launch; otherwise a server restart resets usage and access.

## Run locally

```bash
npm install
cp .env.example .env
npm start
```

The service listens on `http://localhost:8787` by default.

## Production requirements

1. Create a Daraja app and obtain the consumer key and secret.
2. Obtain a shortcode, passkey and approved business details.
3. Deploy this service behind HTTPS with a public callback URL.
4. Set `MPESA_ENV=production` only after Safaricom approval and end-to-end testing.
5. Move `usage` and `payments` to a durable database and make the callback idempotent.
6. Authenticate document claims with real user accounts; do not use a phone number alone as identity.
7. Never place Daraja secrets in browser JavaScript or static files.

This repository contains the payment-service foundation, not a live payment account. You must supply credentials, hosting, an HTTPS callback, business verification and a database before charging real users.

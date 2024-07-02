# ParcelPortal-Backend

## Dependencies Installation

```bash
$ npm install
```

## Environment Variables

Rename .env.example to .env and set these variables.

### 1: MONGODB_URI

```bash
MONGODB_URI="mongodb connection string"
```

### 2: JWT Secret

```bash
# It can be any string value.
JWT_SECRET="secret"
```

### 3: Google OAuth 2.0

https://support.google.com/cloud/answer/6158849?hl=en

```bash
G_AUTH_CLIENT_ID="google oauth client id"
G_AUTH_CLIENT_SECRET="google oauth client secret"
```

#### JavaScript Origins

```bash
http://localhost
http://localhost:3000
```

#### Redirect URL

```bash
http://localhost:5173/google/redirect
```

### 4: Cloudflare Turnstile Captcha

[Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)

```bash
TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET=""
```

### 5: EasyPost API Key

[EasyPost API Key](https://www.easypost.com/account/settings?tab=api-keys)

[EasyPost Carriers](https://www.easypost.com/account/settings?tab=carriers)

```bash
EASY_POST_API_KEY=""
USPS_CARRIER_ACCOUNT_ID=""
UPS_CARRIER_ACCOUNT_ID=""
```

### 6: Stripe Secret Key and Webhook Secret

```bash
# You can get these values from your stripe account.
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

### 7: Cryptomus API Key and Merchant ID

```bash
# Cryptomus
CRYPTOMUS_API=
CRYPTOMUS_MERCHANT_ID=
```

### 8: Labelaxxess API Key

```bash
LABELAXXESS_API_KEY=""
```

### 9: Cloudinary Setup

[Cloudinary Dashboard](https://console.cloudinary.com/pm)
1. Copy your cloud name, api key and api secret from the dashboard.
2. Allow delivery of PDF and ZIP files in the settings > security

```bash
CLOUDINARY_NAME="" # cloud name
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

# Run the app

```bash
# development mode
$ npm run dev
```

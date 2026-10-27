# OIMO Clothing Store

OIMO is a Next.js storefront with a product catalog, cart, checkout, customer accounts, and an admin area.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set a long, private `AUTH_SECRET`.
3. Initialize the local SQLite database and add the starter catalog:

   ```bash
   npm run db:generate
   npm run db:init
   npm run db:seed
   ```

4. Start the site with `npm run dev`.

Create an account, then promote it to administrator with `npm run make-admin -- your@email.com`.

## Orders

Checkout saves an order using prices and stock from the database, then opens a prefilled Telegram or WhatsApp message. The customer reviews the message and sends it from the messenger. The public contact settings are `NEXT_PUBLIC_TELEGRAM_USERNAME` and `NEXT_PUBLIC_WHATSAPP_NUMBER`; they default to the OIMO contacts supplied for this store.

Online payment is disabled. Administrators can update order and manually recorded payment statuses from the admin area.

## Storage before deployment

The example configuration uses SQLite, and product uploads are written to `public/images/uploads`. Choose persistent database and image storage before deploying to a host whose application filesystem is temporary or shared across multiple instances.

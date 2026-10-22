# CrapCart Project: Session Summary & Deployment Guide

> **Date:** October 22, 2026  
> **Repository:** [https://github.com/jeeva2818/CrapCart.git](https://github.com/jeeva2818/CrapCart.git)  
> **Live Frontend Domain:** [https://crapcart.vercel.app](https://crapcart.vercel.app)

---

## 1. Summary of Changes Completed

### A. Branding & Identity
* **Shop Name:** Set to `ℭ𝔯𝔞𝔭ℭ𝔞𝔯𝔱` (Gothic Fraktur font) on both the browser tab (`index.html`) and the top navbar (`NavBar.tsx`).
* **Favicon & Logo:** Connected custom circular Joker card logo (`client/public/joker.jpg`).
* **Browser Tab Favicon:** Fixed to load `j.jpg` / `joker.jpg` with cache-busting.

### B. High-Contrast Red, Black & White UI Redesign
* **Ambient Background (`App.tsx`):**
  * Center: Rich, vibrant crimson red radial gradient (`#99101f` ➔ `#680813`).
  * Edges: Smooth vignette fading into deep midnight black (`#080102`).
  * Full 100% viewport span without layout constraints (`styles.css`).
* **Top Navigation Bar (`NavBar.tsx`):**
  * Left: Circular Joker logo + `ℭ𝔯𝔞𝔭ℭ𝔞𝔯𝔱` + Dark/Light mode toggle switch.
  * Center: Rounded search bar with magnifying glass icon (dispatches `setSearchTerm`).
  * Right: Catalog link, Shopping Cart with badge, and prominent **LOGIN** & **REGISTER** buttons.
  * Removed GitHub and external portfolio links.

### C. 4-Column Clickable Product Boxes
* **Product Card (`ProductCard.tsx`):**
  * Removed the old `ADD TO CART` and `VIEW` buttons from the card.
  * Entire card is a solid, clickable box: clicking anywhere navigates to `/catalog/{id}`.
  * Edge-to-edge full-bleed image box (`objectFit: 'cover'`).
  * Removed the "Free delivery" badge for a sleek, uncluttered presentation.
  * Pure white title and bold price (`$180.00`) with emerald green `● In stock` badge.
* **Catalog Grid (`ProductList.tsx` & `catalog.tsx`):**
  * Compact filter sidebar width (`size={{ xs: 12, md: 2.5 }}`).
  * Wide product area (`size={{ xs: 12, md: 9.5 }}`) displaying **4 cards per row** (`size={{ xs: 12, sm: 6, md: 3, lg: 3 }}`).

### D. Direct Buy on Product Details Page (`ProductDetails.tsx`)
* Added two prominent action buttons side-by-side with quantity input:
  1. **`ADD TO CART`:** Adds item/quantity to cart with success toast.
  2. **`DIRECT BUY`:** Glowing crimson button that instantly adds the item and redirects directly to `/checkout` (Stripe payment section).

### E. Vercel & CORS Compatibility
* **SPA Routing:** Added [`client/vercel.json`](./client/vercel.json) with `/(.*) -> /index.html` rewrites to prevent 404s on page refresh.
* **CORS Policy:** Updated [`Gateway.API/Program.cs`](./Gateway.API/Program.cs) to dynamically allow `https://crapcart.vercel.app` and all Vercel preview domains with credentials.
* **Cross-Domain Auth Cookies:** Configured [`Identity.API/Program.cs`](./Identity.API/Program.cs) with `SameSite = None` and `Secure = Always`.

---

## 2. How to Start the Project in the Future

Whenever you want to test or demo your live website, follow these 2 steps:

### Step 1: Start Microservices Backend
Open PowerShell:
```powershell
cd d:\E-Commerse
.\start-microservices.ps1
```

### Step 2: Start Cloudflare Tunnel
In a second PowerShell window:
```powershell
cd d:\E-Commerse
.\cloudflared.exe tunnel --url https://localhost:7000 --no-tls-verify
```

### Step 3: Open Your Live Website
Open your browser at:
**[https://crapcart.vercel.app](https://crapcart.vercel.app)**

---

## 3. Environment Variables Reference

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| **`VITE_STRIPE_PK`** | `pk_test_51UJSS4HpQgwLckPrvg67IzpkTIoZCOfVDVXi75u0lOT7vHNzBOl6iwPJA24Hhc3fyEERm0yAtWupxif9MkuRetDC00RdNnovaS` | Stripe Publishable Test Key |
| **`VITE_API_URL`** | `https://<tunnel-subdomain>.trycloudflare.com/api` | Public Gateway URL bridge |

---

## 4. Next Step: Permanent 24/7 Cloud Hosting
When you want the backend to stay online 24/7 without needing your PC on:
1. Set up a free **Oracle Cloud Always Free VM** or a $4/month **Linux VPS** (Hetzner / DigitalOcean).
2. Run the services via `docker-compose.yml`.
3. Point `VITE_API_URL` to your permanent cloud server domain.

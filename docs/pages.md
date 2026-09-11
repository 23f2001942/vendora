# Pages & Routes

## Public (no login required)

| Route | File | What it does |
|-------|------|-------------|
| `/` | `pages/Index.tsx` | Landing page — hero, features, CTA to login/register |
| `/products` | `pages/public/Products.tsx` | Browse all products publicly |
| `/products/:id` | `pages/public/ProductDetail.tsx` | Single product detail |
| `/retailers` | `pages/public/Retailers.tsx` | Browse all retailers |
| `/retailers/:id` | `pages/public/RetailerStorefront.tsx` | Retailer's storefront |
| `*` | `pages/NotFound.tsx` | 404 fallback |

## Auth

| Route | File | What it does |
|-------|------|-------------|
| `/login` | `pages/auth/Login.tsx` | Email + Google login. Checks auth provider via edge function before showing form. |
| `/register` | `pages/auth/Register.tsx` | Sign up with role selection (customer / retailer / wholesaler) + address |
| `/reset-password` | `pages/auth/ResetPassword.tsx` | Password reset flow |
| `/onboarding` | `pages/Onboarding.tsx` | Post-signup step — collects business info for retailer/wholesaler, address for customer |

## Customer

| Route | File | What it does |
|-------|------|-------------|
| `/customer/dashboard` | `pages/customer/Dashboard.tsx` | Home feed — product listings from nearby retailers |
| `/customer/retailers` | `pages/customer/Retailers.tsx` | Browse retailers |
| `/customer/retailers/:id` | `pages/customer/RetailerProducts.tsx` | Products from a specific retailer |
| `/customer/products/:id` | `pages/customer/ProductDetail.tsx` | Product detail with add-to-cart |
| `/customer/cart` | `pages/customer/Cart.tsx` | Cart and checkout |
| `/customer/orders` | `pages/customer/Orders.tsx` | Order history and tracking |
| `/customer/profile` | `pages/customer/Profile.tsx` | Profile and address management |

## Retailer

| Route | File | What it does |
|-------|------|-------------|
| `/retailer/dashboard` | `pages/retailer/Dashboard.tsx` | Analytics — revenue, orders, stock overview |
| `/retailer/products` | `pages/retailer/Products.tsx` | Manage product listings and stock |
| `/retailer/pending-products` | `pages/retailer/PendingProducts.tsx` | Products requested from wholesalers awaiting approval |
| `/retailer/orders` | `pages/retailer/Orders.tsx` | Incoming customer orders |
| `/retailer/orders/:id` | `pages/retailer/OrderDetail.tsx` | Order detail and status management |
| `/retailer/order-management` | `pages/retailer/OrderManagement.tsx` | Bulk order management view |
| `/retailer/wholesalers` | `pages/retailer/Wholesalers.tsx` | Browse wholesalers to order from |
| `/retailer/wholesalers/:id` | `pages/retailer/WholesalerProducts.tsx` | Products from a specific wholesaler |
| `/retailer/profile` | `pages/retailer/Profile.tsx` | Business profile management |

## Wholesaler

| Route | File | What it does |
|-------|------|-------------|
| `/wholesaler/dashboard` | `pages/wholesaler/Dashboard.tsx` | Analytics — B2B orders, revenue, stock overview |
| `/wholesaler/products` | `pages/wholesaler/Products.tsx` | Manage bulk product listings and MOQ |
| `/wholesaler/orders` | `pages/wholesaler/Orders.tsx` | Incoming retailer orders |
| `/wholesaler/order-management` | `pages/wholesaler/OrderManagement.tsx` | Approve or reject retailer orders |
| `/wholesaler/profile` | `pages/wholesaler/Profile.tsx` | Business profile management |

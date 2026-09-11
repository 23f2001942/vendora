# Database

PostgreSQL via Supabase. All tables have RLS enabled — users can only access their own data.

---

## Tables

### profiles
One row per user, created automatically on signup. Stores name, phone, avatar, default address, and `role` (`customer` / `retailer` / `wholesaler`).

### retailers
Business profile for retailer users — shop name, address, lat/lon, delivery radius. Created during onboarding.

### wholesalers
Business profile for wholesaler users — business name, address, lat/lon, service areas, minimum order value. Created during onboarding.

### products
Master product catalog. Wholesalers create products here with a base price, category, and image.

### wholesaler_products
A wholesaler's listing of a product — their wholesale price, minimum order quantity, stock level.

### retailer_products
A retailer's listing of a product to customers — their retail price, stock, availability.

### cart_items
Products a user has added to cart before checkout. References user, product, and seller.

### orders
An order between buyer and seller. `order_type` is either `customer_to_retailer` (B2C) or `retailer_to_wholesaler` (B2B).

### order_items
Line items inside an order — product, quantity, unit price, subtotal.

### customer_addresses
Saved address book for customers — multiple addresses labelled Home/Work/etc. with lat/lon and a default flag.

### delivery_tracking
One tracking record per order — delivery partner info, tracking number, current status, ETA, live coordinates.

### delivery_status_history
Append-only log of every status change for a delivery (pending → packed → picked up → in transit → delivered).

### feedback
Ratings and comments after an order — links reviewer, reviewee, product, and order.

### notifications
In-app notifications per user — order updates, delivery status changes. Has `is_read` flag.

---

## Relationships

```
profiles (role: customer/retailer/wholesaler)
  ├── retailers (user_id)
  │     └── retailer_products (retailer_id → products)
  ├── wholesalers (user_id)
  │     └── wholesaler_products (wholesaler_id → products)
  ├── orders as buyer_id
  ├── orders as seller_id
  ├── cart_items (user_id)
  ├── customer_addresses (user_id)
  ├── notifications (user_id)
  └── feedback as reviewer_id / reviewee_id

orders
  ├── order_items (order_id)
  └── delivery_tracking (order_id)
        └── delivery_status_history (delivery_tracking_id)
```

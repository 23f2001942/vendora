# API Reference

## Base URLs

- REST API: `https://ttwjflzfghlpsoyncecg.supabase.co/rest/v1`
- Edge Functions: `https://ttwjflzfghlpsoyncecg.supabase.co/functions/v1`

All requests require an `Authorization: Bearer <JWT>` header. The Supabase client handles this automatically.

---

## Edge Functions

### check-auth-provider
Checks which auth provider a given email uses before login — so the UI knows whether to show the password form or the Google button.

- **Endpoint:** `POST /functions/v1/check-auth-provider`
- **Auth:** Not required (JWT verification OFF)
- **Body:** `{ "email": "user@example.com" }`
- **Response:** `{ "auth_provider": "email" | "google" }`

### seed-wholesaler-products
Seeds 24 demo products across 9 categories for the authenticated wholesaler. Used to populate a fresh wholesaler account for testing.

- **Endpoint:** `POST /functions/v1/seed-wholesaler-products`
- **Auth:** Required (JWT verification ON)
- **Body:** `{}`

---

## Common Supabase queries

### Auth

```typescript
// Sign up
supabase.auth.signUp({ email, password, options: { data: { full_name } } })

// Sign in
supabase.auth.signInWithPassword({ email, password })

// Google OAuth
supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/onboarding` } })

// Sign out
supabase.auth.signOut()
```

### Products

```typescript
// All products (with retailer listings)
supabase.from('products').select('*, retailer_products(*)')

// Products by category
supabase.from('products').select('*').eq('category', 'electronics')
```

### Orders

```typescript
// Create order + items
const { data: order } = await supabase.from('orders').insert({ buyer_id, seller_id, order_type, total_amount, delivery_address }).select().single()
await supabase.from('order_items').insert([{ order_id: order.id, product_id, quantity, unit_price, subtotal }])

// Fetch orders as buyer
supabase.from('orders').select('*, seller:profiles!seller_id(*), order_items(*, product:products(*))').eq('buyer_id', userId)

// Update order status
supabase.from('orders').update({ status: 'confirmed' }).eq('id', orderId)
```

### Notifications

```typescript
// Fetch unread
supabase.from('notifications').select('*').eq('user_id', userId).eq('is_read', false)

// Real-time subscription
supabase.channel('notifications')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, handler)
  .subscribe()
```

---

## Error codes

| Code | Meaning |
|------|---------|
| 401 | Not authenticated |
| 403 | RLS blocked — user doesn't have access |
| 404 | Row not found |
| 409 | Unique constraint violation |
| 500 | Server error |

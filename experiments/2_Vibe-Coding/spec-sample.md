# 🍽️ Food Ordering App -- FoodDash -- Prototype Spec (MD)

## 1) Vision & Scope

-   **Goal:** A browser-based food ordering app where customers browse a menu, place orders, and track them — while admins manage the full catalog and order queue.

## 2) Roles & Access

### Role: Customer

- How identified: `role: "customer"` in stored user object
- Default seed account: `user@demo.com` / `demo1234`

### Role: Admin

- How identified: `role: "admin"` in stored user object
- Default seed account: `admin@demo.com` / `admin1234`

Role is set at registration. For the prototype, an "admin" checkbox on the registration form is acceptable.


## 3) Functional Requirements

-   **Auth**
    -   Register: Full Name, Email, Password, Confirm Password, Role (admin checkbox).
    -   Login/Logout with session persistence across page refresh.
    -   Passwords stored as plain-text (prototype only, no hashing).
    -   On app load, restore session if present.
-   **Menu Browsing (Customer)**
    -   Grid of available menu items (unavailable items hidden).
    -   Filter by category tabs: All | Pizza | Burger | Salad | Dessert | Drink.
    -   Search by item name (client-side filter).
    -   Each card shows: image, name, description (truncated), price, "Add to Cart" button.
-   **Cart (Customer)**
    -   Cart icon in nav shows item count badge.
    -   Cart page shows: item list, quantities (+/−), remove button, subtotal, optional notes textarea.
    -   "Place Order" → validates cart not empty → saves order → clears cart → redirects to `/orders`.
-   **My Orders (Customer)**
    -   List of own orders (filtered by `customerId`), newest first.
    -   Each order card: order ID (short), date, item summary, total, status badge.
    -   Status badge colors: pending=yellow, preparing=blue, ready=green, delivered=grey, cancelled=red.
    -   Customer can cancel an order only if status is `pending`.
-   **Menu Management (Admin)**
    -   View all items including unavailable (`/admin/menu`).
    -   Add menu item: Name, Description, Category (dropdown), Price, Image URL, Available (toggle).
    -   Edit menu item: pre-fill form with existing data.
    -   Delete menu item: confirmation dialog; warn if item in active orders but allow deletion.
    -   Toggle availability: quick toggle inline, no full edit form needed.
-   **Order Management (Admin)**
    -   View all orders from all customers, newest first (`/admin/orders`).
    -   Filter by status tabs: All | Pending | Preparing | Ready | Delivered | Cancelled.
    -   Update order status via inline dropdown; updates `updatedAt` timestamp.
    -   Cancelled orders cannot be changed further.

## 4) Non-Functional

-   **Offline:** No backend required — all data persisted client-side.
-   **Perf:** App load < 2s on modern browsers.
-   **Security (prototype-level):** Client-side storage is user-visible (acceptable for prototype). No real password hashing. No PII beyond name/email.
-   **UX Aesthetic:** Warm, appetizing, modern food app. Editorial menu meets clean SaaS dashboard.
    -   Primary color: `#E85D04` (warm orange)
    -   Background: `#FFFBF5` (warm off-white)
    -   Surface: `#FFFFFF` with `shadow-sm`
    -   Text primary: `#1A1A2E`; Text muted: `#6B7280`
    -   Font display: `Playfair Display` (headings); Font body: `DM Sans` (UI text)
    -   Border radius: `rounded-2xl` for cards, `rounded-lg` for buttons
    -   Card style: white bg, subtle shadow, hover lift (translateY -2px + shadow-md)
-   **Mobile-first:** All layouts must work at 375px width.

## 5) UI/Flows

-   **Nav (Customer):** Logo | Menu | My Orders | Cart (badge) | Logout
-   **Nav (Admin):** Logo | Menu Mgmt | Orders | Logout
-   **Routes:**
    -   `/login` — Login form (default for unauthenticated)
    -   `/register` — Registration form
    -   `/menu` — Browse food (customer + admin)
    -   `/cart` — Review & place order (customer only)
    -   `/orders` — Order history (customer only)
    -   `/admin` — Dashboard with summary stats (admin only)
    -   `/admin/menu` — Menu item management (admin only)
    -   `/admin/orders` — All orders management (admin only)
-   **Route guards:** Unauthenticated → `/login`. Customer accessing `/admin/*` → `/menu`. Admin may also view `/menu` and `/orders`.
-   **States to implement:**
    -   Empty cart → illustration + "Browse the menu" CTA
    -   Empty orders → "No orders yet" message
    -   Loading → skeleton loaders
    -   Form errors → inline, below field, red text
    -   Success actions → toast notification (top-right, 3s auto-dismiss)

## 6) Data Model (JSON)

```json
// User
{ "id": "uuid-v4", "name": "Jane Doe", "email": "jane@example.com", "passwordHash": "plain-text for prototype", "role": "customer | admin", "createdAt": "ISO8601" }

// MenuItem
{ "id": "uuid-v4", "name": "Margherita Pizza", "description": "Classic tomato and mozzarella", "category": "Pizza | Burger | Salad | Dessert | Drink", "price": 12.99, "imageUrl": "https://...", "available": true, "createdAt": "ISO8601" }

// Order
{ "id": "uuid-v4", "customerId": "uuid-v4", "customerName": "Jane Doe", "items": [{ "menuItemId": "uuid", "name": "Margherita Pizza", "price": 12.99, "quantity": 2 }], "totalPrice": 25.98, "status": "pending | preparing | ready | delivered | cancelled", "notes": "Extra cheese please", "createdAt": "ISO8601", "updatedAt": "ISO8601" }
```

## 7) Seed Data

Pre-populate on first app load (if no menu data exists yet):

-   **Menu items (minimum 10):** 2× Pizza, 2× Burger, 2× Salad, 2× Dessert, 2× Drink. Use Unsplash food URLs for images. Prices range $4.99–$22.99.
-   **Users (2 seed accounts):** `user@demo.com` / `demo1234` (customer, "Demo User") and `admin@demo.com` / `admin1234` (admin, "Admin").
-   **Orders (3 seed orders):** One in each status (pending, preparing, delivered) for `user@demo.com`.

## 8) Acceptance Criteria

-   [ ] A new user can register, log in, and log out successfully.
-   [ ] A customer can browse the menu, filter by category, and search by name.
-   [ ] A customer can add items to cart, adjust quantities, add notes, and place an order.
-   [ ] Placed orders appear in "My Orders" with correct status.
-   [ ] A customer can cancel a `pending` order.
-   [ ] An admin can add, edit, delete, and toggle availability of menu items.
-   [ ] An admin can view all orders and change their status.
-   [ ] Refreshing the browser preserves session and all data.
-   [ ] All routes are role-protected — no unauthorized access.
-   [ ] The app works at 375px (mobile) without broken layouts.
-   [ ] Demo seed data loads automatically on first visit.

## 9) Constraints

### ✅ Always do
-   Validate all forms before writing to storage.
-   Guard all routes by role.
-   Show loading/empty/error states for all data views.

### 🚫 Never do
-   Make any backend API calls.
-   Implement real password hashing (prototype only).
-   Build payment processing.
-   Add social login / OAuth.
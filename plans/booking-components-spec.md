## Booking Components Spec

### Shared Principles
- All components live under `src/lib/components` and ship TypeScript-friendly props.
- Prefer data-down/events-up: components emit DOM events instead of mutating global state.
- Provide sensible defaults/mocks so Storybook/Playground renders without backend data.
- Scope styles within each Svelte file using component-level selectors; avoid global leakage.

### `ServiceCatalog.svelte`
- **Purpose**: Display a browsable list/grid of services with light-weight filtering and selection feedback.
- **Props**
  - `services: ServiceSummary[]` – required list; component renders loading/empty states when length is `0`.
  - `selectedServiceId?: string` – highlights the currently selected card.
  - `filters?: { categories?: string[]; priceRange?: [number, number]; query?: string }` – optional filter metadata for header chips/search inputs.
  - `layout?: 'grid' | 'list'` – defaults to `'grid'`.
  - `isLoading?: boolean` – toggles skeleton placeholders.
- **Events**
  - `select` – detail `{ service: ServiceSummary }` when a card/button is clicked.
  - `filterChange` – detail `{ key: string; value: unknown }` whenever a filter control changes.
- **Interface**
  ```ts
  export type ServiceSummary = {
    id: string;
    name: string;
    category: string;
    durationMins: number;
    price: number;
    rating?: number;
    thumbnailUrl?: string;
    tags?: string[];
  };
  ```
- **States**
  - Empty view messaging when `services.length === 0 && !isLoading`.
  - Skeleton tiles when `isLoading`.
  - Active card border when `selectedServiceId` matches.
- **Testing hooks**
  - data attributes `data-testid="service-card"` and `data-testid="filter-chip"`.

### `BookingForm.svelte`
- **Purpose**: Collect booking details—service, staff, date, time, notes—while surfacing validation state.
- **Props**
  - `booking: Partial<BookingDraft>` – source of controlled values; sensible defaults when omitted.
  - `services: ServiceSummary[]` – for service selector.
  - `staffMembers?: StaffSummary[]` – optional list; hide selector if absent.
  - `availability?: AvailabilitySlot[]` – used to populate date/time pickers.
  - `minDate?: Date | string` / `maxDate?: Date | string` – for calendar bounds.
  - `isSubmitting?: boolean`, `errors?: Record<keyof BookingDraft, string | undefined>`.
- **Events**
  - `change` – detail `{ field: keyof BookingDraft; value: unknown }` for every control.
  - `submit` – native form submit event; preventDefault internally when invalid.
- **Interfaces**
  ```ts
  export type BookingDraft = {
    serviceId: string;
    staffId?: string;
    date: string; // ISO yyyy-mm-dd
    time: string; // HH:mm
    notes?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  };

  export type StaffSummary = {
    id: string;
    name: string;
    avatarUrl?: string;
    specialties?: string[];
  };

  export type AvailabilitySlot = {
    date: string; // ISO date
    times: string[]; // HH:mm strings
    staffId?: string;
  };
  ```
- **Behavior**
  - Internal derived state for `availableTimes` given selected date/service/staff.
  - Visual validation (aria-invalid, helper text) driven by `errors`.
  - Disable submit button when required fields missing or `isSubmitting`.

### `PriceSummary.svelte`
- **Purpose**: Present pricing line-items (service cost, add-ons, taxes, discounts) with computed totals.
- **Props**
  - `items: PriceLineItem[]` – required list.
  - `currency?: string` – ISO code, default `'USD'`.
  - `showDiscountInput?: boolean` – toggles promo code entry.
  - `totals?: { subtotal?: number; taxes?: number; discounts?: number; grandTotal: number }` – override auto-calculation when provided.
  - `isCompact?: boolean` – switches typography/layout.
- **Events**
  - `applyDiscount` – detail `{ code: string }` from promo input.
- **Interfaces**
  ```ts
  export type PriceLineItem = {
    id: string;
    label: string;
    amount: number;
    type?: 'base' | 'addon' | 'tax' | 'discount';
    meta?: string;
  };
  ```
- **Behavior**
  - Derived subtotal = sum of positive `amount`s.
  - Discounts displayed with negative styling.
  - Grand total emphasized; emits nothing on mere display interactions.

### `BookingConfirmation.svelte`
- **Purpose**: Show booking success/error states with metadata summary and follow-up CTAs.
- **Props**
  - `booking: BookingSummary | null` – when null + `errorMessage`, show failure view.
  - `status: 'loading' | 'success' | 'error'` – drives skeleton/spinner vs content.
  - `supportContact?: { phone?: string; email?: string }`.
  - `actions?: ConfirmationAction[]` – custom CTA buttons/links.
- **Events**
  - `action` – detail `{ id: string }` when a CTA is clicked.
- **Interfaces**
  ```ts
  export type BookingSummary = {
    reference: string;
    serviceName: string;
    scheduledFor: string; // ISO datetime
    location?: string;
    staffName?: string;
    price?: number;
    notes?: string;
  };

  export type ConfirmationAction = {
    id: string;
    label: string;
    href?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: string;
  };
  ```
- **States**
  - Loading skeleton for cards while `status === 'loading'`.
  - Success badge + metadata grid when `status === 'success'`.
  - Error panel when `status === 'error'` with retry CTA.

### Mock/Story Hooks
- Provide `export const MOCK_*` objects per component to support Storybook/testing.
- Favor deterministic mock data (no `Date.now()` without seeding).
- Include brief usage examples in component JSDoc blocks referencing these types.

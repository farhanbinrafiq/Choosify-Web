# Customer Address Management System

LE-006 UX-01 introduces CAMS as Choosify's reusable delivery location engine.

## Purpose

CAMS replaces one-off free-text delivery fields with a structured **Address Book** that can support:

- Marketplace orders
- Restaurant / grocery / pharmacy delivery
- Hotel, travel, rentals, logistics, and appointments
- Regional analytics and delivery density planning

The first implementation is frontend/localStorage based and lives inside:

`Dashboard -> Profile Settings -> My Addresses`

## Address Hierarchy

Each saved address stores the official location hierarchy as IDs plus user-visible labels:

1. Country
2. Division / State / Province
3. District
4. Upazila / Thana
5. Union / Ward (optional)
6. City / Municipality
7. Postal Code
8. Area / Block / Road
9. House / Building / Apartment
10. Floor / Unit (optional)
11. Landmark (optional)
12. Delivery Instructions (optional)

Required fields:

- Country
- Division
- District
- City
- Postal Code
- Area / Block / Road
- House / Building / Apartment

## Location IDs

Official location data is stored by stable internal IDs, not only display names.

Example:

```text
Country: Bangladesh -> BD
Division: Chattogram -> BD-20
District: Cox's Bazar -> BD-20-CXB
Upazila: Cox's Bazar Sadar -> BD-20-CXB-CXB
City: Cox's Bazar Municipality -> BD-20-CXB-CXB-CMC
Postal Code: 4700 -> BD-20-CXB-CXB-4700
```

This enables analytics such as orders by division, delivery density, regional demand, top products by city, and campaign targeting without parsing free-text addresses.

## Bangladesh Dataset

Seed data is defined in:

`src/lib/address/bangladeshLocations.ts`

It includes:

- Bangladesh country node
- All 8 divisions
- Seeded high-demand districts, upazilas/thanas, cities, and postal codes
- Dependent lookup helpers for cascading dropdowns

The dataset is intentionally structured so it can be expanded to the complete government/partner dataset without changing the Address Book UI.

## Address Record

Types live in:

`src/lib/address/addressTypes.ts`

Core fields:

- `id`
- `label` (`Home`, `Office`, `Parents`, etc.)
- `type`
- `location`
- `area`
- `houseOrBuilding`
- `isDefault`
- `isCustomLocation`
- `verificationStatus`
- timestamps

Reserved future fields:

- `latitude`
- `longitude`
- `mapProviderId`
- `deliveryZoneId`
- `gateCode`

These are stored in the type model but not exposed in the UI yet.

## Custom Locations

If users cannot find an official location, they can choose **Use Custom Area** or request a missing location.

Custom area values are stored separately:

- `customArea`
- `isCustomLocation = true`

This allows admins to review and normalize those entries later without losing user intent.

## Address Verification Status

Each address has a lightweight logistics confidence state:

- `verified` — successfully used in previous deliveries
- `new` — saved but not used yet
- `needs_attention` — incomplete or associated with a failed delivery

The first UI defaults new addresses to `new`. Future order/delivery systems can update status after fulfillment.

## Default Address Flow

Addresses are stored in `DashboardContext` and persisted under:

`choosify_customer_addresses`

The context exposes:

- `customerAddresses`
- `defaultCustomerAddress`
- `addCustomerAddress`
- `updateCustomerAddress`
- `deleteCustomerAddress`
- `setDefaultCustomerAddress`

Rules:

- First saved address becomes default automatically
- Only one address can be default
- If the default is deleted, the next available address becomes default
- Changing default updates future checkout consumers through context

## Checkout Integration

Checkout UI was intentionally not changed in LE-006 UX-01.

Future checkout should consume:

```ts
const { customerAddresses, defaultCustomerAddress, setDefaultCustomerAddress } = useDashboard();
```

Expected UX:

- Show saved addresses as radio cards
- Preselect `defaultCustomerAddress`
- Provide `+ Add New Address`
- Persist chosen default for future checkouts

No manual retyping is required once checkout consumes CAMS.

## Future Extensibility

All future services should reuse the same address model and form:

- Hotels: guest location / pickup address
- Restaurants / groceries / pharmacy: delivery zones and gate codes
- Rentals / logistics: precise unit and landmark handling
- Travel / appointments: pickup, drop-off, and service address

Avoid creating separate address forms. Add service-specific metadata through reserved fields or service-specific wrappers around `CustomerAddress`.

## Files

| File | Purpose |
|------|---------|
| `src/lib/address/addressTypes.ts` | Address and location types |
| `src/lib/address/bangladeshLocations.ts` | Bangladesh location seed and dependent lookups |
| `src/lib/address/addressUtils.ts` | Validation, formatting, default normalization |
| `src/components/address/AddressBookManager.tsx` | Dashboard Address Book UI |
| `src/context/DashboardContext.tsx` | Persistence and shared address actions |
| `src/pages/DashboardPage.tsx` | Profile Settings integration |

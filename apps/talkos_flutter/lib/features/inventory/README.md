# TalkOS inventory deduction engine

The native inventory domain uses one deduction engine for POS, kiosk and QR orders.

## Deduction timing

Order acceptance does **not** deduct stock. Stock is consumed when KDS changes an
accepted order to **Preparing / Cooking**. The KDS transition handler must call
`InventoryDeductionEngine.startCooking` exactly once for that order.

## Guarantees in this domain layer

- Recipe-based ingredient consumption, including quantities multiplied by order quantity.
- Integer micro-unit arithmetic; no floating-point stock calculations.
- Whole-order validation before mutation, so shortages never partially deduct.
- Idempotent movement IDs per order line and ingredient.
- Missing recipes block the cooking transition.
- Every movement records source channel and recipe version.
- POS, kiosk and QR share the same engine; KDS is the trigger, not a second deduction path.

## Integration boundary

This is the tested domain engine, not yet a production database transaction. The
production repository must persist the KDS status transition, stock ledger entries,
idempotency keys and new balances in one atomic transaction. If the transaction
fails, the order must remain accepted and retry safely. Offline clients must enqueue
the KDS transition and let the server apply the idempotent transaction; clients must
not independently mutate authoritative stock.

No live inventory is connected by this change. Recipes and opening balances must
come from the authorised branch inventory before production use.

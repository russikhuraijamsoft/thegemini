# TalkOS kitchen workflow

`KitchenWorkflow` owns the allowed ticket status transitions. Accepted orders can
start cooking or be cancelled; cooking tickets can become ready, and ready tickets
can be completed. Starting cooking calls the shared inventory deduction engine.

The workflow is immutable and suitable for unit tests or a repository transaction.
Production persistence must atomically store the ticket status, inventory ledger
movements, and on-hand balances. No live order feed or database adapter is connected
in this native foundation yet.

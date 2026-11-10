# TalkOS kitchen workflow

`KitchenWorkflow` owns the allowed ticket status transitions. Accepted orders can
start cooking or be cancelled; cooking tickets can become ready, and ready tickets
can be completed. Starting cooking calls the shared inventory deduction engine.

`KitchenDisplayScreen` renders tickets supplied by the branch order feed and returns
the proposed immutable next state through its callback. It disables status actions
when no persistence callback is provided and shows stock/recipe errors without
advancing the ticket.

The workflow is immutable and suitable for unit tests or a repository transaction.
Production persistence must atomically store the ticket status, inventory ledger
movements, and on-hand balances. No live order feed or database adapter is connected
in this native foundation yet.

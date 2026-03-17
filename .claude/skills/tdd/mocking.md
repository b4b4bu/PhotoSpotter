# Mocking

## When to mock

Mock only at system boundaries:

- External APIs (Stripe, Twilio, etc.)
- Databases
- Time functions (`Date.now()`, `setTimeout`)
- File system

**Do NOT mock your own code or internal collaborators.**

## Design principles

### 1. Dependency injection

Pass external dependencies in rather than creating them internally:

```typescript
// Testable — dependency injected
function sendEmail(user, emailClient) {
  return emailClient.send({ to: user.email, ... });
}

// Hard to test — dependency created internally
function sendEmail(user) {
  const client = new SendGridClient();
  return client.send({ to: user.email, ... });
}
```

### 2. SDK-style interfaces

Create specific functions for each external interaction instead of one generic handler:

```typescript
// SDK-style — clear, mockable
interface PaymentClient {
  createCharge(amount: number, token: string): Promise<Charge>;
  refundCharge(chargeId: string): Promise<Refund>;
}

// Generic — hard to mock, unclear what's being tested
interface PaymentClient {
  request(method: string, params: object): Promise<unknown>;
}
```

This eliminates conditional logic in mocks and makes it clear which endpoints are being used.

## Core principle

Mockability should be designed into your architecture from the start, particularly at integration points where your application interacts with external systems.

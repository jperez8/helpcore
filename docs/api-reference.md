# HelpCore API Reference

This document describes the public HTTP API exposed by the HelpCore backend. It covers authentication requirements, data models, and the full list of endpoints grouped by purpose. All responses use JSON and timestamps are in ISO-8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`).

---

## Base URLs

- Production: `https://{your-domain}`
- Local development: `http://localhost:3000`

All application endpoints are prefixed with `/api/*`. Webhook endpoints live at `/webhook/*`.

## Authentication

HelpCore relies on [Supabase](https://supabase.com) authentication. Acquire an access token via the `/api/auth/login` endpoint and send it on protected routes with a Bearer header:

```
Authorization: Bearer <access_token>
```

Admin-only routes additionally require that the authenticated Supabase user has a corresponding HelpCore user record with `role: "admin"`. The first authenticated user is bootstrapped as an admin automatically if the database is empty.

## Standard Error Format

| Field     | Type        | Description                                              |
|-----------|-------------|----------------------------------------------------------|
| `error`   | string      | High level error identifier or message.                  |
| `details` | array\|null | Additional validation errors (present for 400 responses) |

Examples:

```json
{ "error": "Email and password are required" }
```

```json
{
  "error": "Validation error",
  "details": [
    { "path": ["subject"], "message": "Required" }
  ]
}
```

## Common Enumerations

- Ticket status: `open`, `pending_customer`, `pending_agent`, `closed`
- Ticket priority: `low`, `medium`, `high`
- User role: `agent`, `admin`
- Message author type: `customer`, `agent`, `system`

## Core Data Models

### Ticket

| Field           | Type           | Description                                   |
|-----------------|----------------|-----------------------------------------------|
| `id`            | string (UUID)  | Ticket identifier.                            |
| `ticketNumber`  | string         | Human-friendly number (`TK-001`, ...).        |
| `subject`       | string         | Short summary of the request.                 |
| `status`        | enum           | See *Ticket status*.                          |
| `priority`      | enum           | See *Ticket priority*.                        |
| `channel`       | string         | Source channel (e.g. `web`, `whatsapp`).      |
| `customerName`  | string         | Requester full name.                          |
| `customerEmail` | string\|null   | Requester email.                              |
| `customerPhone` | string\|null   | Requester phone.                              |
| `assigneeId`    | string\|null   | Linked user ID when assigned.                 |
| `createdAt`     | string (date)  | Creation timestamp.                           |
| `updatedAt`     | string (date)  | Last modification timestamp.                  |
| `closedAt`      | string\|null   | Closure timestamp if closed.                  |
| `firstReplyAt`  | string\|null   | First agent reply timestamp.                  |
| `metadata`      | object\|null   | Custom JSON payload.                          |

### Message

| Field         | Type           | Description                                                 |
|---------------|----------------|-------------------------------------------------------------|
| `id`          | string (UUID)  | Message identifier.                                         |
| `ticketId`    | string (UUID)  | Parent ticket ID.                                           |
| `text`        | string         | Message body (plain text).                                  |
| `authorType`  | enum           | See *Message author type*.                                  |
| `authorName`  | string\|null   | Display name of the author.                                 |
| `authorId`    | string\|null   | HelpCore user ID when author is an agent.                   |
| `attachments` | object\|null   | Arbitrary JSON for attachments metadata.                    |
| `createdAt`   | string (date)  | Creation timestamp.                                         |

### ActivityLog

| Field        | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `id`         | string (UUID)  | Activity identifier.                          |
| `ticketId`   | string\|null   | Associated ticket (if any).                   |
| `actor`      | string         | Actor display name.                           |
| `actorId`    | string\|null   | HelpCore user ID when applicable.             |
| `action`     | string         | Localized description of the action.          |
| `entity`     | string         | Entity reference (e.g. `#TK-101`).            |
| `metadata`   | object\|null   | Additional JSON context.                      |
| `createdAt`  | string (date)  | Timestamp of the activity.                    |

### User

| Field       | Type           | Description                     |
|-------------|----------------|---------------------------------|
| `id`        | string (UUID)  | User identifier.                |
| `email`     | string         | Unique email address.           |
| `name`      | string         | Full name.                      |
| `role`      | enum           | See *User role*.                |
| `createdAt` | string (date)  | Creation timestamp.             |

---

## Endpoints

### Configuration

#### `GET /api/config`

Return Supabase configuration keys required by the client.

- Authentication: none

**Response `200`**

```json
{
  "supabaseUrl": "https://example.supabase.co",
  "supabaseAnonKey": "public-anon-key"
}
```

### Authentication

#### `POST /api/auth/signup`

Create a new Supabase user account.

- Authentication: none

| Body field | Type   | Required | Description                               |
|------------|--------|----------|-------------------------------------------|
| `email`    | string | Yes      | User email (must be unique).              |
| `password` | string | Yes      | Minimum 6 characters (Supabase rule).     |
| `fullName` | string | No       | Stored in Supabase `user_metadata`.       |

**Response `201`**

```json
{
  "user": {
    "id": "ff75793a-ef37-45d0-9c4c-1b9821bd75b4",
    "email": "agent@example.com",
    "user_metadata": {
      "full_name": "Agent Example"
    },
    "created_at": "2024-03-20T11:04:11.675091Z"
  },
  "session": {
    "access_token": "eyJhbGci...",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "OWehWc...",
    "user": {
      "id": "ff75793a-ef37-45d0-9c4c-1b9821bd75b4"
    }
  }
}
```

**Error codes**

- `400` when email or password is missing or Supabase rejects the request.
- `500` on unexpected failures.

#### `POST /api/auth/login`

Authenticate an existing Supabase user and obtain an access token.

- Authentication: none

| Body field | Type   | Required | Description        |
|------------|--------|----------|--------------------|
| `email`    | string | Yes      | Registered email.  |
| `password` | string | Yes      | Account password.  |

**Response `200`** – same structure as the signup response.

**Error codes**

- `400` when email or password is missing.
- `401` when Supabase rejects the credentials.
- `500` on unexpected failures.

#### `POST /api/auth/logout`

Invalidate an access token.

- Authentication: optional Bearer token (recommended)
- Headers: `Authorization: Bearer <access_token>`

**Response `200`**

```json
{ "message": "Logged out successfully" }
```

#### `GET /api/auth/session`

Validate an access token and return the associated Supabase user.

- Authentication: Bearer token required

**Response `200`**

```json
{
  "user": {
    "id": "ff75793a-ef37-45d0-9c4c-1b9821bd75b4",
    "email": "agent@example.com",
    "user_metadata": {
      "full_name": "Agent Example",
      "role": "agent"
    }
  }
}
```

**Error codes**

- `401` when the token is missing or invalid.
- `500` on unexpected failures.

### Tickets

#### `GET /api/tickets`

List tickets optionally filtered by status, priority, assignee, or channel.

- Authentication: optional Bearer token (filters apply to all tickets regardless of auth state)

| Query parameter | Type   | Description                               |
|-----------------|--------|-------------------------------------------|
| `status`        | enum   | Filter by ticket status.                  |
| `priority`      | enum   | Filter by ticket priority.                |
| `assigneeId`    | string | Filter by agent user ID.                  |
| `channel`       | string | Filter by intake channel.                 |

**Response `200`**

```json
[
  {
    "id": "0b6bf9f5-f11e-46b6-9d76-2d57b33a74d0",
    "ticketNumber": "TK-104",
    "subject": "Issue with order #1234",
    "status": "open",
    "priority": "medium",
    "channel": "web",
    "customerName": "Jane Doe",
    "customerEmail": "jane@example.com",
    "customerPhone": "+1 555 0199",
    "assigneeId": null,
    "createdAt": "2024-03-20T10:55:02.312Z",
    "updatedAt": "2024-03-20T10:55:02.312Z",
    "closedAt": null,
    "firstReplyAt": null,
    "metadata": null
  }
]
```

#### `GET /api/tickets/:id`

Fetch a single ticket along with its conversation history.

- Authentication: none

**Response `200`**

```json
{
  "ticket": {
    "id": "0b6bf9f5-f11e-46b6-9d76-2d57b33a74d0",
    "ticketNumber": "TK-104",
    "subject": "Issue with order #1234",
    "status": "open",
    "priority": "medium",
    "channel": "web",
    "customerName": "Jane Doe",
    "customerEmail": "jane@example.com",
    "customerPhone": "+1 555 0199",
    "assigneeId": null,
    "createdAt": "2024-03-20T10:55:02.312Z",
    "updatedAt": "2024-03-20T10:55:02.312Z",
    "closedAt": null,
    "firstReplyAt": null,
    "metadata": null
  },
  "messages": [
    {
      "id": "2fb9bfa3-6df3-4a9d-a3ef-b4b21c24bb9e",
      "ticketId": "0b6bf9f5-f11e-46b6-9d76-2d57b33a74d0",
      "text": "Hi, I need help with my recent order.",
      "authorType": "customer",
      "authorName": "Jane Doe",
      "authorId": null,
      "attachments": null,
      "createdAt": "2024-03-20T10:55:02.512Z"
    }
  ]
}
```

**Error codes**

- `404` when the ticket does not exist.

#### `POST /api/tickets`

Create a new ticket. The request body must respect the Ticket schema. Optional `initialMessage` is stored as the first customer message.

- Authentication: none

| Body field       | Type           | Required | Description                                               |
|------------------|----------------|----------|-----------------------------------------------------------|
| `subject`        | string         | Yes      | Ticket subject.                                           |
| `status`         | enum           | No       | Defaults to `open`.                                       |
| `priority`       | enum           | No       | Defaults to `medium`.                                     |
| `channel`        | string         | No       | Defaults to `web`.                                        |
| `customerName`   | string         | Yes      | Requester name.                                           |
| `customerEmail`  | string         | No       | Requester email.                                          |
| `customerPhone`  | string         | No       | Requester phone.                                          |
| `assigneeId`     | string         | No       | HelpCore user ID.                                         |
| `metadata`       | object         | No       | Arbitrary JSON payload.                                   |
| `initialMessage` | string         | No       | First customer message stored in the conversation thread. |

**Response `201`** – returns the created Ticket object.

**Error codes**

- `400` when validation fails (see `details` array).
- `500` on unexpected failures.

#### `POST /api/tickets/:id/messages`

Append a message to a ticket conversation.

- Authentication: none

| Body field     | Type           | Required | Description                                                        |
|----------------|----------------|----------|--------------------------------------------------------------------|
| `text`         | string         | Yes      | Message body.                                                      |
| `authorType`   | enum           | Yes      | One of `customer`, `agent`, `system`.                              |
| `authorName`   | string         | No       | Display name.                                                      |
| `authorId`     | string         | No       | Agent user ID when `authorType` is `agent`.                        |
| `attachments`  | object\|null   | No       | JSON with attachment metadata.                                     |

**Response `201`** – returns the created Message object.

**Error codes**

- `400` when validation fails.
- `404` if the ticket does not exist.
- `500` on unexpected failures.

#### `PATCH /api/tickets/:id/status`

Update the status of a ticket and record an activity log entry.

- Authentication: none

| Body field   | Type         | Required | Description                                                |
|--------------|--------------|----------|------------------------------------------------------------|
| `status`     | enum         | Yes      | New status (see *Ticket status*).                          |
| `actorName`  | string       | Yes      | Name to display in the activity log.                       |
| `actorId`    | string\|null | No       | HelpCore user ID performing the action.                    |

**Response `200`** – returns the updated Ticket.

**Error codes**

- `400` when validation fails.
- `404` when the ticket is missing.
- `500` on unexpected failures.

#### `PATCH /api/tickets/:id/priority`

Update the priority of a ticket and record the change.

- Authentication: none

| Body field   | Type         | Required | Description                                                |
|--------------|--------------|----------|------------------------------------------------------------|
| `priority`   | enum         | Yes      | New priority (see *Ticket priority*).                      |
| `actorName`  | string       | Yes      | Name to display in the activity log.                       |
| `actorId`    | string\|null | No       | HelpCore user ID performing the action.                    |

**Response `200`** – returns the updated Ticket.

**Error codes**

- `400` when validation fails.
- `404` when the ticket is missing.
- `500` on unexpected failures.

### Activity

#### `GET /api/activity`

Retrieve recent activity log entries ordered by newest first.

- Authentication: none

| Query parameter | Type   | Description                                   |
|-----------------|--------|-----------------------------------------------|
| `limit`         | number | Maximum number of records (default: `50`).    |

**Response `200`** – array of ActivityLog objects.

**Error codes**

- `500` on unexpected failures.

### Users (Admin Only)

All user management endpoints require:

- `Authorization: Bearer <access_token>`
- The authenticated Supabase user mapped to a HelpCore user with `role: "admin"`.

#### `GET /api/users`

List all HelpCore users.

**Response `200`** – array of User objects.

#### `POST /api/users`

Create a new HelpCore user and, when the environment variable `SUPABASE_SERVICE_ROLE_KEY` is configured, create a matching Supabase account.

| Body field | Type   | Required | Description                                                                   |
|------------|--------|----------|-------------------------------------------------------------------------------|
| `name`     | string | Yes      | Full name.                                                                    |
| `email`    | string | Yes      | Unique email.                                                                 |
| `role`     | enum   | No       | Defaults to `agent`.                                                          |

**Response `201`** – returns the created User.

**Error codes**

- `400` when validation fails.
- `409` when the email already exists.
- `500` on unexpected failures.

#### `PATCH /api/users/:id`

Update name, email, or role for an existing user.

| Body field | Type   | Required | Description                        |
|------------|--------|----------|------------------------------------|
| `name`     | string | No       | Updated full name.                 |
| `email`    | string | No       | Updated email (must remain unique).|
| `role`     | enum   | No       | Updated role.                      |

**Response `200`** – returns the updated User.

**Error codes**

- `400` when the request body is empty or invalid.
- `404` when the user is not found.
- `409` when the new email conflicts with another user.
- `500` on unexpected failures.

### Webhooks

#### `POST /webhook/inbound`

Create a ticket from an external system (e.g., WhatsApp integration). Protected with an API key.

- Headers:
  - `x-api-key: <WEBHOOK_API_KEY>` (defaults to `dev_key_123` if not set)
- Authentication: API key header only

| Body field      | Type   | Required | Description                                     |
|-----------------|--------|----------|-------------------------------------------------|
| `subject`       | string | Yes      | Ticket subject.                                 |
| `customerName`  | string | Yes      | Requester name.                                 |
| `customerEmail` | string | No       | Requester email.                                |
| `customerPhone` | string | No       | Requester phone.                                |
| `message`       | string | Yes      | Initial message content.                        |
| `priority`      | enum   | No       | Defaults to `medium`.                           |
| `channel`       | string | No       | Defaults to `whatsapp`.                         |

**Response `201`**

```json
{
  "success": true,
  "ticketId": "0b6bf9f5-f11e-46b6-9d76-2d57b33a74d0",
  "ticketNumber": "TK-104"
}
```

**Error codes**

- `401` when the API key is missing or invalid.
- `400` when validation fails.
- `500` on unexpected failures.

#### `POST /webhook/test/inbound`

Helper endpoint that creates a sample ticket with fixed data. Intended for manual testing of the webhook pipeline.

- Authentication: none
- Body: none

**Response `201`**

```json
{
  "success": true,
  "message": "Test ticket created successfully",
  "ticketId": "0b6bf9f5-f11e-46b6-9d76-2d57b33a74d0",
  "ticketNumber": "TK-105"
}
```

---

## Environment Variables

| Variable                     | Required | Description                                                  |
|------------------------------|----------|--------------------------------------------------------------|
| `SUPABASE_URL`               | Yes      | Supabase project URL.                                        |
| `SUPABASE_ANON_KEY`          | Yes      | Supabase public anon key for client access.                  |
| `SUPABASE_SERVICE_ROLE_KEY`  | No       | Supabase service role key (enables server-side user management). |
| `WEBHOOK_API_KEY`            | No       | Shared secret for `/webhook/inbound` (default: `dev_key_123`). |
| `PORT`                       | No       | Port to run the combined API + frontend server (default `3000`). |

---

## Example Workflow

1. **Sign in** with `POST /api/auth/login` to receive an access token.
2. **Call protected routes** by setting `Authorization: Bearer <access_token>`.
3. **Create tickets** with `POST /api/tickets`, optionally attaching an initial message.
4. **Manage conversations** with `POST /api/tickets/:id/messages`.
5. **Update status/priority** to keep ticket SLAs accurate and log activities.
6. **Use admin routes** (`/api/users`) to manage internal agents.

---

For questions or clarifications about this API, contact the HelpCore engineering team.

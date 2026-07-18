# SupportHub API Documentation

Welcome to the SupportHub API documentation. This API is built using **Laravel 11** and is secured using **Laravel Sanctum**.

## Base URL
All API requests should be prefixed with `/api`.
Example: `http://localhost:8000/api`

---

## 1. Authentication

The API uses Sanctum SPA stateful authentication using cookies, or Bearer Tokens for mobile clients.

### Register
`POST /auth/register`
Creates a new standard user account.
**Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Login
`POST /auth/login`
Authenticates a user and starts a session.
**Payload:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
`GET /auth/me`
Retrieves the currently authenticated user, including their roles and permissions.

### Logout
`POST /auth/logout`
Destroys the current session.

---

## 2. Tickets

Endpoints for managing support tickets. 

### List Tickets
`GET /tickets`
Returns a list of tickets.
- **User:** Returns only tickets they created.
- **Support:** Returns tickets assigned to their active departments.
- **Admin:** Returns all tickets.

### Create Ticket
`POST /tickets`
Opens a new support ticket.
**Payload:**
```json
{
  "title": "Computer won't turn on",
  "description": "I pressed the power button but nothing happens.",
  "department_id": 1,
  "category_id": 2,
  "priority": "High"
}
```

### View Ticket Details
`GET /tickets/{id}`
Returns full ticket details including the ticket's replies and activity log.

### Change Ticket Status
`PATCH /tickets/{id}/status`
*(Requires Admin or Support Role)*
Updates the status of a ticket (e.g., Open -> Closed).
**Payload:**
```json
{
  "status_id": 3
}
```

---

## 3. Replies & Notifications

### Add a Reply
`POST /tickets/{id}/replies`
Adds a message to the ticket conversation.
**Payload:**
```json
{
  "message": "Have you tried turning it off and on again?"
}
```

### Get Notifications
`GET /notifications`
Returns unread notifications for the authenticated user.

### Mark as Read
`POST /notifications/{id}/mark-as-read`
Marks a specific notification as read.

### Mark All as Read
`POST /notifications/mark-all-as-read`
Marks all notifications as read.

---

## 4. Admin System Configuration

*(These endpoints strictly require the `Admin` role).*

### Dashboard Overview
`GET /admin/dashboard`
Returns high-level statistics: total tickets, ticket distributions (by status, department, category, priority), and recent system activity logs.

### Manage Users
- `GET /admin/users` - Lists all users, including soft-deleted ones.
- `POST /admin/users` - Create a new user account (and dynamically assign departments if they are a Support agent).
- `PUT /admin/users/{id}/role` - Update a user's role and department assignments.
- `DELETE /admin/users/{id}` - Soft-delete (disable) a user.
- `POST /admin/users/{id}/restore` - Restore (enable) a soft-deleted user.

### Manage Departments
- `GET /admin/departments`
- `POST /admin/departments`
- `PUT /admin/departments/{id}`
- `DELETE /admin/departments/{id}`

### Manage Categories
- `GET /admin/categories`
- `POST /admin/categories`
- `PUT /admin/categories/{id}`
- `DELETE /admin/categories/{id}`

### Manage Statuses
- `GET /admin/statuses`
- `POST /admin/statuses`
- `PUT /admin/statuses/{id}`
- `DELETE /admin/statuses/{id}`

---

## Responses

**Success Response Format:**
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { ... }
}
```

**Error Response Format (e.g. Validation Error 422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

# Registration API Documentation

## Register User

Register a new user with email, username, and password.

**Endpoint:** `POST /api/v1/users/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "username123",
  "password": "Password123"
}
```

**Validation Rules:**

- **Email**: Must be a valid email address
- **Username**:
  - 3-20 characters long
  - Can only contain letters, numbers, and underscores
  - Must be unique
- **Password**:
  - 8-100 characters long
  - Must contain at least one lowercase letter, one uppercase letter, and one number

**Response (201 Created):**

```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "username": "username123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- **400 Bad Request**: Validation errors
- **409 Conflict**: Email or username already exists

## Setup Instructions

1. Update the database configuration in `src/app.module.ts`:

   ```typescript
   TypeOrmModule.forRoot({
     type: "postgres",
     host: "localhost",
     port: 5432,
     username: "your_actual_username",
     password: "your_actual_password",
     database: "your_actual_database",
     entities: [User],
     synchronize: true, // set to false in production
   });
   ```

2. Start the application:

   ```bash
   npm run start:dev
   ```

3. Test the registration endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/v1/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "username": "testuser",
       "password": "Password123"
     }'
   ```

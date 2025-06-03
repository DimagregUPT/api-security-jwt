# api-security-jwt

## API Security - Implementation of Authentication and Authorization for a RESTful API using JWT

This project involves creating a RESTful API in Node.js that implements authentication and authorization mechanisms, specifically JSON Web Tokens (JWT). 

### Project Overview

The implementation demonstrates:
- Protecting API endpoints using industry-standard security protocols
- Token generation and validation processes
- Resource-level permission management
- Secure authentication workflows

### Technologies

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- RESTful API principles
- SqLite3

### Features

- Secure endpoint protection
- Token-based authentication
- Role-based access control
- Permission management at resource level
- Demonstration of security best practices

## JWT Authentication Flow

The API uses JWT (JSON Web Tokens) for authentication with the following flow:

1. **Registration**: Users register with username, email, and password
2. **Login**: Users login with credentials and receive a JWT token
3. **Authentication**: Protected endpoints require a valid JWT token in the Authorization header
4. **Authorization**: Admin-only routes require specific role permissions

### API Endpoints

#### Authentication Routes

- `POST /api/auth/register` - Register a new user
  - **Headers**: `Content-Type: application/json`
  - **Body**: `{ "username": "string", "email": "string", "password": "string", "admin": "admin_secret" }` (admin field optional)
  - **Response**: User object and JWT token

- `POST /api/auth/login` - Login and receive JWT token
  - **Headers**: `Content-Type: application/json`
  - **Body**: `{ "username": "string", "password": "string" }`
  - **Response**: User object and JWT token

#### User Management Routes (Admin Only)

- `GET /api/users` - Get all users (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: None
  - **Response**: Array of user objects

- `GET /api/users/:id` - Get specific user by ID (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: None
  - **Response**: User object

- `POST /api/users` - Create new user (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
  - **Body**: `{ "username": "string", "email": "string", "password": "string" }`
  - **Response**: Created user object

- `PUT /api/users/:id` - Update user (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
  - **Body**: `{ "username": "string", "email": "string" }`
  - **Response**: Updated user object

- `DELETE /api/users/:id` - Delete user (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: None
  - **Response**: 204 No Content

#### Train Routes (JWT Protected)

- `GET /api/train-routes` - View all train routes (requires JWT authentication)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: None
  - **Response**: Array of train route objects

- `GET /api/train-routes/:id` - View specific train route (requires JWT authentication)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: None
  - **Response**: Train route object

- `GET /api/train-routes/train/:trainId` - View routes by train ID (requires JWT authentication)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: None
  - **Response**: Array of train route objects for specified train

- `GET /api/train-routes/search?from=X&to=Y` - Search routes by stations (requires JWT authentication)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Query Parameters**: `from` (departure station), `to` (arrival station)
  - **Body**: None
  - **Response**: Array of matching train route objects

- `POST /api/train-routes` - Create new train route (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
  - **Body**: `{ "train_id": "string", "departure_time": "string", "arrival_time": "string", "station_from": "string", "station_to": "string" }`
  - **Response**: Created train route object

- `PUT /api/train-routes/:id` - Update train route (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
  - **Body**: `{ "train_id": "string", "departure_time": "string", "arrival_time": "string", "station_from": "string", "station_to": "string" }` (fields optional)
  - **Response**: Updated train route object

- `DELETE /api/train-routes/:id` - Delete train route (requires Admin role)
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: None
  - **Response**: 204 No Content

### Using JWT in API Requests

To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Security Best Practices Implemented

1. **Secure Token Storage**: JWT secret stored in environment variables
2. **Token Expiration**: JWTs expire after configured time (default: 1 hour)
3. **Role-Based Authorization**: Admin-specific routes protected by role checks
4. **Password Hashing**: User passwords stored securely using bcrypt
5. **Error Handling**: Specific error responses for authentication/authorization failures
6. **JWT Verification**: Tokens validated for authenticity and expiration on each request

## Documentation

Useful tutorials and documentation for startup:
- https://www.w3schools.com/nodejs/nodejs_intro.asp
- https://www.geeksforgeeks.org/express-js/
- https://www.geeksforgeeks.org/jwt-authentication-with-node-js/
- https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/
- https://restfulapi.net/

## Setup

Set environment variables by creating .env in root folder and replacing with coresponding values:
```
# JWT Configuration
JWT_SECRET=your_very_long_secure_random_secret_key_here
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=3000
NODE_ENV=development # development/production

# Admin Secret
ADMIN_SECRET=your_admin_secret_here
```

Commands used for project init:
```sh
# Install dependencies
npm install

# Populate database with mockup data of train routes
npm run dev # First run to create database
node .\scripts\insert_routes.js

# Run the server locally with restart on modifications
npm run dev
```

Use **Postman** to use with ease all the endpoint by importing the config file: File -> Import... -> SSC.postman_collection.json
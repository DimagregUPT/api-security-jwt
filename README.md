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
- `POST /api/auth/login` - Login and receive JWT token

#### Train Routes (JWT Protected)

- `GET /api/train-routes` - View all train routes (requires JWT authentication)
- `GET /api/train-routes/:id` - View specific train route (requires JWT authentication)
- `GET /api/train-routes/train/:trainId` - View routes by train ID (requires JWT authentication)
- `GET /api/train-routes/search?from=X&to=Y` - Search routes by stations (requires JWT authentication)
- `POST /api/train-routes` - Create new train route (requires Admin role)
- `PUT /api/train-routes/:id` - Update train route (requires Admin role)
- `DELETE /api/train-routes/:id` - Delete train route (requires Admin role)

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

## #in-progress

Useful tutorials and documentation for startup:
- https://www.w3schools.com/nodejs/nodejs_intro.asp
- https://www.geeksforgeeks.org/express-js/
- https://www.geeksforgeeks.org/jwt-authentication-with-node-js/
- https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/
- https://restfulapi.net/

Commands used for project init:
```sh
npm install

#Run the server locally with restart on modifications
npm run dev
```

- Project roadmap
    - Run in a dockerized environment for server + database
    - Create a mongodb with mockup data of CFR database of train routes (TBD data structure)
    - Create endpoints for viewing the routes (user), adding, updating, deleting (admin)
    - Secure connection to db using mongoose
    - Use docker volumes for data storage of database container
# api-security-oauth-jwt

## API Security - Implementation of Authentication and Authorization for a RESTful API (OAuth, JWT)

This project involves creating a RESTful API in Node.js that implements authentication and authorization mechanisms, specifically OAuth and JSON Web Tokens (JWT). 

### Project Overview

The implementation demonstrates:
- Protecting API endpoints using industry-standard security protocols
- Token generation and validation processes
- Resource-level permission management
- Secure authentication workflows

### Technologies

- Node.js
- Express.js
- OAuth 2.0
- JSON Web Tokens (JWT)
- RESTful API principles

### Features

- Secure endpoint protection
- Token-based authentication
- Role-based access control
- Permission management at resource level
- Demonstration of security best practices

## #in-progress

Useful tutorials and documentation for startup:
- https://www.w3schools.com/nodejs/nodejs_intro.asp
- https://www.geeksforgeeks.org/express-js/
- https://blog.logrocket.com/implement-oauth-2-0-node-js/
- https://www.geeksforgeeks.org/jwt-authentication-with-node-js/
- https://restfulapi.net/

Commands used for project init:
```sh
npm init -y
npm install express jsonwebtoken bcryptjs dotenv oauth2-server
npm install nodemon --save-dev

#Run the server locally with restart on modifications
npm run dev
```

- Project roadmap
    - Run in a dockerized environment for server + database
    - Create a mongodb with mockup data of CFR database of train routes (TBD data structure)
    - Create endpoints for viewing the routes (user), adding, updating, deleting (admin)
    - Secure connection to db using mongoose
    - Use docker volumes for data storage of database container
    
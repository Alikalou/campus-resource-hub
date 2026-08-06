# Campus Resource Hub

Campus Resource Hub is a full-stack web application that allows university students and staff to browse and book campus resources such as rooms, equipment, and shared facilities.

Administrators can manage resources and review booking requests by approving or rejecting them.

## Trainee

**Ali Kalou**

## Project Purpose

The purpose of this project is to build an internal university resource-booking system while practicing:

* Full-stack application development
* REST API design
* PostgreSQL database design
* Authentication and role-based authorization
* React frontend development
* Git branching, pull requests, and code reviews

## Technology Stack

### Backend

* Node.js
* Express.js
* JavaScript
* PostgreSQL
* pg for database access

### Frontend

* React
* Vite
* JavaScript

### Development Tools

* Git and GitHub
* Docker Compose
* Postman
* Visual Studio Code

## MVP Features

The minimum viable product will include:

* User registration and login
* Resource listing and resource details
* Booking request creation
* Booking conflict detection
* A “My Bookings” page
* An admin booking approval queue
* Resource management for administrators
* Loading, empty, and error states
* Two user roles—User and Admin—with role-based permissions

## Repository Structure

```text
campus-resource-hub/
├── README.md
├── docker-compose.yml
├── server/
│   ├── package.json
│   ├── src/
│   └── ...
└── client/
    ├── package.json
    ├── vite.config.ts
    └── src/
```

## Requirements

Before running the project, install:

* Node.js LTS
* Git
* Docker Desktop
* Visual Studio Code or Cursor
* Postman

## Completed

* Set up the repository, backend stack, Node.js server and environment documentation.
* Built the Resources API with validation, consistent responses, PostgreSQL persistence, and organized application layers.
* Designed the database schema and ERD, then added Docker Compose, migrations, and repeatable seed data.
* Implemented booking creation, retrieval, ownership checks and overlap prevention.
* Added registration, login, password hashing, JWT authentication, and role-based authorization.
* Added admin resource management, audit logging, booking approval and rejection.
* Added the Postman collection, test environment safeguards, and integration tests for critical backend flows.

## Architecture

The backend follows a layered architecture that separates HTTP handling,
business logic, and database access.

A typical request flows through the application as follows:

Route → Middleware → Controller → Validation → Service → Data Layer → PostgreSQL

- **Routes** define API endpoints and connect them to middleware and controllers.
- **Middleware** handles shared request concerns, such as temporary user identification.
- **Controllers** read request data, call the appropriate service, and send HTTP responses.
- **Validation** checks and normalizes incoming request data.
- **Services** contain business rules, such as verifying users and resources and detecting booking conflicts.
- **Data-layer modules** execute PostgreSQL queries and return database records.
- **Error middleware** converts application errors into consistent API responses.

For example, creating a booking follows this flow:

POST /bookings
→ temporary user middleware
→ booking controller
→ booking validation
→ booking service
→ booking data layer
→ PostgreSQL
→ HTTP response

## Documentation

- [Resource model](server/docs/resource-model.md)
- [Booking model](server/docs/booking-model.md)
- [User model](server/docs/user-model.md)
- [audit log model](server/docs/audit-log-model.md)
- [Integration tests](server/docs/integration-tests.md)
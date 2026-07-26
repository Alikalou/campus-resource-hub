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

## Completed

### Week 1 — Ownership and kickoff

* Set up the GitHub repository
* Confirmed the technical stack
* Initialized the Node.js server
* Added the `/health` endpoint

### Week 2 — In-memory Resources API

* Defined and documented the Resource model
* Implemented resource retrieval, creation, and update endpoints
* Added resource input validation and normalization
* Added centralized error handling and consistent API responses
* Added a Postman collection and local environment

### Week 3 — PostgreSQL integration

* Designed the database schema and ERD
* Added PostgreSQL with Docker Compose
* Created migrations and seed data
* Connected the Resources API to PostgreSQL
* Refactored resource routes into a dedicated controller

## Documentation

- [Resource model](server/docs/resource-model.md)
# RevuTrack

This application allows students to schedule reviews with available mentors. Mentors can evaluate the students and provide grades and comments. Administrators can see the reviews of all the users.

#### PS. This is obviously not a production-ready work. Security can be further upped, error handling, validation, logging and testing can see through multiple improvements.

## Technologies Used

- Node.js
- TypeScript
- PostgreSQL
- TypeORM
- InversifyJS
- Zod
- JWT for authentication
- Docker

## Application Structure
RevuTrack uses Domain Driven Design and is based on the Clean architecture principle. The following directories are standard of the idea:
- `src/domain`: This directory contains the entities, interfaces, services, and repositories related to the domain logic.
- `src/application`: This directory contains the controllers which handle HTTP requests and responses.
- `src/infrastructure`: This directory contains code for external concerns like database and authentication.
- `src/middleware`: This directory contains the Express middleware.
- `src/validators`: This directory contains the Zod schemas for input validation.
- `src/utils`: This directory contains utility functions.
- `src/exceptions`: This directory contains custom exceptions.
- `test`: This directory contains the unit and integration tests.
- `database`: This directory contains the seed script to populate the database with initial data.

## API Endpoints

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/RevuTrack.git
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Set up the environment variables in a `.env` file in the root of the project:
    ```bash
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    DB_DATABASE=your_database_name
    JWT_SECRET=your_jwt_secret
    ```
4. Run the application:
    ```bash
    npm start
    ```

## API Endpoints

| Method | Endpoint               | Description                       | Access |
|--------|------------------------|-----------------------------------|--------|
| GET    | /users                 | Get all users                     | Public |
| POST   | /users                 | Create a new user                 | Public |
| GET    | /users/:id             | Get a user by ID                  | Public |
| GET    | /users/role/:role      | Get users by role                 | Public |
| POST   | /users/login           | Log in a user                     | Public |
| GET    | /users/available-mentors | Get available mentors           | Public |
| GET    | /users/:id/reviews     | Get reviews by user ID            | Public |
| GET    | /reviews               | Get all reviews                   | Public |
| POST   | /reviews               | Create a new review               | Public |
| PUT    | /reviews/:id/status    | Update the status of a review     | Public |
| GET    | /reviews/student/:id   | Get reviews by student ID         | Public |
| PUT    | /reviews/:id/cancel    | Cancel a review                   | Public |
| GET    | /reviews/mentor/:id    | Get reviews by mentor ID          | Public |
| PUT    | /reviews/:id/start     | Start a review                    | Public |
| PUT    | /reviews/:id/complete  | Complete a review                 | Public |

## Running the Application

1. Install dependencies: `npm install`
2. Run the application: `npm start`
3. Run tests: `npm test`
4. Seed the database: `ts-node database/seeds/seed.ts`

## Docker

You can also run the application using Docker:

1. Build the Docker image: `docker build -t revutrack .`
2. Run the Docker container: `docker run -p 3000:3000 revutrack`

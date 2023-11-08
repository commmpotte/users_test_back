
# Backend API for User Management System

This is the backend API for a User Management System, which includes user registration, authentication, and user listing. It is built using Node.js, Express.js, and MongoDB.


## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- MongoDB installed and running
- npm or yarn installed
- A text editor or an integrated development environment (IDE)

## Project Structure

The project structure is organized as follows:

- `app.js`: Entry point of the application.
- `controllers/`: Handles the business logic.
- `models/`: Defines the MongoDB data models.
- `validators/`: Request validation rules.
- `utils/`: Utility functions.
- `tests/`: Contains test cases.

## API Endpoints

- POST `/auth/register`: Register a new user.
- POST `/auth/login`: User login.
- GET `/users`: Get a list of users.
- GET `/users/:id`: Get a specific user by ID.
- PUT `/users/:id`: Update a user's details.
- DELETE `/users/:id`: Delete a user.

## Validation Rules

The API enforces the following validation rules using Express Validator:

- `username`: Must be a string, max 150 characters, and match the pattern `^[\w.@+-]+$`.
- `password`: Must be a string, between 8 and 128 characters, and contain at least one uppercase letter and one digit.
- `firstName` and `lastName`: Must be strings with a minimum length of 3 characters.

## Error Handling

The API uses custom error handling middleware to respond with meaningful error messages and status codes.

## Authentication

User authentication is implemented using JSON Web Tokens (JWT). Users are required to log in to access protected routes.

## Database

The API stores user data in a MongoDB database. It uses Mongoose to define the data schema and interact with the database.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/user-management-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd user-management-backend
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and provide your configuration details. Example:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=yoursecretkey
   ```

5. Start the server:

   ```bash
   npm start
   ```

The server will be running on `http://localhost:3000` by default.

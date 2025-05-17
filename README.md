# School Management API

A Node.js API for managing school data with location-based sorting capabilities.

## Features

- Add new schools with location data
- List schools sorted by proximity to a given location
- MySQL database integration
- Input validation
- Error handling
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (Node Package Manager)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
PORT=3000
```

4. Initialize the database:
- Log in to MySQL
- Run the SQL commands from `config/init.sql`

## Running the Application

```bash
node app.js
```

The server will start on port 3000 (or the port specified in your .env file).

## API Endpoints

### 1. Add School
- **Endpoint:** POST /addSchool
- **Content-Type:** application/json
- **Request Body:**
```json
{
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.3456,
    "longitude": 78.9012
}
```
- **Success Response:** 
```json
{
    "message": "School added successfully",
    "schoolId": 1
}
```

### 2. List Schools
- **Endpoint:** GET /listSchools
- **Query Parameters:**
  - latitude: User's latitude (float)
  - longitude: User's longitude (float)
- **Example:** GET /listSchools?latitude=12.3456&longitude=78.9012
- **Success Response:**
```json
[
    {
        "id": 1,
        "name": "School Name",
        "address": "School Address",
        "latitude": 12.3456,
        "longitude": 78.9012,
        "distance": 0.5
    }
]
```

### 3. Health Check
- **Endpoint:** GET /health
- **Success Response:**
```json
{
    "status": "OK"
}
```

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields
- Invalid data types
- Invalid coordinate values
- Database errors
- Server errors

## Testing

You can test the API using tools like Postman or curl. Here are some example curl commands:

1. Add a school:
```bash
curl -X POST http://localhost:3000/addSchool \
-H "Content-Type: application/json" \
-d '{
    "name": "Test School",
    "address": "123 Test Street",
    "latitude": 12.3456,
    "longitude": 78.9012
}'
```

2. List schools:
```bash
curl "http://localhost:3000/listSchools?latitude=12.3456&longitude=78.9012"
```

## Security Considerations

- Input validation is implemented for all endpoints
- SQL injection prevention using parameterized queries
- Environment variables for sensitive configuration
- CORS enabled for cross-origin requests 
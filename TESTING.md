# School Management API Testing Guide

## API Endpoints

The API is available at: `[Your-Render-URL]`

## Testing with Postman

1. Download the Postman collection: `School_Management_API.postman_collection.json`
2. Import the collection into Postman
3. Create an environment in Postman:
   - Click "Environments" → "Create Environment"
   - Name it "School Management API"
   - Add variable: `baseUrl` = `[Your-Render-URL]`

## Test Cases

### 1. Health Check
- GET `/health`
- Expected response: `{"status": "OK"}`

### 2. Add School
- POST `/addSchool`
- Headers: `Content-Type: application/json`
- Example payload:
```json
{
    "name": "Delhi Public School",
    "address": "123 Education Street, Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090
}
```

More test schools:
```json
{
    "name": "Mumbai International School",
    "address": "Bandra West, Mumbai",
    "latitude": 19.0596,
    "longitude": 72.8295
}
```

```json
{
    "name": "National Public School",
    "address": "Indiranagar, Bangalore",
    "latitude": 12.9784,
    "longitude": 77.6408
}
```

### 3. List Schools
Test with different locations:

1. Delhi:
```
/listSchools?latitude=28.6139&longitude=77.2090
```

2. Mumbai:
```
/listSchools?latitude=19.0760&longitude=72.8777
```

3. Bangalore:
```
/listSchools?latitude=12.9716&longitude=77.5946
```

4. Chennai:
```
/listSchools?latitude=13.0827&longitude=80.2707
```

## Validation Testing

Test error handling with invalid data:

1. Empty name:
```json
{
    "name": "",
    "address": "Test Address",
    "latitude": 28.6139,
    "longitude": 77.2090
}
```

2. Invalid coordinates:
```json
{
    "name": "Test School",
    "address": "Test Address",
    "latitude": 100,
    "longitude": 200
}
```

## Expected Error Responses

The API will return appropriate error messages for:
- Missing required fields
- Invalid data types
- Out of range values
- Database errors

## Need Help?

Contact: [Your Contact Information] 
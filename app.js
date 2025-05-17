const express = require('express');
const cors = require('cors');
const db = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Root endpoint redirects to documentation
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Validation functions
const validateSchoolData = (data) => {
    const errors = [];
    
    // Check if all required fields exist
    if (!data.name) errors.push("Name is required");
    if (!data.address) errors.push("Address is required");
    if (data.latitude === undefined || data.latitude === null) errors.push("Latitude is required");
    if (data.longitude === undefined || data.longitude === null) errors.push("Longitude is required");

    // Validate data types and ranges
    if (typeof data.name !== 'string') errors.push("Name must be a string");
    if (typeof data.address !== 'string') errors.push("Address must be a string");
    if (typeof data.latitude !== 'number') errors.push("Latitude must be a number");
    if (typeof data.longitude !== 'number') errors.push("Longitude must be a number");

    // Validate latitude and longitude ranges
    if (data.latitude < -90 || data.latitude > 90) errors.push("Latitude must be between -90 and 90");
    if (data.longitude < -180 || data.longitude > 180) errors.push("Longitude must be between -180 and 180");

    // Validate string lengths
    if (data.name && data.name.trim().length === 0) errors.push("Name cannot be empty");
    if (data.address && data.address.trim().length === 0) errors.push("Address cannot be empty");
    if (data.name && data.name.length > 255) errors.push("Name cannot exceed 255 characters");
    if (data.address && data.address.length > 500) errors.push("Address cannot exceed 500 characters");

    return errors;
};

// Add School API
app.post('/addSchool', async (req, res) => {
    try {
        const schoolData = {
            name: req.body.name,
            address: req.body.address,
            latitude: Number(req.body.latitude),
            longitude: Number(req.body.longitude)
        };

        // Validate input data
        const validationErrors = validateSchoolData(schoolData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationErrors
            });
        }

        // Insert into database
        const [result] = await db.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [schoolData.name.trim(), schoolData.address.trim(), schoolData.latitude, schoolData.longitude]
        );

        res.status(201).json({
            message: "School added successfully",
            schoolId: result.insertId,
            school: {
                id: result.insertId,
                ...schoolData
            }
        });
    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
});

// List Schools API
app.get('/listSchools', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        // Validate query parameters
        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude format' });
        }

        if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
            return res.status(400).json({ error: 'Invalid latitude or longitude values' });
        }

        const [schools] = await db.query('SELECT * FROM schools');

        // Calculate distance for each school and sort
        const schoolsWithDistance = schools.map(school => ({
            ...school,
            distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
});

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
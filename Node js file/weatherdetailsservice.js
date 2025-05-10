import cors from 'cors';
import express from 'express';
import mysql from 'mysql2';
import axios from 'axios';

const weatherapp = express();
weatherapp.use(cors());
weatherapp.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'weatherdashboard'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

// Route: POST /api/weather
weatherapp.post('/api/weather', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=12aa366f267b1845387cd92741d47171&units=metric`;

    const response = await axios.get(apiUrl);

    // Extract weather data including humidity
    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,  
    };

    // Save to MySQL
    const sql = 'INSERT INTO searches (city, temperature, description, humidity) VALUES (?, ?, ?, ?)';
    db.query(sql, [weatherData.city, weatherData.temperature, weatherData.description, weatherData.humidity], (err) => {
      if (err) {
        console.error("Insert failed:", err);
      }
    });

    res.json(weatherData);

  } catch (err) {
    console.error("Weather fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Route: GET /api/history
weatherapp.get('/api/history', (req, res) => {
  const sql = 'SELECT * FROM searches ORDER BY timestamp DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch history failed:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


weatherapp.delete('/api/history/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM searches WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Delete failed:", err);
        return res.status(500).json({ error: "Failed to delete record" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }
  
      res.json({ message: "Record deleted successfully" });
    });
  });


weatherapp.listen(3620, () => {
  console.log('Server is running on port 3620');
});

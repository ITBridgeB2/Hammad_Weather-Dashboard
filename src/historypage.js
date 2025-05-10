import React, { useEffect, useState } from "react";
import api from "./weatherdetails"; 
import { useNavigate } from 'react-router-dom';
import "./styles.css";

const HistoryPage = () => {
    const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");  
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/history/${id}`);
      setHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));  
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  const goToDashboard = () => {
    navigate("/");  
  };

  return (
    <div className="weather-container">
      <h1>Search History</h1>
      <div className="back-button-container">
      <button type="button" onClick={goToDashboard} className="back-button">Back</button>
      </div>
      <ul className="history-list">
        {history.map(entry => (
          <li key={entry.id} className="history-item">
            <strong>{entry.city}</strong> — {entry.temperature}°C — {entry.humidity} — {entry.description}  
            <br />
            <small>{new Date(entry.timestamp).toLocaleString()}</small>
            <button onClick={() => handleDelete(entry.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPage;

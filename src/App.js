import React from 'react';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import WeatherSearch from './weatherdashboard';
import HistoryPage from './historypage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<WeatherSearch />} />
      <Route path="/history" element={<HistoryPage />} />
      
    </Routes>
    </BrowserRouter>
  );
}

export default App;



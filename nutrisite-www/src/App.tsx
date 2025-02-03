import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import NutritionResult, { NutritionData } from './components.tsx/NutritionResult';
import FoodUpload from './components.tsx/FoodUpload';
import Header from './components.tsx/Header';
import Auth from './components.tsx/Auth';

function App() {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={isAuthenticated ? <FoodUpload setNutritionData={setNutritionData} /> : <Navigate to="/login" />} />
          <Route path="/results" element={isAuthenticated && nutritionData ? <NutritionResult data={nutritionData} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
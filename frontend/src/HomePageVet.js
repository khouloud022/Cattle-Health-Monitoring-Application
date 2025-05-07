import React from 'react';
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const HomePageVet = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: 'Consult Cattle Data',
      icon: '👁️',
      route: '/Consultvet',
      color: '#4CAF50'
    },
    {
      id: 2,
      title: 'Predict Cattle Health',
      icon: '🐄',
      route: '../templates/PredictionForm', // Remplace '' par une route réelle
      color: '#2196F3'
    },
    {
      id: 3,
      title: 'Profile',
      icon: '👤',
      route: '/ProfileVet',
      color: '#F44336'
    },
    {
      id: 4,
      title: 'Log Out',
      icon: '🚪',
      route: '/SignIn',
      color: '#607D8B'
    }
  ];

  return (
    <div className="main-container">
      <Header />
      <div className="home-page">
        <h1>Welcome To Agriscan</h1>
        <br />

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card" style={{ backgroundColor: feature.color }} onClick={() => feature.route && navigate(feature.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  feature.route && navigate(feature.route);
                }
              }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageVet;

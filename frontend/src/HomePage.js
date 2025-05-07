import React from 'react';
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: 'Dashboard',
      icon: '📊',
      route: '/Main2',
      color: '#4CAF50'
    },
    {
      id: 2,
      title: 'View bids',
      icon: '👁️',
      route: '/Viewbids',
      color: '#2196F3'
    },
    {
      id: 3,
      title: 'Place bids',
      icon: '✏️',
      route: '/placebid',
      color: '#FF9800'
    },
    {
      id: 4,
      title: 'Consult Cattle Data',
      icon: '👁️',
      route: '/Consultop',
      color: '#9C27B0'
    },
    {
      id: 5,
      title: 'Profile',
      icon: '👤',
      route: '/Profile',
      color: '#F44336'
    },
    {
      id: 6,
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
      
        <h1 >Welcome to Agriscan </h1>
     <br></br>

      <div className="features-grid">
        {features.map((feature) => (
          <div 
            key={feature.id}
            className="feature-card"
            style={{ backgroundColor: feature.color }}
            onClick={() => navigate(feature.route)}
          
            
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

export default HomePage;
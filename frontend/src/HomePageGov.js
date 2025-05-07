import React from 'react';
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: 'Dashboard',
      icon: '📊',
      route: '/Main',
      color: '#4CAF50'
    },
    {
      id: 2,
      title: 'Publish a tender',
      icon: '📢',
      route: '/publish_tender',
      color: '#2196F3'
    },
    {
      id: 3,
      title: 'Close a tender',
      icon: '🔒',
      route: '/Close',
      color: '#FF9800'
    },
    {
      id: 4,
      title: 'Select the best bidder ',
      icon: '📋',
      route: '/Selectbestbidder',
      color: '#9C27B0'
    },
    {
      id: 5,
      title: 'Consult Cattle Data ',
      icon: '👁️',
      route: '/Consultgov',
      color: '#607D8B'
    },
    {
      id: 6,
      title: 'Profile',
      icon: '👤',
      route: '/Profilegov',
      color: '#F44336'
    },
  ];

  return (
    <div className="main-container">
      <Header />
    <div className="home-page">
       
        <h1 >Welcome To Agriscan </h1>
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
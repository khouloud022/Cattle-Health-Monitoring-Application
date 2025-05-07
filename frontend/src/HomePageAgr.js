import React from 'react';
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const HomePageAgr = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: 'Consult Data',
      icon: ' 👁️',
      route: '/Consult',
      color: '#4CAF50'
    },
    {
      id: 2,
      title: 'Add Cattle ',
      icon: '🐄',
      route: '/CowList',
      color: '#2196F3'
    },
    {
      id: 3,
      title: 'Profile',
      icon: '👤',
      route: '/ProfileFar',
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
        <h1 >Welcome To Agriscan </h1>
     <br></br>

      <div className="features-grid1">
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

export default HomePageAgr;
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import UserDropdown from './UserDropdown';
import UserDropdowndroneop from './UserDropdowndroneop';
import UserDropdowndroneAgr from './UserDropdowndroneAgr';
import UserDropdowndronevet from './UserDropdowndronevet';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const roleFromStorage = localStorage.getItem('userRole');
      setUser(currentUser);
      setUserRole(roleFromStorage);
    }
  }, [auth.currentUser]);

  const handleRedirect = () => {
    switch (userRole) {
      case 'government':
        navigate('/HomePageGov');
        break;
      case 'drone operator':
        navigate('/HomePage');
        break;
      case 'agriculteur':
        navigate('/HomePageAgr');
        break;
      case 'veterinaire':
        navigate('/HomePageVet');
        break;
      case 'consumer':
        navigate('/HomePageConsumer');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <header>
      <div className="logosec">
        <div className="logo">
          <img
            src="../9ec57c06-0fd0-4570-abf0-afe4f5b64bf9.png"
            style={{
              margin: -5,
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid #333',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
            alt="Logo AgriScan"
          />
          <span
            onClick={handleRedirect}
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            Agriscan
          </span>
        </div>
      </div>

      <div className="message">
        {user && userRole === 'government' && (
          <UserDropdown
            user={user}
            trigger={
              <img
                src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
                className="dpicn"
                alt="Profile"
              />
            }
          />
        )}

        {user && userRole === 'drone operator' && (
          <UserDropdowndroneop
            user={user}
            trigger={
              <img
                src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
                className="dpicn"
                alt="Profile"
              />
            }
          />
        )}
        {user && userRole === 'agriculteur' && (
          <UserDropdowndroneAgr
            user={user}
            trigger={
              <img
                src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
                className="dpicn"
                alt="Profile"
              />
            }
          />
        )}
        
        
      </div>
    </header>
  );
};

export default Header;

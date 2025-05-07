import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function UserDropdown({ user, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/SignIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="user-dropdown">
      <div className="dp" onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <img 
            src={user.photoURL || "https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"} 
            className="dpicn" 
            alt="profile" 
          />
        )}
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          {/* Header avec avatar et infos */}
          <div className="profile-header">
            <div className="avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" />
              ) : (
                <span>{user.displayName?.charAt(0) || 'G'}</span>
              )}
            </div>
            <div className="user-info">
              <h4>{user.displayName || 'Government'}</h4>
              <p className="user-title">Tunisian Government</p>
              <span className="status-badge">
                <span className="status-dot"></span> Active
              </span>
            </div>
          </div>
          
          {/* Section des informations */}
          <div className="profile-info-section">
            <div className="info-item">
              <span className="info-icon mail-icon"></span>
              <div>
                <p className="info-label">Email</p>
                <p className="info-value">{user.email || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="info-icon phone-icon"></span>
              <div>
                <p className="info-label">Helpline Number</p>
                <p className="info-value">{user.phoneNumber || 'No HelpLine Number specified. Click to edit your profile.'}</p>
              </div>
            </div>
          </div>
         
          <div className="profile-nav">
            <button 
              className="dropdown-item"
              onClick={() => {
                navigate('/Profilegov');
                setIsOpen(false);
              }}
            >
              <span className="menu-icon user-icon"></span>
              <span>Edit Profile</span>
              <span className="edit-icon">✏️</span>
            </button>
          </div>
          
          {/* Bouton de déconnexion */}
          <button 
            className="dropdown-item logout"
            onClick={handleLogout}
          >
            <span className="menu-icon logout-icon"></span>
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function UserDropdown({ user, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [extendedUser, setExtendedUser] = useState({});
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const fetchExtendedUserData = async () => {
      if (!user?.uid) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setExtendedUser(userDocSnap.data());
        } else {
          console.log('No extended user data found.');
        }
      } catch (error) {
        console.error('Error fetching extended user data:', error);
      }
    };

    fetchExtendedUserData();
  }, [user, db]);

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
          <div className="profile-header">
            <div className="avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" />
              ) : (
                <span>{(user.displayName?.charAt(0) || 'V').toUpperCase()}</span>
              )}
            </div>
            <div className="user-info">
              <h4>{user.displayName || 'Veterinarian'}</h4>
              <p className="user-title">Veterinarian</p>
              
              <span className="status-badge">
                <span className="status-dot"></span> Active
              </span>
            </div>
          </div>

          <div className="profile-info-section">
            <div className="info-item">
              <span className="info-icon mail-icon"></span>
              <div>
                <p className="info-label">Email</p>
                <p className="info-value">{user.email || 'Not specified'}</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon dob-icon"></span>
              <div>
                <p className="info-label">Date of Birth</p>
                <p className="info-value">{extendedUser.birthDate || 'Not specified. Click to edit your profile.'}</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon phone-icon"></span>
              <div>
                <p className="info-label">Phone Number</p>
                <p className="info-value">{extendedUser.phoneNumber || 'No phone number. Click to edit your profile.'}</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon address-icon"></span>
              <div>
                <p className="info-label">Address</p>
                <p className="info-value">{extendedUser.address || 'No address. Click to edit your profile.'}</p>
              </div>
            </div>

            <div className="info-item bio-item">
              <span className="info-icon bio-icon"></span>
              <div>
                <p className="info-label">Bio</p>
                <p className="info-value">{extendedUser.bio || 'No bio available. Click to edit profile.'}</p>
              </div>
            </div>
          </div>

          <div className="profile-nav">
            <button 
              className="dropdown-item"
              onClick={() => {
                navigate('/ProfileVet');
                setIsOpen(false);
              }}
            >
              <span className="menu-icon user-icon"></span>
              <span>Edit Profile</span>
              <span className="edit-icon">✏️</span>
            </button>
          </div>

          <button className="dropdown-item logout" onClick={handleLogout}>
            <span className="menu-icon logout-icon"></span>
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;

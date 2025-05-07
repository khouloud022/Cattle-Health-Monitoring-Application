import { useState, useEffect } from 'react';
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import './ProfileEditor.css';
import Header from './Header';
import Nav from './Nav4';

function ProfileEditor() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    birthDate: '',
    address: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              displayName: userData.displayName || '',
              email: currentUser.email || '',
              phoneNumber: userData.phoneNumber || '',
              bio: userData.bio || '',
              birthDate: userData.birthDate || '',
              address: userData.address || '',
            });
          }
        } catch (err) {
          setError('Failed to load profile data');
          console.error(err);
        }
      } else {
        window.location.href = '/SignIn';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const reauthenticate = async () => {
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (err) {
      setError('Incorrect password for re-authentication');
      console.error(err);
      return false;
    }
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: profile.displayName,
        phoneNumber: profile.phoneNumber,
        bio: profile.bio,
        birthDate: profile.birthDate,
        address: profile.address,
        updatedAt: new Date(),
      });

      
      await updateProfile(user, {
        displayName: profile.displayName,
      });

     
      await user.reload();
      setUser(auth.currentUser);

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserEmail = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (profile.email !== user.email) {
      if (await reauthenticate()) {
        try {
          await updateEmail(user, profile.email);
          setSuccess('Email updated successfully');
        } catch (err) {
          setError('Failed to update email');
          console.error(err);
        }
      }
    }
    setLoading(false);
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (await reauthenticate()) {
      try {
        await updatePassword(user, newPassword);
        setSuccess('Password updated successfully');
        setNewPassword('');
        setCurrentPassword('');
      } catch (err) {
        setError('Failed to update password');
        console.error(err);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="header-nav-wrapper">  {/* Nouveau conteneur ajouté */}
      <Header />
      <Nav />
    </div>
      <div className="profile-editor">
        <div className="card">
          <div className="card-header">
            <h2>Edit Profile</h2>
            <div className="avatar">
              {(profile.displayName?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()}
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="tabs">
            <button className={activeTab === 'basic' ? 'tab active' : 'tab'} onClick={() => setActiveTab('basic')}>
              Basic Info
            </button>
            <button className={activeTab === 'email' ? 'tab active' : 'tab'} onClick={() => setActiveTab('email')}>
              Email
            </button>
            <button className={activeTab === 'password' ? 'tab active' : 'tab'} onClick={() => setActiveTab('password')}>
              Password
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'basic' && (
              <form onSubmit={updateUserProfile} className="form">
                <label>Name</label>
                <input type="text" name="displayName" value={profile.displayName} onChange={handleInputChange} />

                <label>Phone Number</label>
                <input type="tel" name="phoneNumber" value={profile.phoneNumber} onChange={handleInputChange} />

                <label>Bio</label>
                <textarea name="bio" rows="4" value={profile.bio} onChange={handleInputChange}></textarea>

                <label>Birth Date</label>
                <input type="date" name="birthDate" value={profile.birthDate} onChange={handleInputChange} />

                <label>Address</label>
                <input type="text" name="address" value={profile.address} onChange={handleInputChange} />

                <button type="submit" className="submit-button">Update Profile</button>
              </form>
            )}

            {activeTab === 'email' && (
              <form onSubmit={updateUserEmail} className="form">
                <label>New Email</label>
                <input type="email" name="email" value={profile.email} onChange={handleInputChange} />

                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

                <button type="submit" className="submit-button">Update Email</button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={updateUserPassword} className="form">
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                <button type="submit" className="submit-button">Update Password</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditor;

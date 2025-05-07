import React, { useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from './AuthForms.module.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        localStorage.setItem('userRole', role);
        redirectToDashboard(role);
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (role) => {
    switch (role) {
      case "government": navigate("/HomePageGov"); break;
      case "drone operator": navigate("/HomePage"); break;
      case "agriculteur": navigate("/HomePageAgr"); break;
      case "veterinaire": navigate("/HomePageVet"); break;
      case "consumer": navigate("/HomePageConsumer"); break;
      default: navigate("/");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.authFormContainer}>
          <div className={styles.authForm}>
            <h1 className={styles.logo}>
              <img 
                src='./9ec57c06-0fd0-4570-abf0-afe4f5b64bf9.png' 
                alt="AgriScan Logo"
                className={styles.logoImage}
              />
              AgriScan
            </h1>
            <br></br><br></br><br></br>

            <h2 className={styles.loginTitle}>Sign into your Account</h2>
            <br></br>

    
            {error && <p className={styles.errorMessage}>{error}</p>}
    
            <form onSubmit={handleSignIn} className={styles.loginForm}>
              <div className={styles.inputGroup}>
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
    
              <div className={styles.divider}></div>
    
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </form>
    
            <div className={styles.links}>
              <p className={styles.registerText}>Don't have an account? <a href="/signup" className={styles.link}>Register here</a></p>
            </div>
          </div>
        </div>

        <div className={styles.appDescription}>
          <h2 className={styles.appTitle}>AgriScan - Cattle Health Monitoring</h2>
          <p className={styles.descriptionText}>
            Welcome to AgriScan : an innovative application designed to revolutionize cattle health monitoring. 
            Our platform combines drone technology with advanced analytics to provide real-time insights 
            into your livestock's well-being.
          </p>
          <ul className={styles.featuresList}>
            <li> Early detection of health issues through drones</li>
            <li> Real-time monitoring of cattle movement and behavior</li>
            <li> Collaborative platform for government, drone Operators, consumers, farmers and veterinarians</li>
          </ul>
          <div className={styles.appImageContainer}>
            <img 
              src="/SMART farming uav.jpg" 
              alt="Cattle monitoring with drone" 
              className={styles.appImage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
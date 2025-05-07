import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from './SignUp.module.css';
import { ethers } from "ethers";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("agriculteur");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userData = {
        email,
        role,
        createdAt: new Date()
      };
      if (role === "drone operator") {
        const wallet = ethers.Wallet.createRandom();
        userData.ethPrivateKey = wallet.privateKey;
        userData.ethAddress = wallet.address;
      }
      await setDoc(doc(db, "users", uid), userData);

      alert("Account created successfully!");

      redirectToDashboard(role);
    } catch (error) {
      console.error("Erreur d'inscription", error);
      setError(error.message);
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
    <div className={styles.contentWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.appImageContainer}>
          <img 
            src="/SMART farming uav.jpg" 
            alt="Smart farming with drone technology" 
            className={styles.appImage} 
          />
          <div className={styles.imageOverlay}>
            <h3>Revolutionize Your Farming Experience through Blockchain</h3>
            <p>
              Join our platform to monitor cattle health, 
          and optimize the farm's productivity with 
              drone-powered analytics.
            </p>
          </div>
          <div className={styles.waveEffect}></div>
        </div>
        
        <div className={styles.authForm}>
          <h2>Create Account</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleSignUp}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
                required
                className={styles.formInput}
                minLength="6"
              />
            </div>
            <div className={styles.inputGroup}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.formSelect}
              >
                <option value="government">Government</option>
                <option value="drone operator">Drone Operator</option>
                <option value="agriculteur">Farmer</option>
                <option value="veterinaire">Veterinarian</option>
                <option value="consumer">Consumer</option>
              </select>
            </div>
            <button type="submit" className={styles.submitButton}>
              Get Started
            </button>
          </form>
          <p className={styles.switchForm}>
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
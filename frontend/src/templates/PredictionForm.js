import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import Nav from '../Nav4';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        IN_ALLEYS: '',
        REST: '',
        EAT: '',
        ACTIVITY_LEVEL: '',
        LPS: '',
        disturbance: '',
    });

    const [prediction, setPrediction] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/predict', formData);
            setPrediction(response.data.prediction);
        } catch (error) {
            setPrediction('Error while predicting.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const styles = {
        container: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
           
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            margin: 0
        },
        card: {
            width: '100%',
            maxWidth: '600px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            margin: 'auto',
            transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
            boxShadow: isHovered ? '0 15px 30px rgba(0, 0, 0, 0.15)' : '0 10px 20px rgba(0, 0, 0, 0.1)'
        },
        header: {
            background: 'linear-gradient(to right, #4361ee, #3a0ca3)',
            color: 'white',
            padding: '25px',
            textAlign: 'center'
        },
        title: {
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 700,
            letterSpacing: '1px'
        },
        form: {
            padding: '30px'
        },
        formGroup: {
            marginBottom: '25px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: 600,
            color: '#212529',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        input: {
            width: '100%',
            padding: '15px',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
            backgroundColor: '#f8f9fa',
            boxSizing: 'border-box'
        },
        inputFocus: {
            outline: 'none',
            borderColor: '#4361ee',
            backgroundColor: 'white',
            boxShadow: '0 0 0 3px rgba(67, 97, 238, 0.2)'
        },
        
        button: {
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(to right, #4361ee, #3a0ca3)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '10px'
        },
        buttonHover: {
            background: 'linear-gradient(to right, #3a0ca3, #4361ee)',
            transform: 'translateY(-2px)'
        },
        resultContainer: {
            padding: '0 30px 30px 30px'
        },
        result: {
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 700,
            backgroundColor: '#f8f9fa',
            borderLeft: '5px solid #4361ee',
            animation: 'fadeIn 0.5s ease-out',
            margin: 0
        },
        resultOK: {
            color: '#4cc9f0',
            borderLeftColor: '#4cc9f0'
        },
        resultNotOK: {
            color: '#f72585',
            borderLeftColor: '#f72585'
        },
        keyframes: `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `
    };

    return (
        <div className="main-container">
      <Header />
      <Nav /> 
        <div style={styles.container}>
            <style>{styles.keyframes}</style>
            
            <div 
                style={styles.card}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={styles.header}>
                    <h2 style={styles.title}>Predict Cattle Health</h2>
                </div>
                
                <form style={styles.form} onSubmit={handleSubmit}>
                    {Object.keys(formData).map((field) => (
                        <div key={field} style={styles.formGroup}>
                            <label style={styles.label}>{field}:</label>
                            <input
                                type="number"
                                name={field}
                                step={field === 'disturbance' ? "1" : "any"}
                                min={field === 'disturbance' ? "0" : undefined}
                                max={field === 'disturbance' ? "1" : undefined}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                style={{
                                    ...styles.input,
                                    ...(focusedField === field ? styles.inputFocus : {})
                                }}
                                onFocus={() => setFocusedField(field)}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>
                    ))}
                    
                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isHovered ? styles.buttonHover : {})
                        }}
                    >
                        Predict State
                    </button>
                </form>

                {prediction && (
                    <div style={styles.resultContainer}>
                        <p style={{
                            ...styles.result,
                            ...(prediction.includes('OK') ? styles.resultOK : styles.resultNotOK)
                        }}>
                            Result : {prediction}
                        </p>
                    </div>
                )}
            </div>
            <div className="image-section">
            <img 
              src="../freepik__remove-the-text-predicting-cattle-health-from-the-__23584.png" 
              alt="Construction project illustration"
              className="featured-image"
            />
            
          </div>
        </div>
        
        </div>
    );
};

export default PredictionForm;
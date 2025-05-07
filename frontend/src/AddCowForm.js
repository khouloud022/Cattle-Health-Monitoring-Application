import React, { useState } from 'react';
import { ethers } from 'ethers';
import Nav from './Nav3';
import Header from './Header';
const livestockAbi =[{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "string",
      "name": "id",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "breed",
      "type": "string"
    }
  ],
  "name": "CowAdded",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "cows",
  "outputs": [
    {
      "internalType": "string",
      "name": "id",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "breed",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "age",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "weight",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "gender",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "color",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_id",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_breed",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "_age",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_weight",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_gender",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_color",
      "type": "string"
    }
  ],
  "name": "addCow",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "getCow",
  "outputs": [
    {
      "components": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "breed",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "weight",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "gender",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "color",
          "type": "string"
        }
      ],
      "internalType": "struct LivestockManager.Cow",
      "name": "",
      "type": "tuple"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "getCowsCount",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
}]; 

const contractAddress = '0x54e62d5A70f082e52cE52A8043A70f6A0AaBc50F'; 

const AddCowForm = () => {
  const [cow, setCow] = useState({
    id: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    color: '',
  });

  const [txStatus, setTxStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      alert('MetaMask non détecté.');
      return;
    }

    try {
      setTxStatus('Connexion au wallet...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, livestockAbi, signer);

      setTxStatus('Envoi de la transaction...');
      const tx = await contract.addCow(
        cow.id,
        cow.breed,
        parseInt(cow.age),
        parseInt(cow.weight),
        cow.gender,
        cow.color
      );

      await tx.wait();
      setTxStatus('✅ Cattle added successfully !');
      setCow({ id: '', breed: '', age: '', weight: '', healthStatus: '', location: '' });
    } catch (error) {
      console.error(error);
      setTxStatus('❌ Error while adding cattle');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        maxWidth: '500px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <h3 style={{
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
        fontWeight: '600',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        borderBottom: '2px solid #3498db',
        paddingBottom: '0.5rem'
      }}>
        🐄 Record New Cattle
      </h3>
  
      {['id', 'breed', 'age', 'weight', 'gender', 'color'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={
            field === 'id' ? 'Tag ID' : 
            field.charAt(0).toUpperCase() + field.slice(1)
          }
          onChange={handleChange}
          value={cow[field]}
          required={field !== 'weight'}
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: '1rem',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'all 0.3s',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            ':focus': {
              outline: 'none',
              borderColor: '#3498db',
              boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)'
            }
          }}
          type={field === 'age' || field === 'weight' ? 'number' : 'text'}
        />
      ))}
  
      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s',
          marginTop: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          ':hover': {
            backgroundColor: '#2ecc71',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
          },
          ':active': {
            transform: 'translateY(0)'
          }
        }}
      >
        🐄 Add to Herd
      </button>
  
      {txStatus && (
        <p style={{
          marginTop: '1rem',
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: txStatus.includes('success') ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
          color: txStatus.includes('success') ? '#27ae60' : '#e74c3c',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {txStatus}
        </p>
      )}
    </form>
  );
};

export default AddCowForm;

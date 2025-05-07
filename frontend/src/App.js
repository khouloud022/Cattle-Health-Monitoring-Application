//App.js
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import Header from './Header';
import Main2 from './Main2';
import Publish_tender from './publish_tender'
import HomePage from './HomePage';
import Homepagegov from './HomePageGov';
import HomePageAgr from './HomePageAgr';
import Main from './Main';
import Place from './placebid';
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Viewbids from './Viewbids';
import Close from './Close';
import Selectbestbidder from './Selectbestbidder';
import Profile from './Profile';
import Profilegov from './Profilegov';
import ProfileFar from './ProfileFar';
import ProfileVet from './ProfileVet';
import Consult from './Consult';
import HomePageV from './HomePageVet';
import HomePageVet from './HomePageVet';
import Consultvet from './Consultvet';
import PredictionForm from './templates/PredictionForm';
import AddCowForm from './AddCowForm';
import CowList from './CowList';
import Cattlehealth from './Cattlehealth';
import ProfileConsumer from './ProfileConsumer';
import HomePageCons from './HomePageConsumer';
import Consultgov from './Consultgov';
import Consultop from './Consultop'
import HomePageConsumer from './HomePageConsumer';
import ConsultConsumer from './ConsultConsumer';


function App() {
  return (  
    <div>
      <div>
       <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path='HomePage' element={<HomePage/>}></Route>
      <Route path='Profilegov' element={<Profilegov/>}></Route>
      <Route path='ProfileFar' element={<ProfileFar/>}></Route>
      <Route path='ProfileVet' element={<ProfileVet/>}></Route>
      <Route path='Consult' element={<Consult/>}></Route>
      <Route path='HomepageAgr' element={<HomePageAgr/>}></Route>
      <Route path='HomePageVet' element={<HomePageVet/>}></Route>
      <Route path='Consultvet' element={<Consultvet/>}></Route>
      <Route path='templates/PredictionForm' element={<PredictionForm/>}></Route>
      <Route path='AddCowForm' element={<AddCowForm/>}></Route>
      <Route path='CowList' element={<CowList/>}></Route>
      <Route path='Cattlehealth' element={<Cattlehealth/>}></Route>
      <Route path='ProfileConsumer' element={<ProfileConsumer/>}></Route>
      <Route path='HomePageConsumer' element={<HomePageConsumer/>}></Route>
      <Route path='Consultgov' element={<Consultgov/>}></Route>
      <Route path='Consultop' element={<Consultop/>}></Route>
      <Route path='ConsultConsumer' element={<ConsultConsumer/>}></Route>

      </Routes>
      </div>
      <div>
      <Routes>
      <Route path="/Selectbestbidder" element={<Selectbestbidder />} />
      <Route path="/Viewbids" element={<Viewbids />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path='Homepagegov' element={<Homepagegov/>}></Route>
     
      
      <Route path='Main2' element={<Main2 />}></Route>
      <Route path='Main' element={<Main />}></Route>
      <Route path='placebid' element={<Place />}></Route>
      <Route path="publish_tender" element={<Publish_tender/>} />
      <Route path='Profile' element={<Profile />}></Route>
      <Route path='Close' element={<Close />}></Route>
      </Routes>
      </div>
     
     
      
    </div>
    
  );
}

export default App;

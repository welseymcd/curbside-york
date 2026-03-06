import React, {useState, useEffect} from 'react';
import './App.css';
import OrderTable from "./components/ordertable.js";
import { Container, CircularProgress, Backdrop, Box } from '@material-ui/core';
import GuestManage from './components/ParkingLot/agm';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {AppContext, UserContext} from "./utils/appcontext";
import firebase, { onAuthStateChange } from "./components/firebase.js";
import Curbside from "./components/curbside.js";
import SignIn from "./components/SignIn";
import moment from "moment"
const database = firebase.database();



function App() {
  // Top Level App States
  const [user, setUser] = useState({loggedIn: "loading"})
  //const [user, setUser] = useState({loggedIn: true})

  const date = moment();

  // Checks to see if user is logged in
  useEffect(()=>{ 
    
    const unsubscribe = onAuthStateChange(setUser);
    if(unsubscribe){
      return ()=> {
        unsubscribe();
      }
    }
    
  }, []);
  
  useEffect(()=>{
    var today = new Date();
    var tomorrow = new Date(today.getFullYear(),today.getMonth(),today.getDate() + 1, 2);
    var timeToRefresh = tomorrow - today;
    console.log("Refresh in: " + (timeToRefresh/1000/60/60).toFixed(2) + " hours");
   const timer = setTimeout(()=>{
      console.log("Refreshing browser");
      window.location.reload();
   }, timeToRefresh);
   return () => clearTimeout(timer);
 })

  return (
    <div className="App">
      <UserContext.Provider value={{user}}>
          {user.loggedIn === "loading" ?
            <Backdrop open={user.loggedIn === "loading"}>
              <CircularProgress color="inherit" />
            </Backdrop>
          :
          
          user.loggedIn ? 
            <Curbside />
            :
            <SignIn />
        }
      </UserContext.Provider>
    </div>
  );
}

export default App;

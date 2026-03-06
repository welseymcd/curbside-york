import firebase from 'firebase/app';
import "firebase/storage";
import "firebase/database";
import 'firebase/auth';
import moment from "moment"


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.databaseURL || !firebaseConfig.projectId) {
  throw new Error("Missing Firebase environment variables. See .env.example.");
}

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export function onAuthStateChange(callback) {
    firebase.auth().onAuthStateChanged(user=>{
      if(user) {
        callback({loggedIn: true, user: user});
      } else {
        callback({loggedIn: false})
      }
    })
  }

  export function login(username, password) {
    return new Promise((resolve, reject)=>{
      firebase
        .auth()
        .signInWithEmailAndPassword(username, password)
        .then(() => resolve())
        .catch(error => reject(error));
    })
  }

  export function logout() {
    firebase.auth().signOut();
  }

  export function modifyParkingLot(parking, store) {
    const database = firebase.database();
    const parkingLotRef = database.ref("/parkinglot/" + store);
    parkingLotRef.set(parking);
  }

  export function modifySpecificSpot(store, parkingSpot, index, key) {
    const database = firebase.database();
    const parkingSpotRef = database.ref("/parkinglot/" + store +"/" + index + "/" + key);
    return parkingSpotRef.set(parkingSpot);
  }

  export function modifyOrders(key, order, store) {
    const database = firebase.database();
    const date = moment();
    const ordersRef = database.ref("/checks/" + date.format("MM-DD-YYYY")+"/" + store+ "/" + key);
    return ordersRef.set(order);
  }
export default firebase;

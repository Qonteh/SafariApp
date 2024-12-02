import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyChW86DkL_buZnK25P1-JkNg1QBRhcoy2g",
  authDomain: "safariapp-5965d.firebaseapp.com",
  projectId: "safariapp-5965d",
  storageBucket: "safariapp-5965d.appspot.com",
  messagingSenderId: "394143356629",
  appId: "1:394143356629:web:01eaf9036da84a423f745c",
  measurementId: "G-DFD4Q32HPK",
  databaseURL: "https://safariapp-5965d-default-rtdb.firebaseio.com/",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const auth = firebase.auth();
export const database = firebase.database();

export const saveLocation = async (location) => {
  try {
    const databaseRef = database.ref('locations');
    await databaseRef.push(location);
    console.log("Location saved successfully");
  } catch (error) {
    console.error("Error saving location to Firebase:", error.message);
  }
};


import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase Web app: Vue-Firebase-Auth-W7
const firebaseConfig = {
  "projectId": "fit5032-137d8",
  "appId": "1:1026523857418:web:2262f3612780fb14fd15f3",
  "storageBucket": "fit5032-137d8.firebasestorage.app",
  "apiKey": "AIzaSyAnsIujlI47kZTNN7NrFUspb4SfGv3LAhs",
  "authDomain": "fit5032-137d8.firebaseapp.com",
  "messagingSenderId": "1026523857418",
  "projectNumber": "1026523857418",
  "version": "2"
}

initializeApp(firebaseConfig)

const db = getFirestore()
export default db

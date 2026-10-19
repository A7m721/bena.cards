/* Firebase Realtime Database: used only for "rooms" (playing from two places).
   Only databaseURL is needed (the game talks to the database over plain HTTPS, no SDK).
   These values are public identifiers, not secrets. What protects your data is the Database Rules (see FIREBASE_RULES.md). */
const FIREBASE_CONFIG={
  apiKey:"AIzaSyCDc2HRjPRgUOacxlVO5oYNcgBbp5urnnQ",
  authDomain:"store-3217e.firebaseapp.com",
  databaseURL:"https://store-3217e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:"store-3217e"
};
const FIREBASE_DB_URL=FIREBASE_CONFIG.databaseURL;
const ROOMS_PATH='bena/rooms';   /* everything the game stores lives under this path only */

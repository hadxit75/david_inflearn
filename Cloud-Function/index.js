const functions = require('firebase-functions');


var admin = require("firebase-admin");

var serviceAccount = require("./david-zzang.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


var db = admin.firestore();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  // functions.logger.info("Hello logs!", { structuredData: true });
  // response.send("Hello from Firebase!");

  var _idx = 0;
  db.collection("bbs")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        _idx++;

      })

      response.send("BBS Count is [" + _idx + "]");
    })



});

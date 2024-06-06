const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const { onCall, HttpsError } = require("firebase-functions/v2/https");

exports.getDocData = onCall(async (request) => {
  const docId = request.data.docId;

  if (!docId) {
    throw new HttpsError("invalid-argument: docId");
  }

  const collectionRef = db.collection("user");
  const document = await collectionRef.doc(docId).get();

  if (document.exists) {
    const data = document.data();

    return {
      FavArt: data["FavArt"],
      Info: data["Info"],
      UploadedArt: data["UploadedArt"],
    };
  } else {
    throw new HttpsError("no document found!");
  }
});

exports.authUserAdmin = onCall(async (request) => {
  const idToken = request.data.idToken;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error during token verification:", error);
    throw error;
  }
});

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");

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

exports.addnumbers = onCall((request) => {
  const firstNumber = request.data.firstNumber;
  const secondNumber = request.data.secondNumber;

  if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new HttpsError(
      "invalid-argument",
      "The function must be called " +
        'with two arguments "firstNumber" and "secondNumber" which ' +
        "must both be numbers."
    );
  }

  return {
    firstNumber: firstNumber,
    secondNumber: secondNumber,
    operator: "+",
    operationResult: firstNumber + secondNumber,
  };
});

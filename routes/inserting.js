const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json"); // WARN
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

const insertDatasToPolices = (datas) => {
  for (let data of datas) {
    const docRef = db.collection("policies").doc();
    docRef.set({
      title: data.title,
      registrationDate: Timestamp.fromDate(new Date(data.date)),
      department: data.dept,
      contentURL: data.url,
      contentHTML: data.contentHTML,
      keywords: data.keywords,
      region: data.region,
    });
  }
};

const insertDatasToNews = (datas) => {
  for (let data of datas) {
    const docRef = db.collection("news").doc();
    docRef.set({
      title: data.title,
      registrationDate: Timestamp.fromDate(new Date(data.date)),
      thumbnailURL: data.thumbnailURL,
      contentURL: data.url,
      contentHTML: data.contentHTML,
      keywords: data.keywords,
      region: data.region,
    });
  }
};

module.exports = { insertDatasToPolices, insertDatasToNews };

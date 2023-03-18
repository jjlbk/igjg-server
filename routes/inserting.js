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

var mod = require("korean-text-analytics");
const util = require("util");
const ExecuteMorphModulePromise = util.promisify(mod.ExecuteMorphModule);

const preprocessDatas = async (datas) => {
  var preprocessedDatas = [];
  for (let data of datas) {
    // 형태소 분석
    var morphemes = await ExecuteMorphModulePromise(data.contentText);

    // 키워드 추출
    var keywords = [];
    for (let morpheme of morphemes["morphed"]) {
      if (["NNG", "NNP", "NNB"].includes(morpheme.tag)) {
        keywords.push(morpheme.word);
      }
    }

    data["keywords"] = keywords;
    preprocessedDatas.push(data);
  }
  return preprocessedDatas;
};

const insertDatasToPolices = (datas) => {
  for (let data of datas) {
    const docRef = db.collection("policies").doc();
    docRef.set({
      title: data.title,
      registrationDate: Timestamp.fromDate(new Date(data.date)),
      department: data.dept,
      contentURL: data.url,
      // contentHTML: data.contentHTML,
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

module.exports = { preprocessDatas, insertDatasToPolices, insertDatasToNews };

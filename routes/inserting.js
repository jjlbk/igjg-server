const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();

var mod = require("korean-text-analytics");
const util = require("util");
const ExecuteMorphModulePromise = util.promisify(mod.ExecuteMorphModule);

const preprocessDatas = async (datas) => {
  var preprocessedDatas = [];
  for (let data of datas) {
    // 한글 제외하고 모조리 제거
    if (!/^[^\u0000-\u007F]*$/.test(data.contentText)) {
      editedData = data.contentText.replace(
        /[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7FF\uFF00-\uFFEF]/g,
        " "
      );
    }

    // 형태소 분석
    var morphemes = await ExecuteMorphModulePromise(editedData);

    // 키워드 추출
    var keywords = [];
    for (let morpheme of morphemes["morphed"]) {
      if (["NNG", "NNP", "NNB"].includes(morpheme.tag)) {
        keywords.push(morpheme.word);
      }
    }
    data.keywords = keywords;
    preprocessedDatas.push(data);
  }
  return preprocessedDatas;
};

const insertDatasToPolices = async (datas) => {
  for (let data of datas) {
    const docRef = db.collection("policies").doc();
    docRef.set({
      title: data.title,
      registrationDate: Timestamp.fromDate(new Date(data.date)),
      department: data.dept,
      contentURL: data.url,
      contentText: data.contentText,
      keywords: data.keywords,
      region: data.region,
      createdAt: FieldValue.serverTimestamp(),
    });

    for (let keyword of data.keywords) {
      const keywordsRef = db.collection(`/regions/${data.region}/keywords`);
      const keywordRes = await keywordsRef.doc(keyword).get();

      if (keywordRes.exists) {
        await keywordsRef.doc(keyword).update({
          name: keyword,
          frequency: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await keywordsRef.doc(keyword).set({
          name: keyword,
          frequency: 1,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    // HDCD
    db.doc(`regions/${data.region}`).update({
      "policySnippet.works": FieldValue.increment(
        ["일자리창출", "일자리정책과", "일자리창출과"].includes(data.dept)
          ? 1
          : 0
      ),
      "policySnippet.homes": FieldValue.increment(
        ["주거복지팀", "주택과", "주택정책과"].includes(data.dept) ? 1 : 0
      ),
      "policySnippet.edus": FieldValue.increment(
        [
          "교육정책팀",
          "교육청소년과",
          "아동청소년과",
          "여성청소년보육과",
        ].includes(data.dept)
          ? 1
          : 0
      ),
      "policySnippet.births": FieldValue.increment(
        ["여성정책팀", "여성가족과"].includes(data.dept) ? 1 : 0
      ),
    });
  }
};

const insertDatasToNews = async (datas) => {
  for (let data of datas) {
    const docRef = db.collection("news").doc();
    docRef.set({
      title: data.title,
      registrationDate: Timestamp.fromDate(new Date(data.date)),
      thumbnailURL: data.img,
      contentURL: data.url,
      contentText: data.contentText,
      keywords: data.keywords,
      region: data.region,
      createdAt: FieldValue.serverTimestamp(),
    });

    for (let keyword of data.keywords) {
      const keywordsRef = db.collection(`/regions/${data.region}/keywords`);
      const keywordRes = await keywordsRef.doc(keyword).get();

      if (keywordRes.exists) {
        keywordsRef.doc(keyword).update({
          name: keyword,
          frequency: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        keywordsRef.doc(keyword).set({
          name: keyword,
          frequency: 1,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }
  }
};

module.exports = { preprocessDatas, insertDatasToPolices, insertDatasToNews };

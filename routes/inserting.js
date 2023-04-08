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
    if (!/^[^\u0000-\u007F]*$/.test(data.title)) {
      editedData = data.title.replace(
        /[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7FF\uFF00-\uFFEF]/g,
        " "
      );
    }

    // **제목만** 형태소 분석 및 키워드 추출
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
      registrationNum: data.num,
      registrationDate: data.date,
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
    const departmentsRef = db.collection("departments");
    const departmentsRes = await departmentsRef
      .where("name", "==", data.dept)
      .get();

    console.log(data.dept, departmentsRes.empty);

    if (!departmentsRes.empty) {
      var categoryOfDept;
      departmentsRes.forEach(async (doc) => {
        categoryOfDept = await doc.data().category;
      });

      switch (categoryOfDept) {
        case "births":
          db.doc(`regions/${data.region}`).update({
            "policySnippet.births": FieldValue.increment(1),
          });
          break;
        case "edus":
          db.doc(`regions/${data.region}`).update({
            "policySnippet.edus": FieldValue.increment(1),
          });
          break;
        case "homes":
          db.doc(`regions/${data.region}`).update({
            "policySnippet.homes": FieldValue.increment(1),
          });
          break;
        case "works":
          db.doc(`regions/${data.region}`).update({
            "policySnippet.works": FieldValue.increment(1),
          });
          break;
      }
    } else {
      await departmentsRef.doc(data.dept).set({
        name: data.dept,
        category: -1,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  }
};

const insertDatasToNews = async (datas) => {
  for (let data of datas) {
    const docRef = db.collection("news").doc();
    docRef.set({
      title: data.title,
      registrationNum: data.num,
      registrationDate: data.date,
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

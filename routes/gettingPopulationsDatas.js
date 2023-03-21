const axios = require("axios");

const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();

const gettingPopulationsDatas = () => {
  var c1s = [
    11, 21, 22, 23, 24, 25, 26, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ];

  for (let c1 of c1s) {
    gettingPopulationDataPerRegion(c1);
  }
};

// c1: region number of KOSIS
const gettingPopulationDataPerRegion = async (c1) => {
  var populationDataFileds = (
    await axios.get(
      `https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=${process.env.KOSIS_API_KEY}&itmId=T1+&objL1=${c1}+&objL2=10+11+15+16+17+18+20+21+30+31+&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=M&newEstPrdCnt=1&orgId=101&tblId=DT_1B8000G`
    )
  ).data;

  var populationData = {};
  for (let populationDataFiled of populationDataFileds) {
    populationData[populationDataFiled["C2_NM_ENG"]] =
      populationDataFiled["DT"];
  }

  const snapshot = await db
    .doc(
      `regions/${populationDataFileds[0]["C1_NM_ENG"]}/populations/${populationDataFileds[0]["PRD_DE"]}`
    )
    .get();

  if (snapshot.exists) {
    db.doc(
      `regions/${populationDataFileds[0]["C1_NM_ENG"]}/populations/${populationDataFileds[0]["PRD_DE"]}`
    ).update(populationData);
  } else {
    db.doc(
      `regions/${populationDataFileds[0]["C1_NM_ENG"]}/populations/${populationDataFileds[0]["PRD_DE"]}`
    ).set(populationData);
  }

  var populationSnippetData = {};
  populationSnippetData["births"] = populationData["Live births(persons)"];
  populationSnippetData["deaths"] = populationData["Deaths(persons)"];
  populationSnippetData["decrease"] =
    populationData["Natural increase(persons)"];

  db.doc(`regions/${populationDataFileds[0]["C1_NM_ENG"]}`).update({
    "populationSnippet.births": populationData["Live births(persons)"],
    "populationSnippet.deaths": populationData["Deaths(persons)"],
    "populationSnippet.decrease": populationData["Natural increase(persons)"],
  });
};

const gettingHouseholdsDatas = async () => {
  var householdsDatas = (
    await axios.get(
      `https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=${process.env.KOSIS_API_KEY}&itmId=T1+&objL1=11+26+27+28+29+30+31+41110+41280+41460+48110+48120+50+&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=M&newEstPrdCnt=1&orgId=101&tblId=DT_1B040B3`
    )
  ).data;

  for (let householdsData of householdsDatas) {
    const snapshot = await db
      .doc(
        `regions/${householdsData["C1_NM_ENG"]}/populations/${householdsData["PRD_DE"]}`
      )
      .get();

    if (snapshot.exists) {
      db.doc(
        `regions/${householdsData["C1_NM_ENG"]}/populations/${householdsData["PRD_DE"]}`
      ).update({
        households: householdsData["DT"],
      });
    } else {
      db.doc(
        `regions/${householdsData["C1_NM_ENG"]}/populations/${householdsData["PRD_DE"]}`
      ).set({
        households: householdsData["DT"],
      });
    }

    db.doc(`regions/${householdsData["C1_NM_ENG"]}`).update({
      "populationSnippet.population": householdsData["DT"],
    });
  }
};

module.exports = { gettingPopulationsDatas, gettingHouseholdsDatas };

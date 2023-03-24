const {
  getFirestore,
  Timestamp,
  FieldValue,
  GeoPoint,
} = require("firebase-admin/firestore");
const db = getFirestore();
const axios = require("axios");

const initRegions = async () => {
  const regionsRef = db.collection("regions");

  const householdsDatas = (
    await axios.get(
      `https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=${process.env.KOSIS_API_KEY}&itmId=T1+&objL1=00+11+26+27+28+29+30+31+36+41+41110+41280+41460+42+43+44+45+46+47+48+48120+50+&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=M&newEstPrdCnt=1&orgId=101&tblId=DT_1B040B3`
    )
  ).data;

  console.log(householdsDatas);

  for (householdsData of householdsDatas) {
    const regionRef = regionsRef.doc(householdsData["C1_NM_ENG"]);

    await regionRef.set({
      name: householdsData["C1_NM_ENG"],
      placedAt: new GeoPoint(0, 0),
      populationSnippet: {
        births: 0,
        deaths: 0,
        decrease: 0,
        population: 0,
      },
      policySnippet: {
        births: 0,
        edus: 0,
        homes: 0,
        works: 0,
      },
      createdAt: FieldValue.serverTimestamp(),
    });

    regionRef
      .collection("populations")
      .doc(householdsData["PRD_DE"])
      .set({ households: householdsData["DT"] });
  }

  // HDCD
  regionsRef.doc("Seoul").update({ placedAt: new GeoPoint(37.541, 126.986) });
  regionsRef
    .doc("Suwon-si")
    .update({ placedAt: new GeoPoint(37.2638326, 127.0283332) });
  regionsRef
    .doc("Yongin-si")
    .update({ placedAt: new GeoPoint(37.2410864, 127.1775537) });
  regionsRef
    .doc("Goyang-si")
    .update({ placedAt: new GeoPoint(37.6583599, 126.8320201) });
  regionsRef
    .doc("Changwon-si")
    .update({ placedAt: new GeoPoint(35.219, 128.583) });
};

module.exports = {
  initRegions,
};

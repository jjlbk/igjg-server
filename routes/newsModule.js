const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const log = console.log;

const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

// 보도자료 모듈
// data = [title, date, url, img, region, contentText, keywords]

const { preprocessDatas } = require("./inserting");

// 0: 전부 확인, 1: 오늘 날짜만 확인
const printToday = 1;

// 수원특례시 보도자료 모듈
const getNewsFromSuwon = async (startPage, endPage) => {
  var dataArr = [];
  const promises = [];
  const latestNum = db
    .collection("news")
    .where("region", "==", "Suwon-si")
    .orderBy("registrationNum", "desc")
    .limit(1)
    .get();

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.suwon.go.kr/web/board/BD_board.list.do?seq=&bbsCd=1043&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=${cpage}&q_sortName=&q_sortOrder=&q_rowPerPage=10&q_searchKeyType=TITLE___1002&q_searchKey=&q_searchVal=`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  for (const response of responses) {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadNum = $(
        `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
      )
        .text()
        .trim();

      if (printToday != 0 && latestNum >= uploadNum) {
        continue;
      }

      const concat =
        "https://www.suwon.go.kr/web/board/BD_board.view.do?seq=" +
        $(
          `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td.p-subject > a`
        )
          .attr("onclick")
          .match(/\d+/g)[1] +
        "&bbsCd=1043&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=2&q_sortName=&q_sortOrder=&q_rowPerPage=10&q_searchKeyType=TITLE___1002&q_searchKey=&q_searchVal=";

      const data = {
        title: $(
          `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td.p-subject > a`
        )
          .text()
          .trim(),
        num: uploadNum,
        date: $(
          `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
        )
          .text()
          .trim(),
        url: concat,
        img: null,
        region: "Suwon-si",
      };

      // inner page crawling
      const tmp = await axios.get(concat);
      const htmlString = tmp.data;
      const $2 = cheerio.load(htmlString);
      const imgTag =
        "#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(2) > td > ul > li:nth-child(2) > a.p-attach__preview.p-button";

      // contentText, img
      data.contentText = $2(
        "#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(3) > td"
      ).text();
      if ($2(imgTag).attr("onclick") != undefined) {
        data.img = $2(imgTag)
          .attr("onclick")
          .match(/'(http[^']+)'/);
      }

      dataArr.push(data);
    }
  }
  dataArr = preprocessDatas(dataArr);

  return dataArr;
};

// 용인특례시 보도자료 모듈
const getNewsFromYongin = async (startPage, endPage) => {
  var dataArr = [];
  const promises = [];
  const latestNum = db
    .collection("news")
    .where("region", "==", "Yongin-si")
    .orderBy("registrationNum", "desc")
    .limit(1)
    .get();

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.yongin.go.kr/user/bbs/BD_selectBbsList.do?q_clCode=&q_lwprtClCode=&q_searchKeyTy=&q_searchVal=&q_bbsCode=1020&q_bbscttSn=&q_rowPerPage=10&q_currPage=${cpage}&q_sortName=&q_sortOrder=&`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  for (const response of responses) {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadNum = $(
        `#contents > div.cont_box > div.t_photo > ul > li:nth-child(${i}) > div > dl > dt > a`
      )
        .attr("onclick")
        .match(/\d+/g)[0];

      if (printToday != 0 && latestNum >= uploadNum) {
        continue;
      }

      const concat =
        "https://www.yongin.go.kr/user/bbs/BD_selectBbs.do?q_clCode=&q_lwprtClCode=&q_searchKeyTy=&q_searchVal=&q_bbsCode=1020&q_bbscttSn=" +
        $(
          `#contents > div.cont_box > div.t_photo > ul > li:nth-child(${i}) > div > dl > dt > a`
        )
          .attr("onclick")
          .match(/\d+/g)[0] +
        "&q_rowPerPage=10&q_currPage=2&q_sortName=&q_sortOrder=&";

      const data = {
        title: $(
          `#contents > div.cont_box > div.t_photo > ul > li:nth-child(${i}) > div > dl > dt > a`
        )
          .text()
          .trim(),
        num: uploadNum,
        date: $(
          `#contents > div.cont_box > div.t_photo > ul > li:nth-child(${i}) > div > dl > dd > ul > li:nth-child(2)`
        )
          .text()
          .trim(),
        url: concat,
        img:
          "https://www.yongin.go.kr/" +
          $(
            `#contents > div.cont_box > div.t_photo > ul > li:nth-child(${i}) > div > p > a > img`
          ).attr("src"),
        region: "Yongin-si",
      };
      // inner page crawling
      const tmp = await axios.get(concat);
      const htmlString = tmp.data;
      const $2 = cheerio.load(htmlString);

      // contentText, img
      data.contentText = $2(
        "#contentsTable > tbody > tr:nth-child(4) > td > div.txt"
      ).text();

      dataArr.push(data);
    }
  }
  dataArr = preprocessDatas(dataArr);

  return dataArr;
};

// 고양특례시 보도자료 모듈
const getNewsFromGoyang = async (startPage, endPage) => {
  var dataArr = [];
  const promises = [];
  const latestNum = db
    .collection("news")
    .where("region", "==", "Goyang-si")
    .orderBy("registrationNum", "desc")
    .limit(1)
    .get();

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.goyang.go.kr/news/user/bbs/BD_selectBbsList.do?q_bbsCode=1090&q_currPage=${cpage}&q_clCode=&q_clNm=&q_estnColumn1=All&q_searchKey=1000&q_searchVal=`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  for (const response of responses) {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadNum = $(
        `#content > table > tbody > tr:nth-child(${i}) > td.subject.text-left > a`
      )
        .attr("onclick")
        .match(/\d+/g)[1];

      if (printToday != 0 && latestNum >= uploadNum) {
        continue;
      }

      const concat =
        "https://www.goyang.go.kr/news/user/bbs/BD_selectBbs.do?q_bbsCode=1090&q_bbscttSn=" +
        $(
          `#content > table > tbody > tr:nth-child(${i}) > td.subject.text-left > a`
        )
          .attr("onclick")
          .match(/\d+/g)[1] +
        "&q_estnColumn1=All";

      const data = {
        title: $(
          `#content > table > tbody > tr:nth-child(${i}) > td.subject.text-left > a`
        )
          .text()
          .trim(),
        num: uploadNum,
        date: $(`#content > table > tbody > tr:nth-child(${i}) > td.date`)
          .text()
          .replaceAll(".", "-")
          .trim(),
        url: concat,
        img: null,
        region: "Goyang-si",
      };

      // inner page crawling
      const tmp = await axios.get(concat);
      const htmlString = tmp.data;
      const $2 = cheerio.load(htmlString);
      const imgTag = "#mobileView > div > img";

      // html, img
      data.contentText = $2("#mobileView > p").text();

      if ($2(imgTag).attr("src") != undefined) {
        data.img = "https://www.goyang.go.kr/" + $2(imgTag).attr("src");
      }

      dataArr.push(data);
    }
  }
  dataArr = preprocessDatas(dataArr);

  return dataArr;
};

// 창원특례시 보도자료 모듈
const getNewsFromChangwon = async (startPage, endPage) => {
  var dataArr = [];
  const promises = [];
  const latestNum = db
    .collection("news")
    .where("region", "==", "Changwon-si")
    .orderBy("registrationNum", "desc")
    .limit(1)
    .get();

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.changwon.go.kr/cwportal/10310/10429/10432.web?gcode=1011&cpage=${cpage}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  for (const response of responses) {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadNum = $(
        `#listForm > div.list1f1t3i1.default3.bbs-skin-default3 > ul > li:nth-child(${i}) > div > a`
      ).attr("href");

      if (printToday != 0 && latestNum >= uploadNum) {
        continue;
      }

      const concat =
        "https://www.changwon.go.kr/cwportal/10310/10429/10432.web" +
        $(
          `#listForm > div.list1f1t3i1.default3.bbs-skin-default3 > ul > li:nth-child(${i}) > div > a`
        ).attr("href");

      const data = {
        title: $(
          `#listForm > div.list1f1t3i1.default3.bbs-skin-default3 > ul > li:nth-child(${i}) > div > a > span.wrap1texts > strong`
        ).text(),
        num: uploadNum,
        date: $(
          `#listForm > div.list1f1t3i1.default3.bbs-skin-default3 > ul > li:nth-child(${i}) > div > a > span > i > span:nth-child(1)`
        )
          .text()
          .trim(),
        url: concat,
        img: null,
        region: "Changwon-si",
      };

      // inner page crawling
      const tmp = await axios.get(concat);
      const htmlString = tmp.data;
      const $2 = cheerio.load(htmlString);
      const imgTag =
        "#body_content > div > div.bbs1view1 > div.substance > div > div > p > img";

      // html, img
      data.contentText = $2(
        "#body_content > div > div.bbs1view1 > div.substance"
      ).text();

      if ($2(imgTag).attr("src") != undefined) {
        data.img = "https://www.changwon.go.kr" + $2(imgTag).attr("src");
      }

      dataArr.push(data);
    }
  }
  dataArr = preprocessDatas(dataArr);

  return dataArr;
};

module.exports = {
  getNewsFromSuwon,
  getNewsFromYongin,
  getNewsFromGoyang,
  getNewsFromChangwon,
};

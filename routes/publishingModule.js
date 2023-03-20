const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const log = console.log;

// 시정소식 모듈
// data = [title, dept, date, url, region]

// 수원특례시 시정소식 모듈
const getPublishingFromSuwon = async (startPage, endPage) => {
  const dataArr = [];
  const promises = [];
  const today = new Date().toISOString().slice(0, 10);

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.suwon.go.kr/web/board/BD_board.list.do?seq=&bbsCd=1042&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=${cpage}&q_sortName=&q_sortOrder=&q_rowPerPage=10&q_searchKeyType=TITLE___1002&q_searchKey=&q_searchVal=`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  responses.forEach((response) => {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadDate = $(
        `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
      )
        .text()
        .replaceAll("/", "-")
        .trim();
      if (today !== uploadDate) {
        break;
      }

      const data = {
        title: $(
          `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td.p-subject > a`
        )
          .text()
          .trim(),
        dept: $(
          `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`
        )
          .text()
          .trim(),
        date: uploadDate,
        url:
          "https://www.suwon.go.kr/web/board/BD_board.view.do?seq=" +
          $(
            `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td.p-subject > a`
          )
            .attr("onclick")
            .match(/\d+/g)[1] +
          "&bbsCd=1042&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=1&q_sortNam",
        region: "Suwon",
      };
      dataArr.push(data);
    }
  });

  return dataArr;
};

// 용인특례시 시정소식 모듈
const getPublishingFromYongin = async (startPage, endPage) => {
  const dataArr = [];
  const promises = [];
  const today = new Date().toISOString().slice(0, 10);

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.yongin.go.kr/user/bbs/BD_selectBbsList.do?q_menu=&q_bbsType=&q_clCode=1&q_lwprtClCode=&q_searchKeyTy=sj___1002&q_searchVal=&q_category=&q_bbsCode=1001&q_bbscttSn=&q_currPage=${cpage}&q_sortName=&q_sortOrder=&`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  responses.forEach((response) => {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadDate = $(
        `#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
      )
        .text()
        .replaceAll("/", "-")
        .trim();
      if (today !== uploadDate) {
        break;
      }

      const data = {
        title: $(
          `#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(${i}) > td.td_al > a`
        )
          .text()
          .trim(),
        dept: $(
          `#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`
        )
          .text()
          .trim(),
        date: uploadDate,
        url:
          "https://www.yongin.go.kr" +
          $(
            `#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(${i}) > td.td_al > a`
          ).attr("href"),
        region: "Yongin",
      };
      dataArr.push(data);
    }
  });

  return dataArr;
};

// 고양특례시 시정소식 모듈
const getPublishingFromGoyang = async (startPage, endPage) => {
  const dataArr = [];
  const promises = [];
  const today = new Date().toISOString().slice(0, 10);

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.goyang.go.kr/www/user/bbs/BD_selectBbsList.do?q_bbsCode=1030&q_currPage=${cpage}&q_pClCode=&q_clCode=&q_clNm=&q_searchKey=1000&q_searchVal=`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  responses.forEach((response) => {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadDate = $(
        `#content > table > tbody > tr:nth-child(${i}) > td.date`
      )
        .text()
        .replaceAll(".", "-")
        .trim();
      if (today !== uploadDate) {
        break;
      }

      const data = {
        title: $(
          `#content > table > tbody > tr:nth-child(${i}) > td.subject.text-left > a`
        )
          .text()
          .trim(),
        dept: $(
          `#content > table > tbody > tr:nth-child(${i}) > td:nth-child(3)`
        )
          .text()
          .trim(),
        date: uploadDate,
        url:
          "https://www.goyang.go.kr/www/user/bbs/BD_selectBbs.do?q_bbsCode=1030&q_bbscttSn=" +
          $(
            `#content > table > tbody > tr:nth-child(${i}) > td.subject.text-left > a`
          )
            .attr("onclick")
            .match(/\d+/g)[1] +
          "&q_currPage=1&q_pClCode=",
        region: "Goyang",
      };
      dataArr.push(data);
    }
  });

  return dataArr;
};

// 창원특례시 시정소식 모듈
const getPublishingFromChangwon = async (startPage, endPage) => {
  const dataArr = [];
  const promises = [];
  const today = new Date().toISOString().slice(0, 10);

  const getHtml = async (cpage) => {
    try {
      return await axios.get(
        `https://www.changwon.go.kr/cwportal/10310/10429/10430.web?gcode=1009&cpage=${cpage}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    promises.push(getHtml(currentPage));
  }

  const responses = await Promise.all(promises);

  responses.forEach((response) => {
    const $ = cheerio.load(response.data);
    for (let i = 1; i <= 10; i++) {
      const uploadDate = $(
        `#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`
      )
        .text()
        .trim();
      if (today !== uploadDate) {
        break;
      }

      const data = {
        title: $(
          `#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(${i}) > td.tal > a`
        )
          .text()
          .match(/^[^\n]*/)[0]
          .trim(),
        dept: $(
          `#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(${i}) > td:nth-child(3)`
        )
          .text()
          .trim(),
        date: uploadDate,
        url:
          "https://www.changwon.go.kr/cwportal/10310/10429/10430.web" +
          $(
            `#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(${i}) > td.tal > a`
          ).attr("href"),
        region: "Changwon",
      };
      dataArr.push(data);
    }
  });

  return dataArr;
};

module.exports = {
  getPublishingFromSuwon,
  getPublishingFromYongin,
  getPublishingFromGoyang,
  getPublishingFromChangwon,
};

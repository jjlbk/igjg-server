const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const log = console.log;

var startPage = 1,
  endPage = 2;

router.get("/", function (req, res, next) {
  res.send("This is crawling router.");
});

router.get("/:id", function (req, res, next) {
  const dataArr = [];
  const promises = [];

  switch (req.params.id) {
    case "1": // 수원특례시
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.suwon.go.kr/web/board/BD_board.list.do?seq=&bbsCd=1042&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=${cpage}&q_sortName=&q_sortOrder=&q_rowPerPage=10&q_searchKeyType=TITLE___1002&q_searchKey=&q_searchVal=`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
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
                date: $(
                  `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
                )
                  .text()
                  .trim(),
                url:
                  "https://www.suwon.go.kr/web/board/BD_board.view.do?seq=" +
                  $(
                    `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td.p-subject > a`
                  )
                    .attr("onclick")
                    .match(/\d+/g)[1] +
                  "&bbsCd=1042&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=1&q_sortNam",
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;

    case "2": // 용인특례시
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.yongin.go.kr/user/bbs/BD_selectBbsList.do?q_menu=&q_bbsType=&q_clCode=1&q_lwprtClCode=&q_searchKeyTy=sj___1002&q_searchVal=&q_category=&q_bbsCode=1001&q_bbscttSn=&q_currPage=${cpage}&q_sortName=&q_sortOrder=&`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
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
                date: $(
                  `#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
                )
                  .text()
                  .trim(),
                url:
                  "https://www.yongin.go.kr" +
                  $(
                    `#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(${i}) > td.td_al > a`
                  ).attr("href"),
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;

    case "3": // 고양특례시
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.goyang.go.kr/www/user/bbs/BD_selectBbsList.do?q_bbsCode=1030&q_currPage=${cpage}&q_pClCode=&q_clCode=&q_clNm=&q_searchKey=1000&q_searchVal=`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
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
                date: $(
                  `#content > table > tbody > tr:nth-child(${i}) > td.date`
                )
                  .text()
                  .trim(),
                url:
                  "https://www.goyang.go.kr/www/user/bbs/BD_selectBbs.do?q_bbsCode=1030&q_bbscttSn=" +
                  $(
                    `#content > table > tbody > tr:nth-child(${i}) > td.subject.text-left > a`
                  )
                    .attr("onclick")
                    .match(/\d+/g)[1] +
                  "&q_currPage=1&q_pClCode=",
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;

    case "4": // 창원특례시
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.changwon.go.kr/cwportal/10310/10429/10430.web?gcode=1009&cpage=${cpage}`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
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
                date: $(
                  `#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`
                )
                  .text()
                  .trim(),
                url:
                  "https://www.changwon.go.kr/cwportal/10310/10429/10430.web" +
                  $(
                    `#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(${i}) > td.tal > a`
                  ).attr("href"),
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;

    case "5": // 수원특례시 보도자료
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.suwon.go.kr/web/board/BD_board.list.do?seq=&bbsCd=1043&pageType=&showSummaryYn=N&delDesc=&q_ctgCd=&q_currPage=${cpage}&q_sortName=&q_sortOrder=&q_rowPerPage=10&q_searchKeyType=TITLE___1002&q_searchKey=&q_searchVal=`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
              var concat =
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

                date: $(
                  `#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
                )
                  .text()
                  .trim(),

                url: concat,
                img: null,
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;

    case "6": // 용인특례시 보도자료
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.yongin.go.kr/user/bbs/BD_selectBbsList.do?q_clCode=&q_lwprtClCode=&q_searchKeyTy=&q_searchVal=&q_bbsCode=1020&q_bbscttSn=&q_rowPerPage=10&q_currPage=${cpage}&q_sortName=&q_sortOrder=&`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
              var concat =
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
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;

    case "7": // 고양특례시 보도자료
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.goyang.go.kr/news/user/bbs/BD_selectBbsList.do?q_bbsCode=1090&q_currPage=${cpage}&q_clCode=&q_clNm=&q_estnColumn1=All&q_searchKey=1000&q_searchVal=`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
              var concat =
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

                date: $(
                  `#content > table > tbody > tr:nth-child(${i}) > td.date`
                )
                  .text()
                  .trim(),

                url: concat,
                img: null,
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;

    case "8": // 창원특례시 보도자료
      var getHtml = async (cpage) => {
        try {
          return await axios.get(
            `https://www.changwon.go.kr/cwportal/10310/10429/10432.web?gcode=1011&cpage=${cpage}`
          );
        } catch (error) {
          console.error(error);
        }
      };

      for (startPage = 1; startPage <= endPage; startPage++) {
        promises.push(getHtml(startPage));
      }

      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response) => {
            const $ = cheerio.load(response.data);
            for (let i = 1; i <= 10; i++) {
              var concat =
                "https://www.changwon.go.kr/cwportal/10310/10429/10432.web" +
                $(
                  `#listForm > div.list1f1t3i1.default3.bbs-skin-default3 > ul > li:nth-child(${i}) > div > a`
                ).attr("href");

              const data = {
                title: $(
                  `#listForm > div.list1f1t3i1.default3.bbs-skin-default3 > ul > li:nth-child(${i}) > div > a > span.wrap1texts > strong`
                ).text(),
                date: $(
                  `#listForm > div.list1f1t3i1.default3.bbs-skin-default3 > ul > li:nth-child(${i}) > div > a > span > i > span:nth-child(1)`
                )
                  .text()
                  .trim(),

                url: concat,
                img: null,
              };
              dataArr.push(data);
            }
          });
          console.log(dataArr);
        })
        .then((res) => log(res));
      break;
  }
  res.send("This is crawling router.\n Crawling is done.");
});

module.exports = router;

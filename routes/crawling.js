const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

router.get("/", function (req, res, next) {
  res.send("This is crawling router.");
});

router.get("/:id", function (req, res, next) {
  switch (req.params.id) {
    case "1": // 수원특례시
      var getHtml = async () => {
        try {
          return await axios.get(
            "https://www.suwon.go.kr/web/board/BD_board.list.do?bbsCd=1042"
          );
        } catch (error) {
          console.error(error);
        }
      };
      getHtml()
        .then((html) => {
          // axios 응답 스키마 `data`는 서버가 제공한 응답(데이터)을 받는다.
          // load()는 인자로 html 문자열을 받아 cheerio 객체 반환
          const $ = cheerio.load(html.data);
          for (let i = 1; i <= 10; i++) {
            const data = {
              title: $(
                "#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(" +
                  i +
                  ") > td.p-subject > a"
              )
                .text()
                .trim(),
              dept: $(
                "#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(" +
                  i +
                  ") > td:nth-child(4)"
              )
                .text()
                .trim(),
              date: $(
                "#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(" +
                  i +
                  ") > td:nth-child(5)"
              )
                .text()
                .trim(),
              url: $(
                "#contents > div:nth-child(1) > div > table > tbody > tr:nth-child(" +
                  i +
                  ") > td.p-subject > a"
              ).attr("onclick"),
            };
            console.log(data);
          }
        })
        .then((res) => log(res));
      break;
    case "2": // 용인특례시
      var getHtml = async () => {
        try {
          return await axios.get(
            "https://www.yongin.go.kr/user/bbs/BD_selectBbsList.do?q_bbsCode=1001&q_clCode=1"
          );
        } catch (error) {
          console.error(error);
        }
      };
      getHtml()
        .then((html) => {
          // axios 응답 스키마 `data`는 서버가 제공한 응답(데이터)을 받는다.
          // load()는 인자로 html 문자열을 받아 cheerio 객체 반환
          const $ = cheerio.load(html.data);
          for (let i = 1; i <= 10; i++) {
            const data = {
              title: $(
                "#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(" +
                  i +
                  ") > td.td_al > a"
              ).text(),
              dept: $(
                "#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(" +
                  i +
                  ") > td:nth-child(4)"
              )
                .text()
                .trim(),
              date: $(
                "#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(" +
                  i +
                  ") > td:nth-child(5)"
              )
                .text()
                .trim(),
              url: $(
                "#contents > div.cont_box > div.t_list > table > tbody > tr:nth-child(" +
                  i +
                  ") > td.td_al > a"
              ).attr("href"),
            };
            console.log(data);
          }
        })
        .then((res) => log(res));
      break;
    case "3": // 고양특례시
      break;
    case "4": // 창원특례시
      var getHtml = async () => {
        try {
          return await axios.get(
            "https://www.changwon.go.kr/cwportal/10310/10429/10430.web?gcode=1009&cpage=1"
          );
        } catch (error) {
          console.error(error);
        }
      };
      getHtml()
        .then((html) => {
          // axios 응답 스키마 `data`는 서버가 제공한 응답(데이터)을 받는다.
          // load()는 인자로 html 문자열을 받아 cheerio 객체 반환
          const $ = cheerio.load(html.data);
          for (let i = 1; i <= 10; i++) {
            const data = {
              title: $(
                "#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(" +
                  i +
                  ") > td.tal > a"
              ).text(),
              dept: $(
                "#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(" +
                  i +
                  ") > td:nth-child(3)"
              )
                .text()
                .trim(),
              date: $(
                "#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(" +
                  i +
                  ") > td:nth-child(4)"
              )
                .text()
                .trim(),
              url:
                "https://www.changwon.go.kr/cwportal/10310/10429/10430.web" +
                $(
                  "#listForm > div.list2table1.rspnsv > table > tbody > tr:nth-child(" +
                    i +
                    ") > td.tal > a"
                ).attr("href"),
            };
            console.log(data);
          }
        })
        .then((res) => log(res));
      break;
  }
  res.send("This is crawling router.\n Crawling is done.");
});

module.exports = router;
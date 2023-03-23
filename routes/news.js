const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const log = console.log;

// 디버깅용
const {
  getNewsFromSuwon,
  getNewsFromYongin,
  getNewsFromGoyang,
  getNewsFromChangwon,
} = require("./newsModule");

const { insertDatasToNews } = require("./inserting");

var startPage = 1,
  endPage = 1;

router.get("/", function (req, res, next) {
  res.send("This is crawling router.");
});

router.get("/:id", async function (req, res, next) {
  switch (req.params.id) {
    case "1": // 수원특례시
      newsData = await getNewsFromSuwon(startPage, endPage);
      break;

    case "2": // 용인특례시
      newsData = await getNewsFromYongin(startPage, endPage);
      break;

    case "3": // 고양특례시
      newsData = await getNewsFromGoyang(startPage, endPage);
      break;

    case "4": // 창원특례시
      newsData = await getNewsFromChangwon(startPage, endPage);
      break;
  }
  // insertDatasToNews(newsData);
  console.log(newsData);
  console.log("\nToday: " + new Date().toISOString().slice(0, 10));
  console.log("News Log output Complete!!\n\n");

  res.send("This is crawling router.\n Crawling is done.");
  res.end();
});

module.exports = router;

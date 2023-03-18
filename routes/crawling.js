const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const log = console.log;

// 디버깅용
const {
  getPublishingFromSuwon,
  getPublishingFromYongin,
  getPublishingFromGoyang,
  getPublishingFromChangwon,
} = require("./publishingModule");

const { insertDatasToPolices } = require("./inserting");

var startPage = 1,
  endPage = 10;

router.get("/", function (req, res, next) {
  res.send("This is crawling router.");
});

router.get("/:id", async function (req, res, next) {
  switch (req.params.id) {
    case "1": // 수원특례시
      publishingData = await getPublishingFromSuwon(startPage, endPage);
      break;

    case "2": // 용인특례시
      publishingData = await getPublishingFromYongin(startPage, endPage);
      break;

    case "3": // 고양특례시
      publishingData = await getPublishingFromGoyang(startPage, endPage);
      break;

    case "4": // 창원특례시
      publishingData = await getPublishingFromChangwon(startPage, endPage);
      break;
  }
  insertDatasToPolices(publishingData);
  console.log(publishingData);
  console.log("\nToday: " + new Date().toISOString().slice(0, 10));
  console.log("Publishing Log output Complete!!\n\n");

  res.send("This is crawling router.\n Crawling is done.");
});

module.exports = router;

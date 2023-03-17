const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const log = console.log;

// 디버깅용
const { getPublishingFromSuwon, getPublishingFromYongin, getPublishingFromGoyang, getPublishingFromChangwon } = require('./publishingModule');

var startPage = 1,
  endPage = 1;

router.get("/", function (req, res, next) {
  res.send("This is crawling router.");
});

router.get("/:id", async function (req, res, next) {
  switch (req.params.id) {
    case "1": // 수원특례시
      console.log(await getPublishingFromSuwon(startPage, endPage));
      break;

    case "2": // 용인특례시
      console.log(await getPublishingFromYongin(startPage, endPage));
      break;

    case "3": // 고양특례시
      console.log(await getPublishingFromGoyang(startPage, endPage));
      break;

    case "4": // 창원특례시
      console.log(await getPublishingFromChangwon(startPage, endPage));
      break;
  }
  res.send("This is crawling router.\n Crawling is done.");
});

module.exports = router

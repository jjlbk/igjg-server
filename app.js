var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
initializeApp({
  credential: applicationDefault(),
});

var indexRouter = require("./routes/index");
var crawlingRouter = require("./routes/crawling");
var newsRouter = require("./routes/news");

dotenv.config();
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/crawling", crawlingRouter);
app.use("/news", newsRouter);

const { initRegions } = require("./models/init");
const {
  ToadScheduler,
  AsyncTask,
  Task,
  SimpleIntervalJob,
} = require("toad-scheduler");
const {
  getPublishingFromSuwon,
  getPublishingFromYongin,
  getPublishingFromGoyang,
  getPublishingFromChangwon,
} = require("./routes/publishingModule");
const {
  gettingHouseholdsDatas,
  gettingPopulationsDatas,
} = require("./routes/gettingPopulationsDatas");
const { insertDatasToPolices } = require("./routes/inserting");

// initRegions();

const scheduler = new ToadScheduler();

const task_update_publishing_suwon = new AsyncTask(
  "update-publishing-suwon",
  async () => {
    const publishingDatas = await getPublishingFromSuwon(1, 2);
    insertDatasToPolices(publishingDatas);
    console.log("suwon");
  },
  (error) => {
    console.error(error);
  }
);
const task_update_publishing_yongin = new AsyncTask(
  "update-publishing-yongin",
  async () => {
    const publishingDatas = await getPublishingFromYongin(1, 2);
    insertDatasToPolices(publishingDatas);
  },
  (error) => {
    console.error(error);
  }
);
const task_update_publishing_goyang = new AsyncTask(
  "update-publishing-goyang",
  async () => {
    const publishingDatas = await getPublishingFromGoyang(1, 2);
    insertDatasToPolices(publishingDatas);
  },
  (error) => {
    console.error(error);
  }
);
const task_update_publishing_changwon = new AsyncTask(
  "update-publishing-changwon",
  async () => {
    const publishingDatas = await getPublishingFromChangwon(1, 2);
    insertDatasToPolices(publishingDatas);
  },
  (error) => {
    console.error(error);
  }
);
const job_update_publishing_suwon = new SimpleIntervalJob(
  { days: 1 },
  task_update_publishing_suwon
);
const job_update_publishing_yongin = new SimpleIntervalJob(
  { days: 1 },
  task_update_publishing_yongin
);
const job_update_publishing_goyang = new SimpleIntervalJob(
  { days: 1 },
  task_update_publishing_goyang
);
const job_update_publishing_changwon = new SimpleIntervalJob(
  { days: 1 },
  task_update_publishing_changwon
);
scheduler.addSimpleIntervalJob(job_update_publishing_suwon);
scheduler.addSimpleIntervalJob(job_update_publishing_yongin);
scheduler.addSimpleIntervalJob(job_update_publishing_goyang);
scheduler.addSimpleIntervalJob(job_update_publishing_changwon);

const task_update_households = new AsyncTask(
  "update_households",
  async () => {
    await gettingHouseholdsDatas();
    console.log("hh");
  },
  (error) => {
    console.error(error);
  }
);
const task_update_populatons = new Task(
  "update_populatons",
  () => {
    gettingPopulationsDatas();
    console.log("pp");
  },
  (error) => {
    console.error(error);
  }
);
const job_update_households = new SimpleIntervalJob(
  { days: 1 },
  task_update_households
);
const job_update_populations = new SimpleIntervalJob(
  { days: 1 },
  task_update_populatons
);
scheduler.addSimpleIntervalJob(job_update_households);
scheduler.addSimpleIntervalJob(job_update_populations);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(req);

  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;

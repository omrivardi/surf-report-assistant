"use strict";

const { dialogflow } = require("actions-on-google");
const isToday = require("date-fns/isToday");

const {
  getForecast,
  getClosestForecastToTime,
  getForecastTextDescription
} = require("./forecastUtils");
const { getAllBuoysData } = require("./bouyData");

const app = dialogflow({
  debug: process.env.NODE_ENV === "development"
});

app.intent("surf-check", async (conv, params) => {
  const { sessionTime } = params;
  let answer = "";
  console.log(sessionTime);
  const mswForecast = await getForecast();

  const sessionForecast = Object.keys(sessionTime).map(timeKey =>
    getClosestForecastToTime(mswForecast, new Date(sessionTime[timeKey]))
  );

  for (let forecast of sessionForecast) {
    answer += getForecastTextDescription(forecast);
  }

  if (sessionTime.date_time && isToday(new Date(sessionTime.date_time))) {
    const buoysData = await getAllBuoysData();
    answer += "\n" + buoysData.map(d => d.text).join("\n");
  }
  conv.ask(answer);
  conv.close("Hope you gonna score!");

  // get the data from api newDate(localTimeStamp*1000)
});

exports.fulfillment = app;

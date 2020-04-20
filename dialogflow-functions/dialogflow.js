"use strict";

const { dialogflow } = require("actions-on-google");

const {
  getForecast,
  getClosestForecastToTime,
  getForecastTextDescription
} = require("./forecastUtils");

const app = dialogflow({
  debug: process.env.NODE_ENV === "development"
});

app.intent("surf-check", async (conv, params) => {
  const { sessionTime } = params;
  console.log(sessionTime);
  const mswForecast = await getForecast();
  console.log(mswForecast)

  const sessionForecast = Object.keys(sessionTime).map(timeKey =>
    getClosestForecastToTime(mswForecast, new Date(sessionTime[timeKey]))
  );

  for (let forecast of sessionForecast) {
    conv.ask(getForecastTextDescription(forecast));
  }

  conv.close("Hope you gonna score!");

  // get the data from api newDate(localTimeStamp*1000)
});

exports.fulfillment = app;

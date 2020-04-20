"use strict";
const axios = require("axios");
const differenceInMinutes = require("date-fns/differenceInMinutes");
const formatRelative = require("date-fns/formatRelative");

const config = {
  apiKey: process.env.MSW_API_KEY,
  spotId: process.env.SPOT_ID,
  fields: [
    "solidRating",
    "fadedRating",
    "localTimestamp",
    "swell.components.combined.height",
    "swell.components.combined.period",
    "wind.compassDirection",
    "wind.speed",
    "wind.gusts"
  ]
};
const KPH_TO_KNOTS = 0.539957;

const toKnts = windInKph => Math.round(windInKph * KPH_TO_KNOTS);

const windDirectionToText = {
  N: "North",
  NNE: "North North East",
  NE: "North East",
  ENE: "East North East",
  E: "East",
  ESE: "East South East",
  SE: "South East",
  SSE: "South South East",
  S: "South",
  SSW: "South South West",
  SW: "South West",
  WSW: "West South West",
  W: "West",
  WNW: "West North West",
  NW: "North West",
  NNW: "North North West"
};

const getForecast = async () => {
  const url = `http://magicseaweed.com/api/${config.apiKey}/forecast/?spot_id=${
    config.spotId
  }${config.fields && `&fields=${config.fields.join(",")}`}&units=eu`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console("Error on msw forecast request", err.toString());
  }
};

const getClosestForecastToTime = (allForecast, time) => {
  let bestDiff = Number.POSITIVE_INFINITY,
    closestForecast = "";
  for (let forecast of allForecast) {
    const diff = Math.abs(
      differenceInMinutes(new Date(forecast.localTimestamp * 1000), time)
    );

    if (diff < bestDiff) {
      bestDiff = diff;
      closestForecast = { ...forecast };
    }
  }

  return closestForecast;
};

const getForecastTextDescription = forecast => {
  const currentTime = new Date();
  const forecastTime = new Date(forecast.localTimestamp * 1000);
  return `${formatRelative(
    forecastTime,
    currentTime
  )} Magic Sea Weed gives a forecast of ${
    forecast.solidRating
  } solid stars and ${forecast.fadedRating} faded stars, swell is ${
    forecast.swell.components.combined.height
  } meters at ${forecast.swell.components.combined.period} seconds. Wind is ${
    windDirectionToText[forecast.wind.compassDirection]
  } at ${toKnts(forecast.wind.speed)} to ${toKnts(forecast.wind.gusts)} knots.\n`;
};

module.exports = {
  getForecast,
  getClosestForecastToTime,
  getForecastTextDescription
};

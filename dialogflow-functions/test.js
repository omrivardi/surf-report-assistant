"use strict";

const {
  getForecast,
  getClosestForecastToTime,
  getForecastTextDescription
} = require("./forecastUtils");

const isToday = require("date-fns/isToday");

const sessionTime = {
  date_time: "2020-04-20T13:59:19+03:00"
};

const { getAllBuoysData } = require("./bouyData");

(async () => {
  const mswForecast = await getForecast();

  const sessionForecast = Object.keys(sessionTime).map(timeKey =>
    getClosestForecastToTime(mswForecast, new Date(sessionTime[timeKey]))
  );

  for (let forecast of sessionForecast) {
    console.log(getForecastTextDescription(forecast));
  }

  console.log("Hope you gonna score!");
  if (sessionTime.date_time && isToday(new Date(sessionTime.date_time))) {
      const data = await getAllBuoysData();
      console.log(data.map(d=>d.text).join('\n'));
  }
})();

// get the data from api newDate(localTimeStamp*1000)

"use strict";

const {
  getForecast,
  getClosestForecastToTime,
  getForecastTextDescription
} = require("./forecastUtils");

const sessionTime = {
  date_time: "2020-04-20T13:59:19+03:00"
};

(async () => {

    const mswForecast = await getForecast();
    
    const sessionForecast = Object.keys(sessionTime).map(timeKey =>
      getClosestForecastToTime(mswForecast, new Date(sessionTime[timeKey]))
    );
    
    for (let forecast of sessionForecast) {
      console.log(getForecastTextDescription(forecast));
    }
    
    console.log("Hope you gonna score!");
})();

// get the data from api newDate(localTimeStamp*1000)

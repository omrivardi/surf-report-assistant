const axios = require("axios");
const cheerio = require("cheerio");
const format = require("date-fns/format");

const buoyUrls = {
  ASHDOD: process.env.ASHDOD_BUOY_URL,
  HAIFA: process.env.HAIFA_BUOY_URL
};

const getBuoyData = async buoyName => {
  if (!Object.keys(buoyUrls).includes(buoyName.toUpperCase())) {
    throw new Error("invalid buoy name");
  }

  let result;
  try {
    const buoyHTML = await axios.get(buoyUrls[buoyName.toUpperCase()]);

    const $ = cheerio.load(buoyHTML.data);
    const day = $("font > font")[1].children[0].data;
    const lastRow = $("table > tbody > tr:last-child")[0];
    const data = cheerio("font", lastRow);

    result = {
      date: new Date(`${day} ${data[0].children[0].data} GMT`),
      hmax: data[1].children[0].data,
      hmin: data[2].children[0].data,
      directory: data[4].children[0].data,
      temperature: data[data.length - 1].children[0].data
    };
  } catch (err) {
    console.log("Error on getting buoy data", err.toString());
  }

  return result;
};

const getBuoyDescription = (buoyName, buoyData) =>
  `${buoyName} buoy reported at ${format(
    buoyData.date,
    "h:m a"
  )} wave height of ${buoyData.hmin} to ${buoyData.hmax} meters.\n`;

const getAllBuoysData = async () => {
  const ashdod = await getBuoyData("ashdod");
  const haifa = await getBuoyData("haifa");

  return [
    { name: "Ashdod", text: getBuoyDescription('Ashdod',ashdod) },
    { name: "Haifa", text: getBuoyDescription('Haifa',haifa) }
  ];
};
module.exports = { getBuoyData, getAllBuoysData, getBuoyDescription };

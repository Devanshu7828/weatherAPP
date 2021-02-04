const requests = require("requests");
const http = require("http");
const express = require('express');
const fs = require("fs");
const { join } = require("path");
const path = require('path')
const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};
const app = express();
const publicDir = path.join(__dirname, '../css/style.css');
app.use(express.static(publicDir));

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Jabalpur&appid=19a2ba02bd48606fd40ca31e8fcf22dd"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrayData = [objData];
        // console.log(arrayData[0].main.temp);
          const realTimeData = arrayData.map((val) => replaceVal(homeFile, val))+join('');
          res.write(realTimeData);
       console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
 
          res.end();
          
        console.log("end");
      });
  }
});

server.listen(3000, "127.0.0.1");

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const _ = require("lodash");

const port = 3000;
const app = express();

app.use(express.static("public"));
app.set(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const apiKey = process.env.API_KEY;
const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?q=Mumbai&appid=${apiKey}&units=metric`;

app
.route("/")

.get((req, res) => {
    axios.get(weatherUrl).then((data) => {
        res.render("home",{Temp:data.data.list[0].main.temp,Desc:data.data.list[0].weather[0].description});
    });
  });

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

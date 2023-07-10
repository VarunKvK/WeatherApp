//Hid the Api key using this
require("dotenv").config();

//Required stuffs 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const _ = require("lodash");

//PortNumber
const port = 3000;
const app = express();

//For Html and css file reader
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//Api Key.He!he! Its hidden
const apiKey = process.env.API_KEY;
const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?q=Mumbai&appid=${apiKey}&units=metric`;


//Routes of Home Page
app
  .route("/")

  .get((req, res) => {
    // HomePageWeather
    axios.get(weatherUrl).then((data) => {
      const temperature = Math.round(data.data.list[0].main.temp);
      const iconcode = data.data.list[0].weather[0].icon;
      const icon = "http://openweathermap.org/img/wn/" + iconcode + ".png";
      res.render("home", {
        Temp: temperature,
        Desc: data.data.list[0].weather[0].description,
        Icon: icon,
      });
    });
  })

  .post((req, res) => {
    //Getting Id From the Input
    const cityName = req.body.city;
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    axios.get(weatherUrl).then((data) => {
      const id = data.data.city.id;
      res.redirect("/" + id);
    });
  });

//Route for CustomPlaces Weather
//Custom Place Weather created using the id in the params 
app.route("/:City").get((req, res) => {
  const cityId = req.params.City;
  const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric`;
  axios.get(weatherUrl).then((data) => {
    const cityName = data.data.city.name;
    const countryName = data.data.city.country;
    
    const weatherIcon = data.data.list[0].weather[0].icon;
    const icon = "http://openweathermap.org/img/wn/" + weatherIcon + ".png";
    const apiShort=data.data.list[0].main
    const cityTemp = Math.round(apiShort.temp);
    const cityPressure = Math.round(apiShort.pressure);
    const citySea= Math.round(apiShort.sea_level);
    const cityHumid= Math.round(apiShort.humidity);
    const cityFeel= Math.round(apiShort.feels_like);
    res.render("customPlace", {
      CityName: cityName,
      CountryName: countryName,
      CityTemp: cityTemp,
      CityPressure: cityPressure,
      CitySea: citySea,
      CityHumid: cityHumid,
      CityFeel: cityFeel,
      Icon: icon,
      Data:data.data.list
    });
  });
});


//Port
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

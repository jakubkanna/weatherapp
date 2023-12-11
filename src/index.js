// domModule.js
import { BasicToggler, DataToggler } from "./index_modules/dom/togglers.js";
import { HomeGen } from "./index_modules/dom/home-generator.js";

export const domModule = {
  // Handle form events
  handleForm: function () {
    const form = document.getElementById("cityName");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = document.getElementById("_location");
      const cityName = input.value.toString();
      controller.handleForm(cityName);
    });
  },
  // Handle menu buttons
  handleMenuButtons: function () {
    new BasicToggler("tempToggler", '[id*="_c"]', '[id*="_f"]');
    new DataToggler("detailToggler", "#root *");
  },
  // Get condition elements
  get conditionEls() {
    return document.querySelectorAll("#condition");
  },
  // Append generated DOM to the main element
  appendDOM: function (generatedDOM) {
    const main = document.body.querySelector("main");
    main.innerHTML = ""; // Clear existing content
    main.appendChild(generatedDOM);
  },
  createGIFs: function () {
    this.conditionEls.forEach(async function (element) {
      const text = element.querySelector("#text").innerHTML.toString();
      const src = await controller.handleGif(text);
      const icon = element.querySelector("#icon");
      const placeholder = element.querySelector("#placeholder");

      // Create an image element for the GIF
      function createIcon(src) {
        const img = document.createElement("img");
        img.src = src;
        return img;
      }

      const img = createIcon(src);
      placeholder.remove(); // Remove "Loading..."
      icon.append(img);
    });
  },
  // Create generated DOM
  createDOM: function (data) {
    const dom = new HomeGen(data).generateDOM();
    this.appendDOM(dom);
  },
};

// dataModule.js
import DataFetcher from "./index_modules/data/fetcher.js";
import modifyForecastData from "./index_modules/data/modifier.js";

export const dataModule = {
  fetcher: new DataFetcher(),
  // Get forecast data
  getForecast: async function (cityName) {
    controller.displayLoading();

    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=0c74e0d9f7ae4709b0f121149230512&q=${cityName}&days=7`;
      const weatherData = await dataModule.fetcher.getData(url);
      const newWeatherData = modifyForecastData(weatherData);
      localStorage.setItem("newWeatherData", JSON.stringify(newWeatherData));
      return newWeatherData;
    } catch (error) {
      console.error(error);
    }
  },
  // Get Giphy data
  getGif: async function (query) {
    try {
      const url = `https://api.giphy.com/v1/gifs/translate?api_key=t9evMNjWyyMw8FgM8GfNFAG8TkuYUklE&s=${query} weather'`;
      const giphyData = await dataModule.fetcher.getData(url);
      return giphyData.data.images.fixed_height.url;
    } catch (error) {
      console.error(error);
    }
  },
};

// controller.js
export const controller = {
  // Initialize the controller
  init: function () {
    domModule.handleForm();
    const storedForecastData = localStorage.getItem("newWeatherData");
    if (storedForecastData) {
      const parsedData = JSON.parse(storedForecastData);
      // Display forecast and GIFs if data is available in localStorage
      controller.displayForecast(parsedData);
    }
  },
  // Display forecast data
  displayForecast: function (data) {
    domModule.createDOM(data);
    domModule.handleMenuButtons();
    domModule.createGIFs();
  },

  // Handle GIF fetching
  handleGif: async function (text) {
    const gif = await dataModule.getGif(`${text} weather`);
    return gif;
  },
  // Handle form submission
  handleForm: async function (cityName) {
    const weather = await dataModule.getForecast(cityName);
    controller.displayForecast(weather);
  },
  // Display loading state
  displayLoading: function () {
    console.log("Loading...");
  },
};

// main.js
import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  controller.init();
});

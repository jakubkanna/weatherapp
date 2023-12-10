import "./style.css";
import HomeGen from "./index_modules/dom/home-generator";
import { DataToggler, BasicToggler } from "./index_modules/dom/togglers";
import DataFetcher from "./index_modules/data/fetcher.js";
import modifyForecastData from "./index_modules/data/modifier.js";

const data = {
  fetcher: new DataFetcher(),
  async getForecast(cityName) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=0c74e0d9f7ae4709b0f121149230512&q=${cityName}&days=7`;

    // Display loading state
    controller.displayLoading();

    try {
      const weatherData = await this.fetcher.getData(url);
      const newWeatherData = await modifyForecastData(
        weatherData,
        this.fetcher
      );

      // Display actual data
      controller.displayForecast(newWeatherData);

      // Save data to localStorage
      localStorage.setItem("newWeatherData", JSON.stringify(newWeatherData));
    } catch (error) {
      console.error(error);
    }
  },
};

const dom = {
  //handle events
  handleForm() {
    const form = document.getElementById("cityName");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("_location");
      const cityName = input.value.toString();

      // pass to controller
      controller.formHandler(cityName);
    });
  },
  handleMenuButtons() {
    // Create button to toggle visibility of [id^="_c"] and [id*="_f"]
    new BasicToggler("tempToggler", '[id*="_c"]', '[id*="_f"]');
    new DataToggler("detailToggler", "#root *");
  },
};

const controller = {
  init() {
    //handle
    dom.handleForm();
    // Check if there's data in localStorage when the page loads
    const storedForecastData = localStorage.getItem("newWeatherData");
    if (storedForecastData) {
      const parsedData = JSON.parse(storedForecastData);
      this.displayForecast(parsedData);
    }
  },

  displayForecast(data) {
    const generatedDOM = new HomeGen(data).generateDOM();

    const main = document.body.querySelector("main");
    main.innerHTML = ""; // Clear existing content
    main.appendChild(generatedDOM);

    dom.handleMenuButtons(); //do it after new dom is loaded
  },

  formHandler(cityName) {
    data.getForecast(cityName);
  },
  displayLoading() {
    // Update your UI to display a loading state, e.g., show a spinner or a message
    console.log("Loading...");
  },
};

// When dom is ready init contrl.
document.addEventListener("DOMContentLoaded", () => {
  controller.init();
});

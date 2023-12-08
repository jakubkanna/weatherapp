import "./style.css";
import HomeGen from "./index_modules/dom/home-generator";
import { DataToggler, BasicToggler } from "./index_modules/dom/togglers";
import modifyForecastData from "./index_modules/data/modifier.js";

class DataFetcher {
  async getData(url) {
    try {
      const response = await fetch(`${url}`, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Caught error during forecast fetch:", error);
    }
  }
  storeData(url, data) {
    const matchResult = url.match(/\/([^\/?]+)\?/);
    const key = matchResult ? matchResult[1] : "defaultKey";
    localStorage.setItem(`${key}`, JSON.stringify(data));
  }
}
class WeatherFetcher extends DataFetcher {
  modifyData(data) {
    return modifyForecastData(data);
  }
  handleData(data) {
    controller.displayForecast(data);
  }
}
const data = {
  weatherFetcher: new WeatherFetcher(),
  getForecast(cityName) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=0c74e0d9f7ae4709b0f121149230512&q=${cityName}&days=7`;
    const data = this.weatherFetcher.getData(url);
    console.log(data);
    this.weatherFetcher.modifyData(data);
    this.weatherFetcher.handleData(data);
  },
  getGiphy() {
    //
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
    const storedForecastData = localStorage.getItem("weatherForecast");
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
};

// When dom is ready init contrl.
document.addEventListener("DOMContentLoaded", () => {
  controller.init();
});

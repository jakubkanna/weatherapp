import "./style.css";
import { HomeGen, GifGen } from "./index_modules/dom/home-generator";
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
      const newWeatherData = modifyForecastData(weatherData);

      // Save data to localStorage
      localStorage.setItem("newWeatherData", JSON.stringify(newWeatherData));

      return newWeatherData;
    } catch (error) {
      console.error(error);
    }
  },
  async getGif(query) {
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=t9evMNjWyyMw8FgM8GfNFAG8TkuYUklE&s=${query} weather'`;
    try {
      const giphyData = await this.fetcher.getData(url);
      const giphyURL = giphyData.data.images.fixed_height.url;

      return giphyURL;
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
  get conditionEls() {
    return document.querySelectorAll("#condition");
  },
  appendDOM(generatedDOM) {
    const main = document.body.querySelector("main");
    main.innerHTML = ""; // Clear existing content
    main.appendChild(generatedDOM);
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
      this.displayGifs();
    }
  },

  displayForecast(data) {
    const generatedDOM = new HomeGen(data).generateDOM();

    dom.appendDOM(generatedDOM);

    dom.handleMenuButtons(); //do it after new dom is loaded
  },
  displayGifs() {
    dom.conditionEls.forEach(async (element) => {
      const text = element.querySelector("#text").innerHTML.toString();
      const icon = element.querySelector("#icon");
      const placeholder = element.querySelector("#placeholder");

      const gif = await data.getGif(`${text} weather`);

      function createIcon(gif) {
        const img = document.createElement("img");
        img.src = gif;
        return img;
      }

      const img = createIcon(gif);
      placeholder.remove();
      icon.append(img);
    });
  },
  async formHandler(cityName) {
    const weather = await data.getForecast(cityName);
    console.log(weather);

    // Display skeleton
    this.displayForecast(weather);

    // Insert images to skeleton
    this.displayGifs();
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

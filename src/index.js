import "./style.css";
import HomeGen from "./index_modules/dom/home-generator";

const data = {
  async getForecast(cityName) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=0c74e0d9f7ae4709b0f121149230512&q=${cityName}&days=7`,
        { mode: "cors" }
      );
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const data = await response.json();

      // Save data to localStorage
      localStorage.setItem("weatherForecast", JSON.stringify(data));

      // pass to controller
      controller.displayForecast(data);
    } catch (error) {
      console.error("Caught error during forecast fetch:", error);
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

class BasicToggler {
  constructor(buttonID, visibleSelector, hiddenSelector) {
    this.button = document.getElementById(buttonID);
    this.visibleElements = document.querySelectorAll(visibleSelector);
    this.hiddenElements = document.querySelectorAll(hiddenSelector);

    this.button.addEventListener("click", () => this.toggle());

    // Hide elements to be hidden by default
    this.hiddenElements.forEach((element) => {
      element.classList.add("hidden");
    });
  }

  toggle() {
    // Check if the first visible element is currently visible
    const isVisible = !this.visibleElements[0].classList.contains("hidden");

    // Toggle visibility for elements to be shown based on the current state
    this.visibleElements.forEach((element) =>
      element.classList.toggle("hidden", isVisible)
    );

    // Toggle visibility for elements to be hidden based on the opposite state
    this.hiddenElements.forEach((element) =>
      element.classList.toggle("hidden", !isVisible)
    );
  }
}
/**
"#location h2",
"#name",
"#country",
"#localtime",
"#current h2",
'[id*="temp"]',
"#condition",
"#forecast h2",
"#forecast h4",
"#date",
"#sunrise",
"#moonset",
"#moon_phase",
 */

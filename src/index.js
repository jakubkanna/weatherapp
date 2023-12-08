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

      // Modify data - not finished
      const newData = modifyForecastData(data);

      // Save modified data to localStorage
      localStorage.setItem("weatherForecast", JSON.stringify(newData));

      // Pass modified data to controller
      controller.displayForecast(newData);
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

class BasicToggler {
  constructor(buttonID, visibleSelector, hiddenSelector) {
    this.button = document.getElementById(buttonID);
    this.visibleElements = document.querySelectorAll(visibleSelector);
    this.hiddenSelector = hiddenSelector; // Save the original hidden selector

    this.toggle(); //simplify by default

    this.button.addEventListener("click", () => this.toggle());

    // Use a more efficient method to initially hide elements
    document.querySelectorAll(hiddenSelector).forEach((element) => {
      element.classList.add("hidden");
    });
  }

  toggle() {
    const isVisible = !this.visibleElements[0].classList.contains("hidden");

    this.visibleElements.forEach((element) =>
      element.classList.toggle("hidden", isVisible)
    );

    // Use the original hidden selector to toggle only non-immune elements
    document.querySelectorAll(this.hiddenSelector).forEach((element) => {
      element.classList.toggle("hidden", !isVisible);
    });
  }
}

class DataToggler {
  static exceptions = [
    "#location, #location > h2",
    "#name, #name >*",
    "#country, #country > *",
    "#localtime, #localtime > *",
    "#current, #current > h2",
    '[id*="temp"]:not([id*="temp_f"]), [id*="temp"] > *',
    "#condition, #condition :not(h4,h7,#code)",
    "#forecast, #forecast h2, #forecast h4, #forecast > *, #forecastday > *",
    "#date, #date *",
    "#sunrise, #sunrise *",
    "#day",
    "#astro, #moonset, #moonset *",
    "#moon_phase, #moon_phase *",
    ".immune",
  ];

  constructor(buttonID, rootSelector) {
    this.button = document.getElementById(buttonID);
    this.rootElements = document.querySelectorAll(rootSelector);
    this.addImmunity();
    this.toggle(); //simplify by default
    this.button.addEventListener("click", () => this.toggle());
  }

  addImmunity() {
    const combinedSelectors = DataToggler.exceptions.join(", ");
    const exceptionsEl = document.querySelectorAll(combinedSelectors);

    exceptionsEl.forEach((element) => {
      element.classList.add("immune");
    });
  }

  toggle() {
    this.rootElements.forEach((element) => {
      const isImmune = element.classList.contains("immune");

      if (!isImmune) {
        element.classList.toggle("hidden");
      }
    });
  }
}

//not finished
function modifyForecastData(data) {
  let newData = data;
  const days = newData.forecast.forecastday;

  days.forEach((element) => {
    // Get epoch
    let epoch = element.date_epoch;

    // Create a Date object from epoch
    const date = new Date(epoch * 1000); // Multiply by 1000 to convert seconds to milliseconds

    // Get day name
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    // Log or do something with the day name
    epoch = dayName;
  });

  return newData;
}

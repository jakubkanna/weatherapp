import "./style.css";

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

      //filter data for needed only
      //

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

  //create new dom elements
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
    const domGenerator = new DOMGenerator(data);
    const generatedDOM = domGenerator.generateDOM();
    const main = document.body.querySelector("main");
    main.appendChild(generatedDOM);
  },
  formHandler(cityName) {
    data.getForecast(cityName);
  },
};

// When dom is ready init contrl.
document.addEventListener("DOMContentLoaded", () => {
  controller.init();
});

class DOMGenerator {
  constructor(data) {
    this.data = data;
  }

  insertHeaders(parent, key, level) {
    const header = document.createElement(`h${level}`);
    header.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    parent.appendChild(header);
  }

  createElement(parent, key, value, level = 2) {
    const element = document.createElement("div");
    element.id = key;

    this.insertHeaders(element, key, level);

    if (typeof value === "object") {
      for (const nestedKey in value) {
        this.createElement(element, nestedKey, value[nestedKey], level + 1);
      }
    } else {
      if (this.isImageURL(value)) {
        const img = document.createElement("img");
        img.src = value;
        element.appendChild(img);
      } else {
        const span = document.createElement("span");
        span.textContent = value;
        element.appendChild(span);
      }
    }

    parent.appendChild(element);
  }

  isImageURL(url) {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);
  }

  generateDOM() {
    const rootElement = document.createElement("div");
    rootElement.id = "root";

    for (const key in this.data) {
      this.createElement(rootElement, key, this.data[key]);
    }

    return rootElement;
  }
}

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
    main.innerHTML = ""; // Clear existing content
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

  // Creates and returns a div element with a given key as its id
  createDivElement(key) {
    const element = document.createElement("div");
    element.id = key;
    return element;
  }

  // Inserts a header element into the parent with the specified key and level
  insertHeaders(parent, key, level) {
    const header = document.createElement(`h${level}`);
    header.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    parent.appendChild(header);
  }

  // Creates nested elements for an object and appends them to the parent
  createNestedElements(parent, nestedData, level) {
    for (const nestedKey in nestedData) {
      this.createElement(parent, nestedKey, nestedData[nestedKey], level);
    }
  }

  // Creates a leaf element (either an image or a span) and appends it to the parent
  createLeafElement(parent, value) {
    if (this.isImageURL(value)) {
      this.createImageElement(parent, value);
    } else {
      this.createSpanElement(parent, value);
    }
  }

  // Creates an image element with the specified source and appends it to the parent
  createImageElement(parent, src) {
    const img = document.createElement("img");
    img.src = src;
    parent.appendChild(img);
  }

  // Creates a span element with the specified text content and appends it to the parent
  createSpanElement(parent, text) {
    const span = document.createElement("span");
    span.textContent = text;
    parent.appendChild(span);
  }

  // Checks if the given URL is an image URL based on its extension
  isImageURL(url) {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);
  }

  // Generates the entire DOM structure based on the provided data
  generateDOM() {
    // Create the root element for the DOM structure
    const rootElement = this.createDivElement("root");

    // Iterate through the provided data and create elements accordingly
    for (const key in this.data) {
      this.createElement(rootElement, key, this.data[key]);
    }

    return rootElement;
  }

  // Main function to create an element and its children recursively
  createElement(parent, key, value, level = 2) {
    // Create a div element for the current key
    const element = this.createDivElement(key);

    // Insert headers based on the key and level
    this.insertHeaders(element, key, level);

    // Check if the value is an object (nested structure) or not
    if (typeof value === "object") {
      // If it's an object, create nested elements
      this.createNestedElements(element, value, level + 1);
    } else {
      // If it's not an object, create a leaf element
      this.createLeafElement(element, value);
    }

    // Append the created element to the parent
    parent.appendChild(element);
  }
}


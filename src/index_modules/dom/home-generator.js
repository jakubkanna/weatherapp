export default class HomeGen {
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
  insertHeader(parent, key, level) {
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
    const rootElement = this.createDivElement("root");
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
    this.insertHeader(element, key, level);

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

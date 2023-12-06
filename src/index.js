import "./style.css";

// Controller to coordinate data and UI
const weatherController = {
  //on form submit
  handleFormSubmit: async function (cityName) {
    try {
      const data = await getWeather(cityName); //after data is ready
      this.handleData(data);
    } catch (error) {
      this.handleError(error);
    }
  },
  handleData: function (data) {
    // Display the data
    displayData(data);
  },
  handleError: function (error) {
    console.error("Error in controller:", error);
    // Handle the error in the UI if needed
  },
};

// Get data
async function getWeather(cityName) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=0c74e0d9f7ae4709b0f121149230512&q=${cityName}&days=7`,
      { mode: "cors" }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Caught error during fetch:", error);
    throw error;
  }
}

// Handle dom click
function handleForm(controller) {
  // Form
  const form = document.getElementById("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("_location");
    const cityName = input.value.toString();

    // Call the controller to handle form submission (data)
    await controller.handleFormSubmit(cityName);
  });
}

// Display data
function displayData(data) {
  console.log(data);
}

// When doc is ready, initialize the form handling with the controller
document.addEventListener("DOMContentLoaded", () => {
  handleForm(weatherController);
});

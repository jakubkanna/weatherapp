const data = {
  //fetch data
  async getWeather(cityName) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=0c74e0d9f7ae4709b0f121149230512&q=${cityName}&days=7`,
        { mode: "cors" }
      );
      const data = await response.json();
      controller.display(data);
    } catch (error) {
      console.error("Caught error during weather fetch:", error);
      throw error;
    }
  },

  async getForecast(cityName) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=0c74e0d9f7ae4709b0f121149230512&q=${cityName}&days=7`,
        { mode: "cors" }
      );
      const data = await response.json();
      return data; //to controller
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
      console.log("hym2");

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
    dom.handleForm();
  },
  display(data) {
    console.log(data);
  },
  formHandler(cityName) {
    data.getWeather(cityName);
  },
};
// When dom is ready init contrl.
document.addEventListener("DOMContentLoaded", () => {
  controller.init();
});

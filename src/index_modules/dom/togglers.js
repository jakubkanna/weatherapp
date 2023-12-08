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
    "#day_name, #day_name *",
    "#location, #location > h2",
    "#name, #name >*",
    "#country, #country > *",
    "#localtime, #localtime > *",
    "#current, #current > h2",
    '[id*="temp"]:not([id*="temp_f"]), [id*="temp"] > *',
    "#condition, #condition :not(h4,h7,#code)",
    "#forecast, #forecast h2,  #forecast > *",
    "#forecastday > *:not(h3)",
    "#date, #date *:not(h5)",
    "#sunrise, #sunrise *",
    "#day",
    "#astro, #moonset, #moonset *",
    "#moon_phase, #moon_phase *",
    ".immune",
    "#date_epoch, #date_epoch *",
    '[id*="feelslike"]:not([id*="feelslike_f"]), [id*="feelslike"] > *',
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

export { DataToggler, BasicToggler };

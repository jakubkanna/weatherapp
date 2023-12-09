export default function modifyForecastData(data, fetcher) {
  let newData = { ...data }; // Create a shallow copy of the data to avoid modifying the original
  const days = newData.forecast.forecastday;

  const conditions = findAllConditions(newData);

  modifyEpoch(days);
  modifyImage(conditions, fetcher);

  return newData;
}

function modifyEpoch(days) {
  days.forEach((day) => {
    // Get epoch
    let epoch = day.date_epoch;

    // Create a Date object from epoch
    const date = new Date(epoch * 1000); // Multiply by 1000 to convert seconds to milliseconds

    // Get day name
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    // replace
    day.date_epoch = dayName;
  });
}

function modifyImage(conditions, fetcher) {
  //for each condition in condiitons
  conditions.forEach(async (condition) => {
    //fetch giph using it's text and replace link inside icon: with giphy link
    const query = condition.text;
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=t9evMNjWyyMw8FgM8GfNFAG8TkuYUklE&s=${query} weather'`;

    const giphyData = await fetcher.getData(url);
    const giphyURL = giphyData.data.url;

    condition.icon = giphyURL;
  });
}

function findAllConditions(obj) {
  let conditions = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === "condition" && obj[key] instanceof Object) {
        conditions.push(obj[key]);
      } else if (obj[key] instanceof Object) {
        conditions = conditions.concat(findAllConditions(obj[key])); // If the property value is another object, it recursively calls itself to explore nested properties.
      }
    }
  }

  return conditions;
}

export default function modifyForecastData(data) {
  let newData = { ...data }; // Create a shallow copy of the data to avoid modifying the original

  const days = newData.forecast.forecastday;

  days.forEach((day) => {
    // Get epoch
    let epoch = day.date_epoch;

    // Create a Date object from epoch
    const date = new Date(epoch * 1000); // Multiply by 1000 to convert seconds to milliseconds

    // Get day name
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    // Create new property and delete the old one
    day.date_epoch = dayName;
  });

  console.log(newData);
  return newData;
}

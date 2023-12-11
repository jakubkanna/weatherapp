export default function modifyForecastData(data) {
  let newData = { ...data }; // Create a shallow copy of the data to avoid modifying the original
  const days = newData.forecast.forecastday;

  modifyEpoch(days);

  const conditions = findAllObjects(newData);
  modifyConditions(conditions);

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
function modifyConditions(conditions) {
  for (const condition of conditions) {
    condition.icon = { placeholder: "Loading..." };
  }
}

function findAllObjects(obj) {
  let conditions = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === "condition" && obj[key] instanceof Object) {
        conditions.push(obj[key]);
      } else if (obj[key] instanceof Object) {
        conditions = conditions.concat(findAllObjects(obj[key])); // If the property value is another object, it recursively calls itself to explore nested properties.
      }
    }
  }

  return conditions;
}

export default class DataFetcher {
  async getData(url) {
    try {
      const response = await fetch(`${url}`, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Caught error during forecast fetch:", error);
    }
  }
  storeData(key, data) {
    localStorage.setItem(`${key}`, JSON.stringify(data));
  }
}

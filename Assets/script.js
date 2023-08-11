const APIKey = "29a5a52a0cc992fa11085a6d5700c81c";
const searchHistory = JSON.parse(localStorage.getItem("History")) || [];

const appendButtonToHistory = item => {
  const button = document.createElement("button");
  button.textContent = item;
  button.addEventListener("click", () => {
    document.getElementById("input-box").value = item;
    fetchWeatherForecast(item);
  });
  document.getElementById("search-history").appendChild(button);
};

const fetchWeatherForecast = async () => {
  const city = document.getElementById("input-box").value.trim();
  if (!city) return;
  if (searchHistory.includes(city)) return;

  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;

  searchHistory.push(city);
  storeHistory();

  try {
    const response = await fetch(queryURL);
    const data = await response.json();
    const forecastList = data.list;
    const groupedForecastData = {};
    forecastList.forEach(forecast => {
      const forecastDate = new Date(forecast.dt * 1000);
      const dateKey = forecastDate.toDateString();
      if (!groupedForecastData[dateKey]) {
        groupedForecastData[dateKey] = [];
      }
      forecast.humidity = forecast.main.humidity;
      groupedForecastData[dateKey].push(forecast);
    });
    document.getElementById("forecast-info").innerHTML = "";
    for (const dateKey in groupedForecastData) {
      const dayBlock = document.createElement("div");
      dayBlock.className = "forecast__item";
      dayBlock.innerHTML = `<div class='forecast-item__heading'>${dateKey}</div>`;
      const temperature = groupedForecastData[dateKey][0].main.temp;
      const description = groupedForecastData[dateKey][0].weather[0].description;
      const weatherIcon = `http://openweathermap.org/img/w/${groupedForecastData[dateKey][0].weather[0].icon}.png`;
      const humidity = groupedForecastData[dateKey][0].humidity;
      const forecastData = document.createElement("div");
      forecastData.className = "forecast-item__info";
      forecastData.innerHTML = `<img src='${weatherIcon}' alt='Weather Icon'><span class='degrees'>${Math.round(temperature)} <i class='wi wi-degrees'></i></span><p>Description: ${description}</p><p>Humidity: ${humidity}%</p>`;
      dayBlock.appendChild(forecastData);
      document.getElementById("forecast-info").appendChild(dayBlock);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const storeHistory = () => localStorage.setItem("History", JSON.stringify(searchHistory));

document.getElementById("search-history").innerHTML = "";
searchHistory.forEach(appendButtonToHistory);
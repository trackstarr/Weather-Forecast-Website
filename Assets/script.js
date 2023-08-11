var APIKey = "29a5a52a0cc992fa11085a6d5700c81c";
var city;
var searchHistory = JSON.parse(localStorage.getItem("History"))
if (!searchHistory) {
  searchHistory = []
};

function appendButtonToHistory(item) {
  var button = document.createElement("button");
  button.textContent = item;
  button.addEventListener("click", function () {
    document.getElementById("input-box").value=item;
    fetchWeatherForecast(item);
  });

  document.getElementById("search-history").appendChild(button);
}


function fetchWeatherForecast(city) {
  city = document.getElementById("input-box").value;
  // Check if the search input is empty
  if (city.trim() === "") {
    return; // Exit the function if the search input is empty
  }
  // Check if the search input is already in the search history
  if (searchHistory.includes(city)) {
    return; // Exit the function if the search input is already in the search history
  }

  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey +
    "&units=imperial";


  searchHistory.push(city);
  console.log(searchHistory);
  storeHistory();

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Process the forecast data and display it on the page
      console.log(data);
      searchHistory.push(city);
      console.log(searchHistory);



      // Display forecast for the next 5 days
      var forecastList = data.list;
      var forecastInfo = "";
      document.getElementById("forecast-info").innerHTML = "";
      // Group forecast data by date
      var groupedForecastData = {};
      for (var i = 0; i < forecastList.length; i++) {
        var forecastDate = new Date(forecastList[i].dt * 1000);
        var dateKey = forecastDate.toDateString();
        if (!groupedForecastData[dateKey]) {
          groupedForecastData[dateKey] = [];
        }
        //Added humidity to the forecast data
        forecastList[i].humidity = forecastList[i].main.humidity;
        groupedForecastData[dateKey].push(forecastList[i]);

      }
      console.log(groupedForecastData);

      // Create a new div element for each day of the forecast
      for (var dateKey in groupedForecastData) {
        var dayBlock = document.createElement("div");
        dayBlock.className = "forecast__item";
        dayBlock.innerHTML = "<div class='forecast-item__heading'>" + dateKey + "</div>";

        // Append forecast data to the day block
        //for (var i = 0; i < groupedForecastData[dateKey].length; i++) 
        var temperature = groupedForecastData[dateKey][0].main.temp;
        var description = groupedForecastData[dateKey][0].weather[0].description;
        var weatherIcon = "http://openweathermap.org/img/w/" + groupedForecastData[dateKey][0].weather[0].icon + ".png";
        var humidity = groupedForecastData[dateKey][0].humidity;

        var forecastData = document.createElement("div");
        forecastData.className = "forecast-item__info";
        forecastData.innerHTML = "<img src='" + weatherIcon + "' alt='Weather Icon'>" +
          "<span class='degrees'>" + Math.round(temperature) + " <i class='wi wi-degrees'></i></span>" +
          "<p>Description: " + description + "</p>" +
          "<p>Humidity: " + humidity + "%</p>";

        dayBlock.appendChild(forecastData);

        // Append the new div element to the forecast-info div
        document.getElementById("forecast-info").appendChild(dayBlock);
      }
    })
    .catch(function (error) {
      console.log("Error:", error);
    });



}

function storeHistory() {
  localStorage.setItem("History", JSON.stringify(searchHistory))
};


document.getElementById("search-history").innerHTML = "";
searchHistory.forEach(function (item) {
  appendButtonToHistory(item);
});
const searchInput = document.getElementById("search-box");
const searchBtn = document.getElementById("search-btn");
const tempEmoji = document.getElementById("temp-emoji");
const tempDisplay = document.getElementById("temp-value");
const tempLocation = document.getElementById("temp-location");
const tempHumidity = document.getElementById("humidity-value");
const humidityLabel = document.getElementById("humidity-label");
const tempWindSpeed = document.getElementById("windspeed-value");
const windSpeedLabel = document.getElementById("windspeed-label");
const errorMsg = document.getElementById("error-message");

const spinner = document.getElementById("loading-spinner");
const apiKey = "563a3c4a12a15096ba354a730364b632";

function updateBackgroundColor() {
    const currentHour = new Date().getHours()
    const body = document.body;
    
    body.classList.remove('morning', 'afternoon', 'evening', 'night')
  
    if (currentHour >= 6 && currentHour < 12) {
      body.classList.add('morning');
    } else if (currentHour >= 12 && currentHour < 18) {
      body.classList.add('afternoon');
    } else if (currentHour >= 18 && currentHour < 24) {
      body.classList.add('evening');
    } else {
      body.classList.add('night');
    }
  }

  window.addEventListener('load', updateBackgroundColor);



function resetUI() {
    tempEmoji.textContent = "☁️"
    tempDisplay.textContent = '--°F'
    tempLocation.textContent = '--'
    tempHumidity.textContent = '--%'
    tempWindSpeed.textContent = '--km/h'
    humidityLabel.textContent = "Humidity"
    windSpeedLabel.textContent = "Wind Speed"
}

function clearContent(){
    tempEmoji.textContent = ""
    tempDisplay.textContent = ""
    tempLocation.textContent = ""
    tempHumidity.textContent = ""
    tempWindSpeed.textContent = ""
    humidityLabel.textContent = ""
    windSpeedLabel.textContent = ""
    
}

searchBtn.addEventListener("click", (event) => {
    const searchInputValue = searchInput.value.trim();

    if(searchInputValue == ""){
            errorMsg.style.display = "block";
            errorMsg.textContent = "You must enter a city name.";
            resetUI()
    } else {
         clearContent()
         spinner.style.display = "block"
         fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInputValue}&appid=${apiKey}&units=imperial`)
         .then(response => response.json())
         .then(data => {
            if(data.cod === 200){
                searchInput.disabled = true;
                searchBtn.disabled = true;
                spinner.style.display = "block";

                setTimeout(() => {
                spinner.style.display = "none";
                searchInput.value = ""
                searchInput.disabled = false;
                searchBtn.disabled = false;
                let temperature = data.main.temp;
                let cityName = data.name;
                let humidity = data.main.humidity;
                let windspeed = data.wind.speed;
                let weatherId = data.weather[0].id;

                errorMsg.style.display = "none"
                tempDisplay.textContent = `${temperature.toFixed(1)}°F`;
                tempLocation.textContent = cityName;
                tempHumidity.textContent = `${humidity}%`
                tempWindSpeed.textContent = `♒︎ ${windspeed.toFixed(1)} km/h`;
                humidityLabel.textContent = "Humidity"
                windSpeedLabel.textContent = "Wind Speed"

                switch (true) {
                    case (weatherId >= 200 && weatherId < 300):
                      tempEmoji.textContent = "⛈️";
                      break;
                  
                    case (weatherId >= 300 && weatherId < 400):
                      tempEmoji.textContent = "🌦️";
                      break;
                  
                    case (weatherId >= 500 && weatherId < 600):
                      tempEmoji.textContent = "🌧️";
                      break;
                  
                    case (weatherId >= 600 && weatherId < 700):
                      tempEmoji.textContent = "❄️";
                      break;
                  
                    case (weatherId >= 700 && weatherId < 800): 
                      tempEmoji.textContent = "🌫️";
                      break;
                  
                    case (weatherId === 800):
                      tempEmoji.textContent = "☀️";
                      break;
                  
                    case (weatherId > 800 && weatherId < 900):
                      tempEmoji.textContent = "☁️";
                      break;
                  
                    default:
                      tempEmoji.textContent = "☁️";
                      break;
                  }
                  }, 2500);
                         
            } else {
                    setTimeout(() => {
                        spinner.style.display = "none";
                        errorMsg.style.display = "block";
                        errorMsg.textContent = "City not found. Please try again.";
                        resetUI()
                    }, 2500);
                }
                 })
            .catch(error => {
                spinner.style.display = "none";
                errorMsg.style.display = "block";
                errorMsg.textContent = "something went wrong, try again"})
    }

})

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});




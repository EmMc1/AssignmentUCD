document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'e634d5e076ad0902af407be6dcb6639d'; // API key -
    const weatherContainer = document.getElementById("weather");
    const cityDisplay = document.getElementById("city"); 
    const errorDisplay = document.getElementById('error');
    const cityInput = document.getElementById('cityInput'); // Get the input field

    const units = 'metric'; // Can be 'imperial' or 'metric'
    const temperatureSymbol = units === 'imperial' ? "°F" : "°C"; // Use === for comparison

    // Fetch weather when button is clicked
    document.querySelector('button').addEventListener('click', fetchWeather);

    async function fetchWeather() {
        try {
            weatherContainer.innerHTML = ''; // Clear previous data
            errorDisplay.innerHTML = '';      // Clear previous errors
            cityDisplay.innerHTML = '';      // Clear previous city name

            const city = cityInput.value; // Get city from input field
            if (!city) {
                errorDisplay.textContent = "Please enter a city name.";
                return;
            }

            const cnt = 10; // Number of 3-hour forecast chunks to retrieve - can adjust
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}&cnt=${cnt}`; //  API URL

            const response = await fetch(apiUrl);

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || response.statusText;
                throw new Error(errorMessage); // Throw error to be caught in catch block
            }

            const data = await response.json();

            cityDisplay.textContent = `Hourly Weather for ${data.city.name}, ${data.city.country}`; // Include country

            data.list.forEach(hourlyWeatherData => {
                const hourlyWeatherDataDiv = createWeatherDescription(hourlyWeatherData);
                weatherContainer.appendChild(hourlyWeatherDataDiv);
            });

        } catch (error) {
            console.error("Error fetching weather:", error); // Log the full error object
            errorDisplay.textContent = "Error: " + error.message; // Display error message to the user
        } finally {
            cityInput.value = ''; // Clear the input field after the search
        }
    }

    function convertToLocalTime(dt) {
        const date = new Date(dt * 1000);
        const options = { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true // Use 12-hour format
        };
        return date.toLocaleString('en-US', options); // Localized date string
    }

    function createWeatherDescription(weatherData) {
        const { main, dt, weather } = weatherData; // Include weather object for icon

        const description = document.createElement("div");
        const formattedTime = convertToLocalTime(dt);

        description.innerHTML = `
            <div class="weather_description">
                ${main.temp}${temperatureSymbol} - ${formattedTime.slice(11)} - ${formattedTime.slice(0, 10)} 
                <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt="Weather Icon"> 
            </div>
        `;
        return description;
    }
});
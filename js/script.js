// Received key from https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys
let key = "b574cddc0867196624ca48984d8b52ac";
let city = "Seattle";

// Current Time and Date
let date = dayjs().format("dddd, MMMM DD YYYY");
let dateTime = dayjs().format("dddd, MMMM DD YYYY, hh:mm.ss");

// City history from search
let citySearch = [];

// Save text value of search into an array and storage
$(".search").on("click", function(event){
  event.preventDefault();
	// Had to relook into "this" https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
  city = $(this).parent(".btnPar").siblings(".textVal").val().trim();
  if (city === "") {
    return;
  };
  citySearch.push(city);

	// set local storage for city's that were searched
  localStorage.setItem("city", JSON.stringify(citySearch));
  getFiveDayForecastEl.empty();
	getHistory();
	getTodayWeather();
});

// Buttons created based on search history
let constHistEl = $(".citySearch");
function getHistory() {
	constHistEl.empty();

	for (let i = 0; i < citySearch.length; i++) {

		// creates a row and button list for the past searched cities
		let rowEl = $("<row>");
		let btnEl = $("<button>").text(`${citySearch[i]}`);

		rowEl.addClass("row histBtnRow");
		btnEl.addClass("btn btn-outline-secondary histBtn");
		btnEl.attr("type", "button");

    // prepend: https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend
		constHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}

	// Should allow the buttons to start a search
	$(".histBtn").on("click", function(event) {
		event.preventDefault();
		city = $(this).text();
		getFiveDayForecastEl.empty();
		getTodayWeather();
	});
};

let cardContent = $(".cardContent");

// Apply weather data to today's card and launch 5 day forecast
function getTodayWeather() {

  // API provided for challenge
  // https://openweathermap.org/forecast5
  let getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
  
  $(cardContent).empty();

	$.ajax({
		url: getUrlCurrent,
		method: "GET",
  }).then(function (response) {
    $(".cardTodaysCityName").text(response.name);
    $(".cardTodaysDate").text(date);

    //Icons: https://openweathermap.org/weather-conditions
		$(".icons").attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// Temperature
		let pEl = $("<p>").text(`Temperature: ${response.main.temp} °F`);
		cardContent.append(pEl);
		// Wind Speed
		let pElWind = $("<p>").text(`Wind Speed: ${response.wind.speed} Mph`);
		cardContent.append(pElWind);
    // Humidity
		let pElHumid = $("<p>").text(`Humidity: ${response.main.humidity} %`);
		cardContent.append(pElHumid);
		// Lat and long of searched city
    let cityLat = response.coord.lat;
		let cityLon = response.coord.lon;
    
		});
	getFiveDayForecast();
};

let getFiveDayForecastEl = $(".fiveForecast");

// 5 day forecast: https://openweathermap.org/forecast5
function getFiveDayForecast() {
	let getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

  $.ajax({
		url: getUrlFiveDay,
		method: "GET",
	}).then(function (response) {
		let fiveDayArray = response.list;
		let weatherCards = [];

  // Friend helped me create this array to show data on cards
  $.each(fiveDayArray, function (index, value) {
		testObj = {
			date: value.dt_txt.split(" ")[0],
			time: value.dt_txt.split(" ")[1],
			temp: value.main.temp,
      speed: value.wind.speed,
			icon: value.weather[0].icon,
			humidity: value.main.humidity
		};

		// learned helpful tip in splitting again in 12/12/22's class
		if (value.dt_txt.split(" ")[1] === "12:00:00") {
			weatherCards.push(testObj);
		}
		});  
	
		//Cards to display on screen
		for (let i = 0; i < weatherCards.length; i++) {

			let divElCard = $("<div>");
			divElCard.attr("class", "card text-white bg-dark mb-3 cardOne");
			divElCard.attr("style", "max-width: 250px;");
			getFiveDayForecastEl.append(divElCard);

			let divElHeader = $("<div>");
			divElHeader.attr("class", "card-header");
			let m = dayjs(`${weatherCards[i].date}`).format("MM-DD-YYYY");
			divElHeader.text(m);
			divElCard.append(divElHeader);

			let divElBody = $("<div>");
			divElBody.attr("class", "card-body");
			divElCard.append(divElBody);

			// Pull correct image icons from icon source
			let divElIcon = $("<img>");
			divElIcon.attr("class", "icons");
			divElIcon.attr("src", `https://openweathermap.org/img/wn/${weatherCards[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			// Temperature, Wind Speed and humidity to display on cards
			let pElTemp = $("<p>").text(`Temperature: ${weatherCards[i].temp} °F`);
			divElBody.append(pElTemp);
      let pElWind = $("<p>").text(`Wind Speed: ${weatherCards[i].speed} Mph`);
      divElBody.append(pElWind);
			let pElHumid = $("<p>").text(`Humidity: ${weatherCards[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};

//Data for Seattle
function initLoad() {

	let citySearchStore = JSON.parse(localStorage.getItem("city"));

	if (citySearchStore !== null) {
		citySearch = citySearchStore;
	}
	getHistory();
	getTodayWeather();
};

initLoad();

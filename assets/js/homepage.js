var userFormEl = document.querySelector("#user-form");
var languageButtonsEl = document.querySelector("#language-buttons");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var smallCardsEl = document.querySelector("#small-cards");
var UserInputButton = document.createElement("div");
var weatherCardEl = document.getElementsByClassName("weatherCard");
var SmallCardsFlush = document.getElementById("small-cards");

var buttonStorage = [];

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var username = nameInputEl.value.trim();

  if (username) {
    weatherCardEl.innerHTML = "";
    smallCardsEl.innerHTML = "";
    getUserRepos(username);
    // push to button storage
    buttonStorage.unshift(username);
    // button Box
    var buttonBox = document.createElement("div");
    buttonBox.setAttribute("id", "buttonBox" + username);
    appendButton.appendChild(buttonBox);
    // button appending
    var buttonUserInput = document.createElement("button");
    buttonBox.appendChild(buttonUserInput);
    buttonUserInput.setAttribute("type", "submit");
    buttonUserInput.setAttribute("class", "bttn");
    buttonUserInput.innerHTML = username;

    console.log("BUTTON STORAGE", buttonStorage);

    // clear old content
    repoContainerEl.textContent = "";
    nameInputEl.value = "";
  } else {
    alert("Please enter a City for weather search");
  }
};

var buttonClickHandler = function (event) {
  // get the language attribute from the clicked element
  var language = event.target.getAttribute("data-language");

  if (language) {
    getFeaturedRepos(language);

    // clear old content
    repoContainerEl.textContent = "";
  }
};

var getUserRepos = function (user) {
  // format the github api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&cnt=6&q=" +
    user +
    ",us&appid=1316a61f66911f3f535e71a6a7e7fc1f";

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log("<<<<apiUrl fetched = DATA>>>>", data);
          displayRepos(data, user);
          // appending weather card
          var weatherCard = document.createElement("card");
          weatherCard.classList = "weatherCard";
          repoContainerEl.appendChild(weatherCard);
          // appending weather icon
          var iconBox = document.createElement("div");
          iconBox.classList = "iconBox";
          weatherCard.appendChild(iconBox);
          var icons = data.weather[0].icon;
          var insertIcon =
            "http://openweathermap.org/img/wn/" + icons + "@2x.png";
          iconBox.innerHTML = "<img src=" + insertIcon + ">";

          // appending temp box to weather card.
          var tempBox = document.createElement("div");
          tempBox.classList = "tempBox";
          weatherCard.appendChild(tempBox);
          tempBox.innerHTML = "temp: " + data.main.temp + " F";
          // appending wind speed
          var windBox = document.createElement("div");
          windBox.classList = "windBox";
          weatherCard.appendChild(windBox);
          windBox.innerHTML = "Wind: " + data.wind.speed + " MPH";
          // appending Humidity:
          var humidBox = document.createElement("div");
          humidBox.classList = "humidBox";
          weatherCard.appendChild(humidBox);
          humidBox.innerHTML = "Humidity: " + data.main.humidity + "%";
          // lat and lon to push to array for coordinates

          var apiArray = {
            lat: [],
            lon: [],
          };
          var lat = data.coord.lat;
          var lon = data.coord.lon;
          // !!!!push to array
          function arrayPushLat() {
            return apiArray.lat.push(lat);
          }
          arrayPushLat();
          function arrayPushLon() {
            return apiArray.lon.push(lon);
          }
          arrayPushLon();

          var oneCall =
            "https://api.openweathermap.org/data/2.5/onecall?&units=imperial&lat=" +
            apiArray.lat +
            "&lon=" +
            apiArray.lon +
            "&appid=1316a61f66911f3f535e71a6a7e7fc1f";

          fetch(oneCall).then(function (response) {
            // request was successful
            console.log("<<<<<RESPONSE>>>>>>>>", response);
            response.json().then(function (data) {
              console.log("<<<<ONE CALL fetched = DATA>>>>", data);
              var uvIndex = data.daily[0].uvi;
              var uvIndexCard = document.createElement("div");
              uvIndexCard.classList = "uv-index";
              repoContainerEl.appendChild(uvIndexCard);
              uvIndexCard.innerHTML =
                "UV Index: " +
                "<div>" +
                "<span class='" +
                color() +
                "'>" +
                uvIndex +
                "</span>" +
                "</div>";
              // adding boxes for smaller cards
              appendBoxes();

              // function to add information from data to cards.
              function addInformation() {
                for (var i = 1; i < 6; i++) {
                  // dynamic icon add in
                  let unixTime = data.daily[i].dt;
                  const date = new Date(unixTime * 1000);
                  var timeArray = [];
                  timeArray.push(date);
                  console.log(timeArray);
                  var dynamicAdd = document.getElementById("small-card" + i);
                  var dateBox = document.createElement("div");
                  dateBox.classList = "dateBox";
                  dynamicAdd.appendChild(dateBox);
                  dateBox.innerHTML = date;
                  var iconSmallBox = document.createElement("div");
                  iconSmallBox.classList = "iconSmallBox";
                  dynamicAdd.appendChild(iconSmallBox);
                  var smallIcons = data.daily[i].weather[0].icon;
                  var insertSmallIcon =
                    "http://openweathermap.org/img/wn/" +
                    smallIcons +
                    "@2x.png";
                  iconSmallBox.innerHTML = "<img src=" + insertSmallIcon + ">";
                  // dynamic temp add
                  var maxTempBox = document.createElement("div");
                  maxTempBox.classList = "maxTempBox";
                  dynamicAdd.appendChild(maxTempBox);
                  var maxTemp = "Max Temp: " + data.daily[i].temp.max + "F";
                  maxTempBox.innerHTML = maxTemp;
                  //dynamic wind addition
                  var smallWindBox = document.createElement("div");
                  smallWindBox.classList = "smallWindBox";
                  dynamicAdd.appendChild(smallWindBox);
                  var smallWind = "Wind: " + data.daily[i].wind_speed + " MPH";
                  smallWindBox.innerHTML = smallWind;
                  // Humidity dynamic add
                  var smallHumidBox = document.createElement("div");
                  smallHumidBox.classList = "smallhumidBox";
                  dynamicAdd.appendChild(smallHumidBox);
                  var smallHumid = "Humidity: " + data.daily[i].humidity + " %";
                  smallHumidBox.innerHTML = smallHumid;
                }
              }
              addInformation();
              // uv index color function
              function color() {
                if (uvIndex >= 0 && uvIndex <= 2) {
                  return "green";
                } else if (uvIndex >= 3 && uvIndex <= 5) {
                  return "yellow";
                } else if (uvIndex >= 6 && uvIndex <= 7) {
                  return "orange";
                } else if (uvIndex >= 8 && uvIndex <= 10) {
                  return "red";
                } else {
                  return "purple";
                }
                console.log(color);
              }
            });
          });
        });
      } else {
        alert("Error: City not found, please try again");
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
};

var getFeaturedRepos = function (language) {
  // format the github api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    user +
    ",us&appid=4faae247520c12ef60154936f5f00888";

  // make a get request to url
  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a link for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

// add event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);

function appendBoxes() {
  for (var i = 1; i < 6; i++) {
    var smallCardsBox = document.createElement("div");
    smallCardsBox.setAttribute("id", "small-card" + [i]);
    smallCardsEl.append(smallCardsBox);
  }
}

var userFormEl = document.querySelector("#user-form");
var languageButtonsEl = document.querySelector("#language-buttons");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);

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

var oneCall =
  "https://api.openweathermap.org/data/2.5/onecall?lat=-84.388&lon=33.749&appid=1316a61f66911f3f535e71a6a7e7fc1f";

var getUserRepos = function (user) {
  // format the github api url
  // !!!! add CNT=6 for number of days
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&cnt=6&q=" +
    user +
    ",us&appid=1316a61f66911f3f535e71a6a7e7fc1f";

  // ONE CALL API URL
  fetch(oneCall).then(function (response) {
    // request was successful
    console.log("<<<<<RESPONSE>>>>>>>>", response);
    response.json().then(function (data) {
      console.log("<<<<ONE CALL fetched = DATA>>>>", data);
      var uvIndex = data.daily[0].uvi;
      console.log("<<<<<<<UV INDEX>>>>>>", uvIndex);
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
      function color() {
        if (uvIndex >= 0 && uvIndex <= 2) {
          return "green";
        }
        if (uvIndex >= 3 && uvIndex <= 5) {
          return "yellow";
        }
        if (uvIndex >= 6 && uvIndex <= 7) {
          return "orange";
        }
        if (uvIndex >= 8 && uvIndex <= 10) {
          return "red";
        }
        if (uvIndex >= 11) {
          return "purple";
        }
        console.log(color);
      }
    });
  });

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log("<<<<apiUrl fetched = DATA>>>>", data);
          // information to append for cards
          console.log("temp: ", data.main.temp + " F");
          console.log("wind: ", data.wind.speed + " MPH");
          console.log("Humidity: ", data.main.humidity + " %");
          console.log("weather: ", data.weather[0].description);
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
          tempBox.innerHTML = "temp: " + data.main.temp + " f";
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
languageButtonsEl.addEventListener("click", buttonClickHandler);

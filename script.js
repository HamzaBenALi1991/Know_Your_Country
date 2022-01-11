"use strict";

const ownCountry = document.body.querySelector(".countries");
const borders = document.body.querySelector(".borders");
const h2 = document.body.querySelector(".op");
const button = document.body.querySelector(".button");
const input = document.body.querySelector(".input");
const message = document.body.querySelector(".div");
let mapStatus = false;
let map;
let lat, lng;

const renderError = function (err) {
  message.textContent = "";
  message.insertAdjacentText("beforeend", err);
  h2.style.opacity = 0;
  ownCountry.style.opacity = 1;
};
const renderMap = function (lng, lt) {
  map = L.map("map").setView([lng, lt], 3);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lng, lt]).addTo(map).bindPopup();
  mapStatus = true;
};
const renderCountry = function (data, className = "") {
  ownCountry.innerHTML = "";
  borders.innerHTML = "";
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(data.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(data.currencies)[0].name
        }</p>
      </div>
    </article>
    `;
  ownCountry.insertAdjacentHTML("beforeend", html);
  ownCountry.style.opacity = 1;
  h2.classList.remove("hidden");
};
const renderNeighbour = function (data, className = "") {
  const html = `
    <div class="col-4" >
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(data.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(data.currencies)[0].name
        }</p>
      </div>
    </article>
    </div>
    `;
  borders.insertAdjacentHTML("beforeend", html);
  borders.style.opacity = 1;
  h2.style.opacity = 1;
};

const getCountry = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => {
      if (!response.ok) {
        mapStatus = true;
        throw new Error(
          ` ${country} is not a valid name for a country . ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {
      renderCountry(data[0], country);
      [lat, lng] = data[0].latlng;
      renderMap(lat, lng);
      const borders = data[0].borders;
      if (!borders) {
        throw new Error(`This country has no  neighbour  border  countries . `);
      }
      return borders;
    })
    .then((data) => {
      data.forEach((element) => {
        getCountryBorders(element, "neighbour");
      });
    })

    .catch((err) => {
      renderError(err.message);
    });
};
const getCountryBorders = function (country) {
  fetch(`https://restcountries.com/v3.1/alpha/${country}`).then((response) =>
    response
      .json()
      .then((data) => {
        if (!data) return;
        renderNeighbour(data[0], "neighbour");

        return data;
      })
      .catch((err) => {
        renderError(`Something went wrong
       , check connexion  or the spelling of the country and try again 
       `);
      })
  );
};
const checkCountry = function () {
  const data = input.value;
  getCountry(data);
};

button.addEventListener("click", function (e) {
  e.preventDefault();

  ownCountry.innerHTML = "";
  borders.innerHTML = "";
  message.textContent = "";
  if (!input.value) {
    message.textContent = "this feild can not be Empty .";
    h2.classList.add("hidden");
    mapStatus = true;
    return;
  }
  if (mapStatus && map) {
    map.remove();
    map = undefined;
  }
  checkCountry();
});

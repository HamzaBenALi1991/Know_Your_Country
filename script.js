"use strict";

const ownCountry = document.body.querySelector(".countries");
const button = document.body.querySelector(".button");
const input = document.body.querySelector(".input");

const renderCountry = function (data, className = "") {
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
  ownCountry.innerHTML = "";
  ownCountry.insertAdjacentHTML("beforeend", html);
  ownCountry.style.opacity = 1;
};

const getCountry = function (country) {
  console.log(country);
  fetch(`https://restcountries.com/v3.1/name/${country}`).then((response) =>
    response
      .json()
      .then((data) => {
        if (!data) return;
        console.log(data);
        renderCountry(data[0], country);
      })
      .catch((reason) => console.log(reason.message))
  );
};
function checkCountry() {
  const data = input.value;
  getCountry(data);
}
button.addEventListener("click", checkCountry);

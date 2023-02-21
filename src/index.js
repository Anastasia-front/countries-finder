import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

let inputValue = '';

input.addEventListener('input', debounce(inputChange, DEBOUNCE_DELAY));
function inputChange() {
  inputValue = input.value.trim();
  if (inputValue === '') {
    clearMarkup();
    return;
  } else
    fetchCountries(inputValue)
      .then(countries => {
        if (countries.length < 2) {
          createInfo(countries);
        } else if (countries.length < 10 && countries.length > 1) {
          createList(countries);
        } else {
          clearMarkup();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        clearMarkup();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
}
function clearMarkup() {
  list.innerHTML = '';
  info.innerHTML = '';
}

function createInfo(countries) {
  clearMarkup();
  const country = countries[0];
  const card = `<div class="country-box"><div class="country-heading">
            <img src="${country.flags.svg}" alt="${
    country.flags.alt
  }" width="70" height="55" />
            <h2 class="country-name"> ${country.name.official}</h2></div>
            <div class="country-information">
            <p>Capital: <b>${country.capital}</b></p>
            <p>Population: <b>${country.population}</b></p>
            <p>Languages: <b>${Object.values(country.languages).join(
              ','
            )}</b></p></div></div>`;
  info.innerHTML = card;
}

function createList(countries) {
  clearMarkup();
  const listOfCounties = countries
    .map(
      country =>
        `<li class="country-list-name">
            <img src="${country.flags.svg}" alt="${country.flags.alt}" width="30" height='20' />
            <span>${country.name.official}</span>
        </li>`
    )
    .join('');
  list.insertAdjacentHTML('beforeend', listOfCounties);
}

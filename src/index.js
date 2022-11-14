import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import _debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries.js';
import getRefs from './js/get-refs'

const DEBOUNCE_DELAY = 300;

// const refs = {
//     input: document.querySelector('#search-box'),
//     countryListEl:document.querySelector('.country-list'),
//     countryInfoEl:document.querySelector('.country-info'),
// }

const refs = getRefs();


refs.input.addEventListener('input', _debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(evt) {
    clearMarkup(refs.countryListEl);
    clearMarkup(refs.countryInfoEl);
    
  if (!evt.target.value.trim()) {
    return;
  }

  fetchCountries(evt.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        Notify.warning(
          '⚠️Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      clearMarkup(refs.countryListEl);
      clearMarkup(refs.countryInfoEl);
      Notify.failure('❌Oops, there is no country with that name');
    });
}

function clearMarkup(el) {
  el.innerHTML = '';
}

function renderMarkup(data) {
  if (data.length === 1) {
    clearMarkup(refs.countryListEl);
    refs.countryInfoEl.innerHTML = infoMarkup(data);
  } else {
    clearMarkup(refs.countryInfoEl);
    refs.countryListEl.innerHTML = listMarkup(data);
  }
}

function infoMarkup(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<h1><img src="${flags.png}" alt="${
          name.official
        }" width="50" height="40">  ${name.official}</h1>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages)}</p>`
    )
    .join('');
}

function listMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country-list_item"><img src="${flags.png}" alt="${name.official}" width="50" height="40"><p>${name.official}</p></li>`
    )
    .join('');
}
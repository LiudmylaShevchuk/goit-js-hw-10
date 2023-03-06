import './css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  countriesNameInput: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countriesInfo: document.querySelector('.country-info'),
};

refs.countriesNameInput.addEventListener(
  'input',
  debounce(onInput, DEBOUNCE_DELAY)
);

function onInput(e) {
  const countryName = e.target.value.trim();

  if (!countryName) {
    clearSummary();
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        specificName();
        clearSummary();
        return;
      }
      renderSummary(data);
    })
    .catch(error => {
      clearSummary();
      errorWarn();
    });
}

function specificName() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function errorWarn() {
  Notify.info('Oops, there is no country with that name');
}

function clearSummary() {
  refs.countriesInfo.innerHTML = '';
  refs.countriesList.innerHTML = '';
}

function renderSummary(elements) {
  let summary = '';
  let refsSummary = '';
  clearSummary();

  if (elements.length === 1) {
    summary = createSummary(elements);
    refsSummary = refs.countriesInfo;
  } else {
    summary = createSummaryList(elements);
    refsSummary = refs.countriesList;
  }
  designSummary(refsSummary, summary);
}

function createSummary(element) {
  return element.map(
    ({ name, capital, population, flags, languages }) => `
        <img scr="${flags.svg}" alt="${name.official}" width="120" height="80">
        <h1 class="country-info__title">${name.official}</h1>
        <ul class="country-info__list">
        <li class="country-info__item">
        <span>Capital:</span>${capital}</li>
        <li class="country-info__item">
        <span>Population:</span>${population}</li>
                <li class="country-info__item">
        <span>languages:</span>${Object.values(languages)}</li>
        </ul>
        `
  );
}

function createSummaryList(elements) {
  return elements
    .map(
      ({ name, flags }) =>
        `
        <li class="country-list__item">
        <img class="country-list__img" scr="${flags.svg}" alt="${name.official}" width="60" height="40">
         ${name.official}
         </li>
        `
    )
    .join('');
}

function designSummary(refs, markup) {
  refs.innerHTML = markup;
}

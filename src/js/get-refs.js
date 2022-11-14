export default function getRefs() {
    return {
        input: document.querySelector('#search-box'),
        countryListEl: document.querySelector('.country-list'),
        countryInfoEl: document.querySelector('.country-info'),
    };
}
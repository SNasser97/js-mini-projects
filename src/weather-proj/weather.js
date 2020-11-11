const fetch = require('node-fetch');
import 'regenerator-runtime/runtime';



const output = document.querySelector('.output');
const input = document.querySelector('#js-search');
const searchResults = document.querySelector('.weather__displayLocations');
console.log({
  input,
  output,
  searchResults
});

const getLocation = async (query='london') => {
  // if (!query) query = 'london';
  try {
    console.log('getLoc', query);
    console.log('test', process.env);
    const URL = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${process.env.API_KEY}&units=metric`
    const locationRaw = await fetch(URL);
    const data = await locationRaw.json();
    return data.list;
  } catch (e) {
    console.error('err', e.message);
  }
}


const createDOM = (data) => {
  const result = document.createElement('div');
  const loc = document.createElement('p');
  const temp = document.createElement('p');
  loc.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = Math.ceil(data.main.temp) + '° C';
  loc.classList.add('fs--sm', 'js-locationName');
  temp.classList.add('fs--lg', 'js-locationTemp');
  result.classList.add('js-locationResult');
  result.appendChild(loc);
  result.appendChild(temp);
  result.setAttribute('data-location-id', data.id);
  return result;
}

const state = {
  searchField: '',
  locations: [],
}
const render = async (state) => {
  try {
    state.locations = await getLocation(state.searchField);
    searchResults.textContent = '';
    await state.locations.forEach(loc => {
      let element = createDOM(loc);
      element.addEventListener('click', () => {
        // todo: pass this location id into another call to populate DOM.
        console.log('loc id', loc.id);
      })
      searchResults.appendChild(element);
    });
  } catch(e) {
    console.error('err:', e.message);
  }
}

window.onload = () => {
  input.value = '';
  state.searchField = input.value;
  render(state);
}

input.addEventListener('input', (e) => {
  state.searchField = e.target.value;
  render(state);
})
module.exports = {
  getLocation
}
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

const getLocation = async (query = 'london') => {
  // if (!query) query = 'london';
  // try {
  console.log('getLoc', query);
  const URL = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${process.env.API_KEY}&units=metric`
  const locationRaw = await fetch(URL);
  const data = await locationRaw.json();
  return data.list;
  // } catch (e) {
  //   console.error('err', e.message);
  // }
}

const createDOMElem = (type, props, text) => {
  let elem = document.createElement(type);
  // console.log(text);
  Object.keys(props).forEach(prop => {
    elem[prop] = props[prop];
  });
  if (text !== null) {
    const textNode = document.createTextNode(text);

    elem.appendChild(textNode);
  }
  return elem;
}

const createSearchListDOM = async (data) => {
  const locationElem = (...props) => createDOMElem('p', ...props);
  const tempElem = (...props) => createDOMElem('p', ...props);
  const iconElem = (...props) => createDOMElem('img', ...props);
  const flagElem = (...props) => createDOMElem('img', ...props);
  const result = document.createElement('div')

  result.classList.add('js-locationResult');

  result.appendChild(locationElem({ className: 'fs--xs' },
    `${data.name}, ${data.sys.country}`)
  );
  // result.appendChild(flag);
  result.appendChild(flagElem({
    className: 'js-locationFlag',
    src: await getCountryFlag(data.sys.country),
    alt: data.name,
  }, null));

  result.appendChild(iconElem({
    className: 'js-locationIcon',
    src: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    alt: `${data.weather[0].main}, ${data.weather[0].description}`
  }, null));

  result.appendChild(tempElem(
    { className: 'fs--lg js-locationTemp' },
    Math.ceil(data.main.temp) + '° C'
  ));
  result.setAttribute('data-location-id', data.id);
  return result;
}

const createOutputtDOM = async (data) => {
  
}

const displayLoader = (parent) => {
  const loaderContainer= document.createElement('div');
  const loaderElem = (...props) => createDOMElem('div', ...props);
  loaderContainer.style.width = '40rem';
  loaderContainer.appendChild(loaderElem({ className: 'loader' }, null));
  parent.appendChild(loaderContainer)
}

const state = {
  searchField: '',
  locations: null,
}

const getCountryFlag = async (iso) => {
  try {
    const countryRaw = await fetch(`https://restcountries.eu/rest/v2/alpha/${iso}`)
    const data = await countryRaw.json();
    const flagURL = await data.flag;
    return flagURL;
  } catch (e) {
    console.warn('could not get flag', e.message);
  }
}

const render = async (state) => {
  try {
    // display loader while user is typing
    if (state.locations) {
      displayLoader(searchResults);
    }
    state.locations = await getLocation(state.searchField);
    const list = await state.locations;
    await list.forEach(async loc => {
      let element = await createSearchListDOM(loc);
      element.addEventListener('click', () => {
        // todo: pass this location id into another call to populate DOM.
        console.log('loc id', loc.id);
      })
      searchResults.appendChild(element);
    });
    searchResults.textContent = '';
  } catch {
    searchResults.textContent = '';
  }
}

input.value = '';
state.searchField = input.value;
// render(state);

input.addEventListener('input', (e) => {
  state.searchField = e.target.value;
  render(state);
});
module.exports = {
  getLocation
}
const fetch = require('node-fetch');
import 'regenerator-runtime/runtime';



const input = document.querySelector('#js-search');
const searchResults = document.querySelector('.weather__displayLocations');
// console.log({
//   input,
//   output,
//   searchResults
// });

const getLocation = async (query) => {
  try {
    console.log('getLoc', query);
    const URL = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${process.env.API_KEY}&units=metric`
    const locationRaw = await fetch(URL);
    const data = await locationRaw.json();
    return data.list;
  } catch (e) {
    console.error('err', e.message);
  }
}

const getCurrentLocation = async (query) => {
  console.log('id in cuirr', query);
  const URL = `https://api.openweathermap.org/data/2.5/weather?id=${query}&appid=${process.env.API_KEY}&units=metric`;
  const currLocRaw = await fetch(URL);
  const data = await currLocRaw.json();
  return data;
}

const getCurrForecasts = async (query, numOfDays) => {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?daily=${query}&cnt=${numOfDays}&appid=${process.env.API_KEY}&units=metric`;
  const currLocRaw = await fetch(URL);
  const data = await currLocRaw.json();
  return data;
}

const createDOMElem = (type, props, text = null) => {
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
  // add event listener to each result, pass data to state.currLocation
  result.addEventListener('click', async () => {
    // todo: pass this location id into another call to populate DOM.
    console.log('loc id', data.id);
    state.currentLocation = await getCurrentLocation(data.id);
    state.searchField = '';
    console.log('curr loc st', state);
    input.value = '';
    render(state);
    createOutputDOM(state.currentLocation);
  });
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
const output = document.querySelector('.output');

const createForecastDOM = async (data) => {
  
}

const createOutputDOM = async (data) => {
  // todo: display html props of current location
  const headerEl = document.createElement('div');
  // const dateEl = (...props) => createDOMElem('time', ...props);
  const locationEl = (...props) => createDOMElem('p', ...props);
  const imgEl = (...props) => createDOMElem('img', ...props);
  const tempEl = (...props) => createDOMElem('p', ...props);
  const weatherDescEl = (...props) => createDOMElem('p', ...props);
  const flagElem = (...props) => createDOMElem('img', ...props);
  headerEl.setAttribute('class', 'card card__weather');
  const locationParent = locationEl({ className: 'sub-title fs--lg' }, data.name + ', ' + data.sys.country)
  //* timestamp conversion 
  // const unixEpochTimeMS = data.dt * 1_000;
  // const d = new Date(unixEpochTimeMS);
  // const strDate = d.toLocaleTimeString();
  
  locationParent.appendChild(flagElem({
    className: 'js-locationFlag',
    src: await getCountryFlag(data.sys.country),
    alt: data.name,
    height: '20',
    width: '40',
    style: 'margin-left:2rem'
  }, null));

  const nodeList = [
    // dateEl({ className: 'fs--sm' }, strDate),
    locationParent,
    imgEl({
      className: 'card__image--lg',
      src: `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
      alt: `${data.weather[0].main}, ${data.weather[0].description}`
    }),
    tempEl({ className: 'fs--xl' }, Math.ceil(data.main.temp) + '° C'),
    weatherDescEl({ className: 'fs--md' }, data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1)),
  ];

  
  nodeList.forEach(el => headerEl.appendChild(el));
  output.appendChild(headerEl);
  // todo: fetch currentlocation from state.location
  // todo: display forecast for current location
  // todo: api call for forecast + api call for currentLocation
}

const displayLoader = (parent) => {
  const loaderContainer = document.createElement('div');
  const loaderElem = (...props) => createDOMElem('div', ...props);
  loaderContainer.style.width = '40rem';
  loaderContainer.appendChild(loaderElem({ className: 'loader' }, null));
  parent.appendChild(loaderContainer);
}

const state = {
  searchField: '',
  locations: [],
  currentLocation: null,
  currForecast: null,
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

    await displayResults(state);
    console.log('new state', state);
    searchResults.textContent = '';
    output.textContent = '';
  } catch {
    searchResults.textContent = '';
  }
}
const displayResults = async (state) => {
  await state.locations.forEach(async loc => {
    let element = await createSearchListDOM(loc);
    searchResults.appendChild(element);
  });
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
const fetch = require('node-fetch');
import 'regenerator-runtime/runtime';



const input = document.querySelector('#js-search');
const searchResults = document.querySelector('.weather__displayLocations');
const output = document.querySelector('.output');

const callAPI = async (request, ...query) => {
  try {
    let url = '';
    switch (request.toLowerCase()) {
      case 'search':
        url = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${process.env.API_KEY}&units=metric`;
        break;
      case 'get':
        url = `https://api.openweathermap.org/data/2.5/weather?id=${query}&appid=${process.env.API_KEY}&units=metric`;
        break;
      case 'forecast':
        url = `https://api.openweathermap.org/data/2.5/forecast?id=${query[0]}&cnt=${query[1]}&appid=${process.env.API_KEY}&units=metric`;
        break;
      case 'flag':
        url = `https://restcountries.eu/rest/v2/alpha/${query}`;
        break;
      default:
        url;
        console.log('did not specify request');
    }
    const response = await fetch(url);
    const data = await response.json();
    if (request.toLowerCase() === 'search') {
      return data.list;
    } else if (request.toLowerCase() === 'flag') {
      return data.flag;
    }
    return data;
  } catch {
    console.log('err');
  }
}

const createDOMElem = (type, props, text = null) => {
  const elem = document.createElement(type);
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
  const paraElem = (...props) => createDOMElem('p', ...props);
  const imgElem = (...props) => createDOMElem('img', ...props);
  const result = document.createElement('div');

  result.classList.add('js-locationResult');
  // add event listener to each result, pass data to state.currLocation
  result.addEventListener('click', async (e) => {
    let queryID = 0;
    state.currentLocation = await callAPI('get', data.id);
    // if user clicks elements inside result div - get the attr from div else it is the div
    if (e.target.parentElement) {
      queryID = await e.target.parentElement.getAttribute('data-location-id');
      state.currentForecast = await callAPI('forecast', queryID, 7);
    }
    queryID = await e.target.getAttribute('data-location-id');
    state.currentForecast = await callAPI('forecast', queryID, 7);

    state.searchField = '';
    console.log('curr loc st', state.currentLocation);
    console.log('curr forcast', state.currentForecast);

    input.value = '';
    render(state);
    createOutputDOM(state.currentLocation, state.currentForecast.list);
  });
  result.appendChild(paraElem({ className: 'fs--xs' },
    `${data.name}, ${data.sys.country}`)
  );
  // result.appendChild(flag);
  result.appendChild(imgElem({
    className: 'js-locationFlag',
    src: await callAPI('flag', data.sys.country),
    alt: data.name,
  }, null));

  result.appendChild(imgElem({
    className: 'js-locationIcon',
    src: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    alt: `${data.weather[0].main}, ${data.weather[0].description}`
  }, null));

  result.appendChild(paraElem(
    { className: 'fs--lg js-locationTemp' },
    Math.ceil(data.main.temp) + '° C'
  ));
  result.setAttribute('data-location-id', data.id);

  return result;
}

const createForecastDOM = (data) => {
  //* create each element with forecast data.
  // dt_txt, main.temp, weather.description, weather.icon
  const forecastsOutput = document.createElement('div');
  const forecastDiv = document.createElement('div');
  // const timeElem = (...props) => createDOMElem('time', ...props);
  const titleElem = (...props) => createDOMElem('h3', ...props);
  const paraElem = (...props) => createDOMElem('p', ...props);
  const imgElem = (...props) => createDOMElem('img', ...props);
  forecastsOutput.classList.add('card__forecasts');
  forecastDiv.classList.add('card__forecast');
  // forecastDiv.appendChild(timeElem({ className: 'fs--sm forecast-date' }, ));

  forecastDiv.appendChild(paraElem({ className: 'sub-title fs--md' }, Math.ceil(data.main.temp) + '° C'));
  forecastDiv.appendChild(imgElem({ className: 'card__image--sm', src: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, alt: 'altname' }, 'temp here'));
  forecastDiv.appendChild(paraElem({ className: 'fs--sm' }, data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1)))

  forecastsOutput.appendChild(titleElem({ className: 'sub-title fs--md' }, new Date(data.dt_txt).toUTCString()));
  forecastsOutput.appendChild(forecastDiv);

  return forecastsOutput;
}

const createOutputDOM = async (data, list = null) => {
  const children = list;
  const container = document.createElement('div');
  const headerEl = document.createElement('div');
  const paraElem = (...props) => createDOMElem('p', ...props);
  const imgElem = (...props) => createDOMElem('img', ...props);
  const locationParent = paraElem({ className: 'sub-title fs--lg' }, `${data.name}, ${data.sys.country}`)
  // const dateEl = (...props) => createDOMElem('time', ...props);
  headerEl.setAttribute('class', 'card__header');
  container.setAttribute('class', 'card card__weather');
  //* timestamp conversion 
  // const timestamp = dayjs.unix(data.dt-data.timezone);

  // const d = new Date(unixEpochTimeMS);
  // const strDate = d.toLocaleTimeString();

  locationParent.appendChild(imgElem({
    className: 'js-locationFlag',
    src: await callAPI('flag', data.sys.country),
    alt: data.name,
    height: '20',
    width: '40',
    style: 'margin-left:2rem'
  }, null));

  const nodeList = [
    // dateEl({ className: 'fs--sm' }, timestamp),
    locationParent,
    imgElem({
      className: 'card__image--lg',
      src: `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
      alt: `${data.weather[0].main}, ${data.weather[0].description}`
    }),
    paraElem({ className: 'fs--xl' }, Math.ceil(data.main.temp) + '° C'),
    paraElem({ className: 'fs--md' }, data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1)),
  ];

  nodeList.forEach(el => headerEl.appendChild(el));
  container.appendChild(headerEl);
  children.forEach(el => container.appendChild(createForecastDOM(el)));
  output.appendChild(container);
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
  currentForecast: null,
}

const render = async (state) => {
  try {
    // display loader while user is typing
    if (state.locations) {
      displayLoader(searchResults);
    }
    state.locations = await callAPI('search', state.searchField);

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
render(state);

input.addEventListener('input', (e) => {
  state.searchField = e.target.value;
  render(state);
});

module.exports = {
  // getLocation
}
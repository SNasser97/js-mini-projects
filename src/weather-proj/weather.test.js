const fetch = require('node-fetch');
const {
  getLocation
} = require('./weather');

/*
  * 1. Write a test before code
  * 2. Write code to make code pass
  * 3. Refactor, make it pass
  * 5. repeat
*/

describe('Weather API', () => {

  it('should call weather api with key and london', () => {

    const url = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=80cdc2bf3e0b26ecb43d69693f36aa6f';
    const expected = {
      id: 803
    }
    return fetch(url).then(data => data.json())
      .then(data => {
        expect(data.weather[0].id).toEqual(expected.id);
      });
  });
});

describe('Weather methods', () => {
  
})
// replace string with 0-9
const generateRandPhone = () => {
  const template = '(xxx)-xxxx';
  return template.split('').map(x => x.replace('x', Math.floor(Math.random() * 9))).join('');
}
// list of names
const generateRandName = () => {
  const firstname = ["Marquis", "Samir", "Adrien", "Joyce", "Pierce", "Juliette", "Kelton", "Jacob", "Isiah", "Lindsay", "Kian", "Jordyn", "Jaquan", "Anya", "Wayne", "Khalil"];
  const lastname = ["Mills", "Mercer", "Reeves", "Hines", "Sanford", "Irwin", "Koch", "Hinton", "Estes", "Jackson", "Lowe", "Guerra", "Pineda", "Franco", "Cowan", "Krause"];
  const fullName = firstname[Math.floor(Math.random() * firstname.length)] + ' ' +
    lastname[Math.floor(Math.random() * lastname.length)];
  return fullName;
};

// Generate the list of people
const generateContacts = (limit) => {
  if (typeof limit !== 'number') {
    return -1;
  }
  const arr = [];
  for (let i = 0; i < limit; i++) {
    arr[arr.length] = {
      name: generateRandName(),
      phone: generateRandPhone(),
    }
  }
  return arr;
}

// filter through case sensittive 
const filterContacts = (data, query) => {
  console.log({ data, query });
  return data.filter(x => x.name.toLowerCase().includes(query.toLowerCase()));
}


// DOM
const input = document.querySelector('#search');
const contactList = generateContacts(10).sort((a, b) => a.name > b.name);
const output = document.querySelector('#list');

// where we render/update the page
const state = {
  searchField: '',
}

const render = (data, state) => {
  output.textContent = '';
  let sections = getSections(data);
  let filtered = filterContacts(data, state.searchField);
  createSections(sections, filtered);

}

const createSections = (titles, people) => {
  titles.forEach(x => {
    const div = document.createElement('div');
    const section = document.createElement('h2');
    div.setAttribute('data_id', x);
    section.textContent = x;
    output.appendChild(div);
    div.appendChild(section);
    addPeople(div, people);
  });
}

// only create/get sections where the first char is displayed.
const getSections = (users) => {
  let obj = {};
  const titles = [];
  for (let i = 0; i < users.length; i++) {
    if (!obj[users[i]]) {
      obj[users[i].name[0]] = true;
    }
  }
  Object.keys(obj).forEach(key => titles.push(key));
  return titles;
}



const addPeople = (div, people) => {
  // const divs = document.querySelectorAll('[data_id]');
  people.forEach(p => {
    if (div.getAttribute('data_id') === p.name[0]) {
      const h3 = document.createElement('h3');
      const span = document.createElement('span');
      h3.textContent = p.name;
      span.textContent = " " + p.phone;
      div.appendChild(h3);
      h3.appendChild(span);
    }
  });
}



// initial render
render(contactList, state);

// input query for contact
document.addEventListener('DOMContentLoaded', () => {
  input.addEventListener('input', (e) => {
    state.searchField = e.target.value;
    render(contactList, state);
  });
});


module.exports = {
  generateRandPhone,
  generateRandName,
  generateContacts,
  filterContacts,
}
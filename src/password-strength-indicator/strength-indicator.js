const $ = document.querySelector.bind(document);
const progressBar = $('#js-progressbar');
const passwordField = $('#password');

const validatePassword = (value) => {
  const string = value.trim().split('');
  const cases = {
    hasLength: false,
    hasUpper: false,
    hasNumber: false,
    hasSymbol: false,
    hasMore: false,
    value: 0,
  }

  cases.hasLength = string.length >= 8;
  cases.hasMore = string.length >= 12;

  string.forEach(char => {
    if (typeof Number(char) === 'number' && !isNaN(char)) {
      cases.hasNumber = true;
    } else {
      if (char === char.toUpperCase()) {
        cases.hasUpper = true;
      }
      let re = /[-!$@%^=_]/
      // @ == uppercase => true, we reset to false
      if (char.match(re) && char === char.toUpperCase()) {
        cases.hasUpper = false;
        cases.hasSymbol = true;
      }
    }
  });

  return cases;
}

const displayProgress = (cases) => {
  progressBar.classList.add('js-show');
  const num = Object.values(cases).reduce((prev, acc) => prev + acc, 0);
  progressBar.value = num;
  if (!num) {
    progressBar.classList.remove('js-show');
  }
  return num;
}

const displayMessage = () => {
  let res = progressBar.value;
  // no need to add break, as we return the msg
  switch (res) {
    case 1:
      return 'Weak - 8 plus chars include @, 0-9 and A-Z';
    case 2:
      return 'Medium';
    case 3:
    case 4:
      return 'Strong';
    default:
      return '';
  }
}

const render = () => {
  $('#js-pw-output').textContent = displayMessage();
}

passwordField.addEventListener('input', (e) => {
  displayProgress(validatePassword(e.target.value));
  render();
});



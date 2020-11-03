
const $ = document.querySelector.bind(document);

const DOM_ELEMENTS = {
  bill: $('#bill'),
  people: $('#people'),
  option: $('select'),
  calcButton: $('#js-calculate'),
  output: $('#total')
}
const {
  bill,
  people,
  option,
  calcButton,
  output
} = DOM_ELEMENTS;

const getBill = (price) => {
  // console.log(price, typeof price);
  return validateBill(price);
}

const validateBill = (value) => {
  const price = parseFloat(value);
  return !isNaN(price) && typeof price !== 'string' ? price : 'Please provide a valid bill';
}

const getRate = (value) => {
  return value / 100;
}

const getPeople = (people) => {
  const value = parseInt(people);
  if (typeof value === 'number' && value % 1 === 0) {
    return value;
  }
  return 'Please provide valid people';
}

const calculateTotal = (bill, rate) => {
  const tip = bill * rate;
  return parseFloat(bill) + tip;
}

const splitBill = (total, numToSplit) => {
  if (numToSplit <= 0) {
    // assume one person.
    return total;
  }
  return (total / numToSplit);
}

window.onload = () => {
  getRate(option.value);
}

function render() {
  const tip = getRate(parseInt(option.value));
  const total = calculateTotal(bill.value, tip);
  const splitVal = splitBill(total, people.value);
  displayTotal(total, splitVal);
}
// prevent excuting the dom before load
document.addEventListener('DOMContentLoaded', () => {
  // calculate on click
  calcButton.addEventListener('click', () => {
    const price = getBill(bill.value);
    const customers = getPeople(people.value);
    const tipRate = getRate(option.value);
    const toPay = calculateTotal(price, tipRate);
    const splitPay = splitBill(toPay, customers);
    displayTotal(toPay, splitPay);
  });
  // recalculate on input or rate change
  option.addEventListener('change', render);
  bill.addEventListener('input', render);
  people.addEventListener('input', render);

});

const displayTotal = (total, split) => {
  output.textContent = `
    Total: $${total} You each pay: $${split.toFixed(2)}
  `;
}


module.exports = {
  getBill,
  validateBill,
  getRate
}
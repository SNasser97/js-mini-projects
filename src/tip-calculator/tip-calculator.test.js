const {
  getBill,
  validateBill,
  getRate
} = require('./tip-calculator');

describe('Check functions', () => {
  
  it('validBill return false on non values' , () => {
    const value = "!"+ 5.50;
    expect(validateBill(value)).toBe('Please provide a valid bill');
  });

  it('getBill return a valid value', () => {
    const value =  10.69;
    expect(getBill(value)).toBe(10.69);
  });

  it('getRate return decimal value', () => {
    expect(getRate(25)).toEqual(0.25);
  });
});
'use strict';

const {
  generateRandPhone,
  generateContacts,
  generateRandName,
  filterContacts
} = require('./filter-contacts');

describe('contacts list filtering', () => {
  it('should generate random phone number', () => {
    expect(parseInt(generateRandPhone()[1])).toEqual(expect.any(Number));
  });

  it('should generate random name', () => {
    expect(generateRandName()).toEqual(expect.any(String));
  });

  it('should generate a contact list', () => {
    expect(generateContacts(10).length).toEqual(10);
  });

  it('should contain name + phone ', () => {
    expect(generateContacts(1)[0]).toHaveProperty('name');
    expect(generateContacts(1)[0]).toHaveProperty('phone');
  });

  it('should filter contacts by name', () => {
    const mockData = [
      { name: 'John', phone: '(1xx)-xxx' },
      { name: 'Mary', phone: '(1xx)-xxx' }
    ]
    expect(filterContacts(mockData, 'jOhN')[0].name).toContain('John');
  });
})
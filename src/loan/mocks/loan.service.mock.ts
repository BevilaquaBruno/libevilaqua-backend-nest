export const mockLoanService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  returnBook: jest.fn(),
  findLoanedBook: jest.fn(),
  findCurrentLoanFromBook: jest.fn(),
  findLoanHistoryFromPerson: jest.fn(),
  count: jest.fn(),
  findAndCountLoanHistoryFromPerson: jest.fn(),
}
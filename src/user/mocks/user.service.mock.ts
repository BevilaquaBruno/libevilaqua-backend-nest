export const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneWithPassword: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
  userHasLibrary: jest.fn(),
  createLibraryUser: jest.fn(),
  getLibraryUser: jest.fn(),
  setLibraryUserUnconfirmed: jest.fn(),
};
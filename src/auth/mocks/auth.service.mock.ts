export const mockAuthService = {
  signIn: jest.fn(),
  generateResetToken: jest.fn(),
  generateLoginToken: jest.fn(),
  findOneToken: jest.fn(),
  updateResetToken: jest.fn(),
}
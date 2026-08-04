module.exports = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  create: jest.fn(function create() {
    return this;
  }),
  defaults: {
    headers: {
      common: {}
    }
  }
};

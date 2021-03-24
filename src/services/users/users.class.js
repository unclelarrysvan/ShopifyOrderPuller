const { Service } = require('feathers-objection');

exports.Users = class Users extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
  create(data, params) {
    // This is the information we want from the user signup data
    const { email, password, name } = data;
    // The complete user
    const userData = {
      email,
      name,
      password
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(userData, params)
  }
};

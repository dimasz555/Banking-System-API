const { validationResult } = require("express-validator");

const validate = (validation) => {
  return async (req, res, next) => {
    await Promise.all(validation.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

module.exports = validate;

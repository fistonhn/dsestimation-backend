import Joi from "joi";

const validateUnit = (unit) => {
  const schema = Joi.object({
    symbol: Joi.string().required(),
    meaning: Joi.string().required(),
  });

  return schema.validate(unit);
};

export default validateUnit;

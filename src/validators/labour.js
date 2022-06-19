import Joi from "joi";

const validateLabour = (labour) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    number: Joi.number().default(1),
    unit: Joi.string().required(),
    caveragePerUnit: Joi.number().allow(null),
    wages: Joi.number().required(),
  });

  return schema.validate(labour);
};
export default validateLabour;

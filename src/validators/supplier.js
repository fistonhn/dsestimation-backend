import Joi from "joi";

const validateSupplier = (supply) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string(),
    price: Joi.number().required(),
  });

  return schema.validate(supply);
};
export default validateSupplier;

import Joi from "joi";

const validateSubContractor = (subcontractor) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    unit: Joi.string().required(),
    quantity: Joi.number().allow(null),
    price: Joi.number().required(),
  });

  return schema.validate(subcontractor);
};
export default validateSubContractor;

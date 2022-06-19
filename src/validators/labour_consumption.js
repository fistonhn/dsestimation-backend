import Joi from "joi";

const validateLabourConsumption = (labour) => {
  const schema = Joi.object({
    name: Joi.string(),
    unit: Joi.string(),
    estimationId: Joi.number(),
    consumedQuantity: Joi.number().required(),
    consumedPrice: Joi.number().required(),
    consumedDate: Joi.date().required(),
    labourId: Joi.number(),
  });

  return schema.validate(labour);
};
export default validateLabourConsumption;

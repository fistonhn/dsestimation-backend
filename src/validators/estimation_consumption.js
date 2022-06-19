import Joi from "joi";

const validateEstimationConsumption = (estimation) => {
  const schema = Joi.object({
    executedQuantity: Joi.number().required(),
    executedDate: Joi.date(),
    estimationId: Joi.number().required(),
  });

  return schema.validate(estimation);
};
export default validateEstimationConsumption;

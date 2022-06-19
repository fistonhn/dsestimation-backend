import Joi from "joi";

const validateSubcontractorConsumption = (subcontractor) => {
  const schema = Joi.object({
    name: Joi.string(),
    unit: Joi.string(),
    estimationId: Joi.number(),
    consumedQuantity: Joi.number().required(),
    consumedPrice: Joi.number().required(),
    consumedDate: Joi.date().required(),
    subcontractorId: Joi.number(),
  });

  return schema.validate(subcontractor);
};
export default validateSubcontractorConsumption;

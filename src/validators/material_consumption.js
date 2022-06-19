import Joi from "joi";

const validateMaterialConsumption = (material) => {
  const schema = Joi.object({
    name: Joi.string(),
    unit: Joi.string(),
    estimationId: Joi.number(),
    consumedQuantity: Joi.number().required(),
    consumedPrice: Joi.number().required(),
    consumedDate: Joi.date().required(),
    materialId: Joi.number(),
  });

  return schema.validate(material);
};
export default validateMaterialConsumption;

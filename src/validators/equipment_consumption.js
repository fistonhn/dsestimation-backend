import Joi from "joi";

const validateEquipmentConsumption = (equipment) => {
  const schema = Joi.object({
    name: Joi.string(),
    unit: Joi.string(),
    estimationId: Joi.number(),
    consumedQuantity: Joi.number().required(),
    consumedPrice: Joi.number().required(),
    consumedDate: Joi.date().required(),
    equipmentId: Joi.number(),
  });

  return schema.validate(equipment);
};
export default validateEquipmentConsumption;

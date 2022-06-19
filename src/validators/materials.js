import Joi from "joi";

const validateMaterial = (material) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().allow(null),
    unit: Joi.string().required(),
    caveragePerUnit: Joi.number().allow(null),
    price: Joi.number().required(),
    supplierId: Joi.number().allow(null),
  });

  return schema.validate(material);
};
export default validateMaterial;

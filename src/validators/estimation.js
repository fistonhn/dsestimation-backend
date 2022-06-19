import Joi from "joi";

export const validateCreateEstimation = (estimation) => {
  const schema = Joi.object({
    name: Joi.string()
      .max(255)
      .required()
      .error(new Error("Estimation Name is required")),
    estimationUnit: Joi.string()
      .required()
      .error(new Error("Estimation Unit is required")),
    estimationQuantity: Joi.number()
      .required()
      .error(new Error("Estimation Quantity is required")),
    categoryId: Joi.number()
      .required()
      .error(new Error("Category is required")),
  });

  return schema.validate(estimation);
};

export const validateUpdateEstimation = (estimation) => {
  const schema = Joi.object({
    name: Joi.string().max(255).error(new Error("Estimation Name is required")),
    estimationUnit: Joi.string().error(
      new Error("Estimation Unit is required")
    ),
    estimationQuantity: Joi.number().error(
      new Error("Estimation Quantity is required")
    ),
    wastagePercentage: Joi.number().error(
      new Error("Wastage Percentage is required")
    ),
    transportPercentage: Joi.number().error(
      new Error("Transport Percentage is required")
    ),
    profitPercentage: Joi.number().error(
      new Error("Profit Percentage is required")
    ),
    overHeadPercentage: Joi.number().error(
      new Error("Overhead Percentage is required")
    ),
    contigencyPercentage: Joi.number().error(
      new Error("Contigency Percentage is required")
    ),
    categoryId: Joi.number().error(new Error("Category is required")),
  });

  return schema.validate(estimation);
};

export const validateEstimationEquipmentEdit = (estimation) => {
  const schema = Joi.object({
    caveragePerUnit: Joi.number().error(
      new Error("Coverage Per Unit is required")
    ),
    equipmentName: Joi.string()
      .required()
      .error(new Error("Equipment Name is required")),
    equipmentPrice: Joi.number().error(
      new Error("Equipment Price is required")
    ),
  });
  return schema.validate(estimation);
};

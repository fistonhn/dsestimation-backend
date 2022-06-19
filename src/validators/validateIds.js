import Joi from "joi";

export const validateIdParamas = (id) => {
  const schema = Joi.number()
    .required()
    .error(new Error("Id is required and must be a number"));

  return schema.validate(id);
};

export const validateProjectIdParamas = (projectId) => {
  const schema = Joi.number()
    .required()
    .error(new Error("ProjectId is required and must be a number"));

  return schema.validate(projectId);
};

export const validateSupplierIdParamas = (supplierId) => {
  const schema = Joi.number()
    .required()
    .error(new Error("supplier is required"));

  return schema.validate(supplierId);
};


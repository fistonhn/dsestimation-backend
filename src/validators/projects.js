import Joi from "joi";

const validateProject = (project) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().allow(''),
    client: Joi.string().min(3),
    contractor: Joi.string().min(3),
    consultant: Joi.string().min(3),
    startDate: Joi.date().allow(null),
    endDate: Joi.date().allow(null),
    status: Joi.string().valid(
      "not started",
      "on progress",
      "suspended",
      "canceled",
      "completed"
    ),
    outputAndPrice: Joi.string().valid("daily", "hourly").allow(null),
  });
  return schema.validate(project);
};

export default validateProject;

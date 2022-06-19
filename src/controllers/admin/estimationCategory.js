import {
  EstimationCategory,
  Estimations,
  Materials,
  Equipments,
  Labours,
  SubContractors,
} from "../../database/models";
import { onError, onSuccess } from "../../utils/response";

class EstimationCategoryController {
  // get all estimation categories
  static async getAll(req, res) {
    try {
      // sort in ascending order
      const categories = await EstimationCategory.findAll({
        include: [
          {
            model: Estimations,
            as: "activities",
            include: [
              {
                model: Materials,
                as: "materials",
                attributes: [
                  "name",
                  "quantity",
                  "unit",
                  "caveragePerUnit",
                  "price",
                ],
                through: {
                  attributes: ["materialFactorQuantity", "materialTotalAmount"],
                },
              },
              {
                model: Equipments,
                as: "equipments",
                attributes: [
                  "id",
                  "name",
                  "unit",
                  "caveragePerUnit",
                  "hireRatePrice",
                  "number",
                ],
                through: {
                  attributes: ["equipmentPerformance", "equipmentTotalAmount"],
                },
              },
              {
                model: Labours,
                as: "labours",
                attributes: [
                  "id",
                  "name",
                  "number",
                  "unit",
                  "caveragePerUnit",
                  "wages",
                ],
                through: {
                  attributes: ["labourFactorQuantity", "labourTotalAmount"],
                },
              },
              {
                model: SubContractors,
                as: "subContractors",
                attributes: ["id", "name", "unit", "quantity", "price"],
                through: {
                  attributes: [
                    "subContractorTotalAmount",
                  ],
                },
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
      });
      return onSuccess(
        res,
        200,
        "All estimation categories retrieved successfully",
        categories
      );
    } catch (error) {
      console.log('error', error)
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // get estimation category by id
  static async getById(req, res) {
    try {
      const category = await EstimationCategory.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Estimations,
            as: "activities",
            include: [
              {
                model: Materials,
                as: "materials",
                attributes: [
                  "name",
                  "quantity",
                  "unit",
                  "caveragePerUnit",
                  "price",
                ],
                through: {
                  attributes: ["materialFactorQuantity", "materialTotalAmount"],
                },
              },
              {
                model: Equipments,
                as: "equipments",
                attributes: [
                  "id",
                  "name",
                  "unit",
                  "caveragePerUnit",
                  "hireRatePrice",
                  "number",
                ],
                through: {
                  attributes: ["equipmentPerformance", "equipmentTotalAmount"],
                },
              },
              {
                model: Labours,
                as: "labours",
                attributes: [
                  "id",
                  "name",
                  "number",
                  "unit",
                  "caveragePerUnit",
                  "wages",
                ],
                through: {
                  attributes: ["labourFactorQuantity", "labourTotalAmount"],
                },
              },
              {
                model: SubContractors,
                as: "subContractors",
                attributes: ["id", "name", "unit", "quantity", "price"],
                through: {
                  attributes: [
                    "subContractorTotalAmount",
                  ],
                },
              },
            ],
          },
        ],
      });
      if (!category) {
        return onError(res, 404, "Estimation category not found");
      }
      return onSuccess(
        res,
        200,
        "Estimation category retrieved successfully",
        category
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // create estimation category
  static async create(req, res) {
    try {
      const category = await EstimationCategory.create({ ...req.body });
      return onSuccess(
        res,
        201,
        "Estimation category created successfully",
        category
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // update estimation category
  static async update(req, res) {
    try {
      const category = await EstimationCategory.findOne({
        where: { id: req.params.id },
      });
      if (!category) {
        return onError(res, 404, "Estimation category not found");
      }
      await category.update({ ...req.body });
      return onSuccess(
        res,
        200,
        "Estimation category updated successfully",
        category
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // delete estimation category
  static async delete(req, res) {
    try {
      const category = await EstimationCategory.findOne({
        where: { id: req.params.id },
      });
      if (!category) {
        return onError(res, 404, "Estimation category not found");
      }
      await category.destroy();
      return onSuccess(res, 200, "Estimation category deleted successfully");
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
}
export default EstimationCategoryController;

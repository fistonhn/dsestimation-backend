import {
  UserEstimationCategory,
  EstimationCategory,
  UserEstimations,
  UserMaterials,
  UserEquipments,
  UserLabours,
  UserSubContractors,
  Estimations,
} from "../../database/models";
import { onError, onSuccess } from "../../utils/response";

class UserEstimationCategoryController {
  // get all estimation categories
  static async getAll(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const categories = await UserEstimationCategory.findAll({
        where: { userId: managerId ? managerId : userId, projectId: null },
        order: [["id", "ASC"]],
        include: [
          {
            model: UserEstimations,
            as: "activities",
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
                as: "subContractors",
                attributes: ["id", "name", "unit", "quantity", "price"],
                through: {
                  attributes: ["subContractorTotalAmount"],
                },
              },
            ],
          },
        ],
      });
      return onSuccess(
        res,
        200,
        "All estimation categories retrieved successfully",
        categories
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // get estimation category by id
  static async getById(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const category = await UserEstimationCategory.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserEstimations,
            as: "activities",
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
      const { id: userId, role, managerId } = req.user;
      if(role === 'manager' || role === 'admin'){
      const category = await UserEstimationCategory.create({
        ...req.body,
        userId: managerId ? managerId : userId,
      });
      await EstimationCategory.create({
        ...req.body,
        userId: managerId ? managerId : userId,
        isApproved: false,
      });
      return onSuccess(
        res,
        201,
        "Estimation category created successfully",
        category
      );
      }
      const category = await EstimationCategory.create({
        ...req.body,
      });
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
      const { id: userId, role } = req.user;
      if(role === 'manager' || role === 'admin'){
          const category = await UserEstimationCategory.findOne({
            where: { id: req.params.id, userId: managerId ? managerId : userId },
          });
          if (!category) {
            return onError(res, 404, "Estimation category not found");
          }

          category.update({ ...req.body });

          return onSuccess(
            res,
            200,
            "Estimation category updated successfully",
            category
          );
      }

      const category = await EstimationCategory.findOne({
        where: { id: req.params.id },
      });

      if (!category) {
        return onError(res, 404, "Estimation category not found");
      }

      category.update({ ...req.body });

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
      const { id: userId, role } = req.user;
      if(role === 'manager' || role === 'admin'){
      const category = await UserEstimationCategory.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
      });
      if (!category) {
        return onError(res, 404, "Estimation category not found");
      }
      await category.destroy();
      return onSuccess(
        res,
        200,
        "Estimation category deleted successfully",
        category
      );
      }
      const category = await EstimationCategory.findOne({
        where: { id: req.params.id},
      });
      if (!category) {
        return onError(res, 404, "Estimation category not found");
      }
      await category.destroy();
      return onSuccess(
        res,
        200,
        "Estimation category deleted successfully",
        category
      );

    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
}

export default UserEstimationCategoryController;

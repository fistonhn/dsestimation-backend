import {
  UserMaterials,
  Materials,
  UserEstimationLibrary,
} from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class UserMaterialsController {
  // Get all materials
  static async getAllMaterials(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const materials = await UserMaterials.findAll({
        where: { userId: managerId ? managerId : userId },
        include: [
          {
            model: UserEstimationLibrary,
            as: "material_calculation",
            attributes: ["materialFactorQuantity", "materialTotalAmount"],
          },
        ],
      });
      return onSuccess(res, 200, "Materials retrieved successfully", materials);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // Get material by id
  static async getMaterialById(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const material = await UserMaterials.findOne({
        where: {
          id: req.params.id,
          userId: managerId ? managerId : userId,
        },
        include: [
          {
            model: UserEstimationLibrary,
            as: "material_calculation",
            attributes: ["materialFactorQuantity", "materialTotalAmount"],
          },
        ],
      });
      return onSuccess(res, 200, "Material retrieved successfully", material);
    } catch (error) {
      return onError(res, 500, "Internal Server Error".error.message);
    }
  }

  // Create material
  static async createMaterial(req, res) {
    try {
      const { id: userId, role, managerId } = req.user;

      if (role === "manager" || role === "admin") {
        // find if material already exists
        const material = await Materials.findOne({
          where: { name: req.body.name },
        });
        if (material) {
          return onError(
            res,
            409,
            "Material already exists in our data store, please use the existing material"
          );
        }
        // find if user_material already exists
        const userMaterial = await UserMaterials.findOne({
          where: {
            name: req.body.name,
            userId: managerId ? managerId : userId,
          },
        });
        if (userMaterial) {
          return onError(
            res,
            409,
            "Material already exists in your data store"
          );
        }
        const createdMaterial = await UserMaterials.create({
          ...req.body,
          userId: managerId ? managerId : userId,
        });
        await Materials.create({
          ...req.body,
          userId: managerId ? managerId : userId,
          isApproved: false,
        });

        return onSuccess(
          res,
          201,
          "Material created successfully",
          createdMaterial
        );
      }
      const material = await Materials.findOne({
        where: { name: req.body.name },
      });
      if (material) {
        return onError(
          res,
          409,
          "Material already exists in our data store, please use the existing material"
        );
      }
      const createdMaterial = await Materials.create({
        ...req.body,
      });
      return onSuccess(
        res,
        201,
        "Material created successfully",
        createdMaterial
      );
    } catch (error) {
      console.log("create material error", error);
      return onError(res, 500, "Internal Server Error");
    }
  }

  // Update material
  static async updateMaterial(req, res) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const material = await UserMaterials.findOne({ where: { id, userId } });
      await material.update({ ...req.body });

      return onSuccess(res, 200, "Material updated successfully", material);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // Delete material
  static async deleteMaterial(req, res) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const material = await UserMaterials.findOne({ where: { id, userId } });
      await material.destroy();
      return onSuccess(res, 200, "Material deleted successfully", material);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }
}
export default UserMaterialsController;

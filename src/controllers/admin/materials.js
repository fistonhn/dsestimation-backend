import { Materials } from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class MaterialsController {
  // Get all materials
  static async getAllMaterials(req, res) {
    try {
      const materials = await Materials.findAll();
      if (materials.length === 0) {
        return onError(res, 404, "You have no materials");
      }
      return onSuccess(res, 200, "Materials retrieved successfully", materials);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // Get material by id
  static async getMaterialById(req, res) {
    try {
      const material = await Materials.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!material) {
        return onError(res, 404, "Material not found");
      }
      return onSuccess(res, 200, "Material retrieved successfully", material);
    } catch (error) {
      return onError(res, 500, "Internal Server Error".error.message);
    }
  }

  // Create material
  static async createMaterial(req, res) {
    try {
      const material = await Materials.create({
        ...req.body,
      });
      return onSuccess(res, 201, "Material created successfully", material);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // Update material
  static async updateMaterial(req, res) {
    try {
      const { id } = req.params;
      const material = await Materials.findOne({ where: { id } });
      await material.update({ ...req.body });

      return onSuccess(res, 200, "Material updated successfully", material);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // Delete material
  static async deleteMaterial(req, res) {
    try {
      const { id } = req.params;
      const material = await Materials.findOne({ where: { id } });
      await material.destroy();
      return onSuccess(res, 200, "Material deleted successfully", material);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }
}
export default MaterialsController;

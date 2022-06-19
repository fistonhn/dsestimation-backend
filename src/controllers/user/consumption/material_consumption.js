import {
  UserMaterials,
  UserMaterialConsumption,
  UserEstimationLibrary,
  UserEstimationsConsumption,
} from "../../../database/models";
import { onSuccess, onError } from "../../../utils/response";

class MaterialConsumptionController {
  // create material consumption
  static async createMaterialConsumption(req, res) {
    try {
      // consumedQuantity, consumedPrice, consumedDate, materialId, percentage
      const {
        consumedQuantity,
        consumedPrice,
        consumedDate,
        materialId,
        name,
        unit,
        estimationId,
      } = req.body;
      if (materialId) {
        const material = await UserMaterials.findOne({
          where: { id: materialId },
          include: [
            {
              model: UserEstimationLibrary,
              as: "material_calculation",
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          ],
        });
        if (!material) {
          return onError(res, 404, "material not found");
        }
        const estimation = await UserEstimationsConsumption.findOne({
          where: { id: estimationId },
        });
        if (!estimation) {
          return onError(res, 404, "consumed estimation not found");
        }

        const consumedTotal = consumedQuantity * consumedPrice;
        const percentage = consumedTotal / material.materialTotalAmount;

        const materialConsumption = await UserMaterialConsumption.create({
          consumedQuantity,
          consumedPrice,
          consumedDate,
          materialId,
          estimationId,
          consumedTotal: consumedTotal.toFixed(2),
          percentage: percentage.toFixed(2),
        });

        // calculate sum
        const totalMaterialConsumed = await UserMaterialConsumption.sum(
          "consumedTotal",
          {
            where: { estimationId },
          }
        );

        await estimation.update({
          totalMaterialConsumed: totalMaterialConsumed.toFixed(2),
        });

        return onSuccess(
          res,
          201,
          "material consumption created successfully",
          materialConsumption
        );
      }

      const estimationConsumed = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimationConsumed) {
        return onError(res, 404, "consumed estimation not found");
      }

      const consumedTotal = consumedQuantity * consumedPrice;

      const materialConsumption = await UserMaterialConsumption.create({
        name,
        unit,
        estimationId,
        consumedQuantity,
        consumedPrice,
        consumedDate,
        materialId,
        consumedTotal: consumedTotal.toFixed(2),
        percentage: 0,
      });

      // calculate sum
      const totalMaterialConsumed = await UserMaterialConsumption.sum(
        "consumedTotal",
        {
          where: { estimationId },
        }
      );

      await estimationConsumed.update({
        totalMaterialConsumed: totalMaterialConsumed.toFixed(2),
      });

      return onSuccess(
        res,
        201,
        "material consumption created successfully",
        materialConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // edit material consumption
  static async editMaterialConsumption(req, res) {
    try {
      const { id } = req.params;
      const {
        consumedQuantity,
        consumedPrice,
        consumedDate,
        materialId,
        name,
        unit,
        estimationId,
      } = req.body;

      if (materialId) {
        const material = await UserMaterials.findOne({
          where: { id: materialId },
          include: [
            {
              model: UserEstimationLibrary,
              as: "material_calculation",
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          ],
        });
        if (!material) {
          return onError(res, 404, "material not found");
        }
        const estimation = await UserEstimationsConsumption.findOne({
          where: { id: estimationId },
        });
        if (!estimation) {
          return onError(res, 404, "consumed estimation not found");
        }
        const materialConsumption = await UserMaterialConsumption.findOne({
          where: { id },
        });
        if (!materialConsumption) {
          return onError(res, 404, "material consumption not found");
        }

        const consumedQty = consumedQuantity
          ? consumedQuantity
          : materialConsumption.consumedQuantity;
        const consumedPrc = consumedPrice
          ? consumedPrice
          : materialConsumption.consumedPrice;
        const consumedDte = consumedDate
          ? consumedDate
          : materialConsumption.consumedDate;
        const consumedTot = consumedQuantity * consumedPrice;
        const percentage =
          consumedTot / material.material_calculation.materialTotalAmount;

        await materialConsumption.update({
          consumedQuantity: consumedQty,
          consumedPrice: consumedPrc,
          consumedDate: consumedDte,
          consumedTotal: consumedTot.toFixed(2),
          percentage: percentage.toFixed(2),
        });

        const updated = await materialConsumption.reload();
        // calculate sum
        const totalMaterialConsumed = await UserMaterialConsumption.sum(
          "consumedTotal",
          {
            where: { estimationId },
          }
        );

        await estimation.update({
          totalMaterialConsumed: totalMaterialConsumed.toFixed(2),
        });
        return onSuccess(
          res,
          200,
          "material consumption updated successfully",
          updated
        );
      }
      const estimation = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "consumed estimation not found");
      }

      const materialConsumption = await UserMaterialConsumption.findOne({
        where: { id },
      });
      if (!materialConsumption) {
        return onError(res, 404, "material consumption not found");
      }

      const consumedQty = consumedQuantity
        ? consumedQuantity
        : materialConsumption.consumedQuantity;
      const consumedPrc = consumedPrice
        ? consumedPrice
        : materialConsumption.consumedPrice;
      const consumedDte = consumedDate
        ? consumedDate
        : materialConsumption.consumedDate;
      const consumedTot = consumedQuantity * consumedPrice;
      const editName = name ? name : materialConsumption.name;
      const unitName = unit ? unit : materialConsumption.unit;

      await materialConsumption.update({
        consumedQuantity: consumedQty,
        consumedPrice: consumedPrc,
        consumedDate: consumedDte,
        consumedTotal: consumedTot.toFixed(2),
        name: editName,
        unit: unitName,
      });

      const updated = await materialConsumption.reload();
      // calculate sum
      const totalMaterialConsumed = await UserMaterialConsumption.sum(
        "consumedTotal",
        {
          where: { estimationId },
        }
      );

      await estimation.update({
        totalMaterialConsumed: totalMaterialConsumed.toFixed(2),
      });
      return onSuccess(
        res,
        200,
        "material consumption updated successfully",
        updated
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // delete material consumption
  static async deleteMaterialConsumption(req, res) {
    try {
      const { id } = req.params;
      const { estimationId } = req.body;
      const materialConsumption = await UserMaterialConsumption.findOne({
        where: { id },
      });
      const estimation = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "consumed estimation not found");
      }
      if (!materialConsumption) {
        return onError(res, 404, "material consumption not found");
      }

      await materialConsumption.destroy();
      // calculate sum
      const totalMaterialConsumed = await UserMaterialConsumption.sum(
        "consumedTotal",
        {
          where: { estimationId },
        }
      );

      await estimation.update({
        totalMaterialConsumed: totalMaterialConsumed.toFixed(2),
      });
      return onSuccess(
        res,
        200,
        "material consumption deleted successfully",
        materialConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // get all material consumption
  static async getAllMaterialConsumption(req, res) {
    try {
      const materialConsumption = await UserMaterialConsumption.findAll({
        include: [
          {
            model: UserMaterials,
            as: "consumed_material",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            include: [
              {
                model: UserEstimationLibrary,
                as: "material_calculation",
                attributes: ["materialFactorQuantity", "materialTotalAmount"],
              },
            ],
          },
        ],
      });
      return onSuccess(
        res,
        "material consumption fetched successfully",
        materialConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // get material consumption by id
  static async getMaterialConsumptionById(req, res) {
    try {
      const { id } = req.params;
      const materialConsumption = await UserMaterialConsumption.findOne({
        where: { id },
        include: [
          {
            model: UserMaterials,
            as: "consumed_material",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            include: [
              {
                model: UserEstimationLibrary,
                as: "material_calculation",
                attributes: ["materialFactorQuantity", "materialTotalAmount"],
              },
            ],
          },
        ],
      });
      if (!materialConsumption) {
        return onError(res, 404, "material consumption not found");
      }
      return onSuccess(
        res,
        "material consumption fetched successfully",
        materialConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }
}

export default MaterialConsumptionController;

import {
  UserEstimations,
  UserEstimationsConsumption,
  UserEquipmentConsumption,
  UserLabourConsumption,
  UserMaterialConsumption,
  UserSubcontractorConsumption,
} from "../../../database/models";
import { onSuccess, onError } from "../../../utils/response";

class EstimationConsumptionController {
  // create estimation consumption
  static async createEstimationConsumption(req, res) {
    try {
      // executedQuantity, estimationId
      const { executedQuantity, estimationId, executedDate } = req.body;
      const estimation = await UserEstimations.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "estimation not found");
      }

      const remainingQuantity =
        +estimation.estimationQuantity - executedQuantity;
      const percentage = +estimation.estimationQuantity / executedQuantity;

      const estimationConsumption = await UserEstimationsConsumption.create({
        executedQuantity,
        estimationId,
        remainingQuantity: remainingQuantity.toFixed(2),
        percentage: percentage.toFixed(2),
        executedDate,
      });

      return onSuccess(
        res,
        201,
        "estimation consumption created successfully",
        estimationConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // Update estimation consumption
  static async editEstimationConsumption(req, res) {
    try {
      const { id } = req.params;
      const { executedQuantity, estimationId, executedDate } = req.body;

      const estimation = await UserEstimations.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "estimation not found");
      }
      const estimationConsumption = await UserEstimationsConsumption.findOne({
        where: { id },
      });
      if (!estimationConsumption) {
        return onError(res, 404, "estimation consumption not found");
      }

      const executedQty = executedQuantity
        ? executedQuantity
        : +estimationConsumption.executedQuantity;

      const remainingQuantity = +estimation.estimationQuantity - executedQty;
      const percentage = +estimation.estimationQuantity / executedQty;
      const excDate = executedDate
        ? executedDate
        : estimationConsumption?.executedDate;

      await estimationConsumption.update({
        executedQuantity: executedQty,
        estimationId,
        remainingQuantity: remainingQuantity.toFixed(2),
        percentage: percentage.toFixed(2),
        executedDate: excDate,
      });

      const updated = await estimationConsumption.reload();

      return onSuccess(
        res,
        200,
        "estimation consumption updated successfully",
        updated
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // Delete estimation consumption
  static async deleteEstimationConsumption(req, res) {
    try {
      const { id } = req.params;
      const estimationConsumption = await UserEstimationsConsumption.findOne({
        where: { id },
      });
      if (!estimationConsumption) {
        return onError(res, 404, "estimation consumption not found");
      }
      await estimationConsumption.destroy();
      return onSuccess(
        res,
        200,
        "estimation consumption deleted successfully",
        estimationConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // Get estimation consumption
  static async getEstimationConsumption(req, res) {
    try {
      const { id } = req.params;
      const estimationConsumption = await UserEstimationsConsumption.findOne({
        where: { id },
        include: [
          {
            model: UserEstimations,
            as: "consumed_estimation",
            attributes: ["id", "name", "estimationRate", "estimationQuantity"],
          },
          {
            model: UserEquipmentConsumption,
            as: "consumed_equipment",
          },
          {
            model: UserLabourConsumption,
            as: "consumed_labour",
          },
          {
            model: UserMaterialConsumption,
            as: "consumed_material",
          },
          {
            model: UserSubcontractorConsumption,
            as: "consumed_subcontractor",
          },
        ],
      });
      if (!estimationConsumption) {
        return onError(res, 404, "estimation consumption not found");
      }

      return onSuccess(
        res,
        200,
        "estimation consumption found",
        estimationConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // get all estimation consumption
  static async getAllEstimationConsumption(req, res) {
    try {
      const estimationConsumption = await UserEstimationsConsumption.findAll({
        include: [
          {
            model: UserEstimations,
            as: "consumed_estimation",
            attributes: ["id", "name", "estimationRate", "estimationQuantity"],
          },
          {
            model: UserEquipmentConsumption,
            as: 'consumed_equipment'
          },
          {
            model: UserLabourConsumption,
            as: 'consumed_labour'
          },
          {
            model: UserMaterialConsumption,
            as: 'consumed_material'
          },
          {
            model: UserSubcontractorConsumption,
            as: 'consumed_subcontractor'
          }
        ],
      });

      return onSuccess(
        res,
        200,
        "estimation consumption retrieved",
        estimationConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }
}

export default EstimationConsumptionController;

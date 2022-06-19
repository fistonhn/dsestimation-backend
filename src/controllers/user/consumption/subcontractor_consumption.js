import {
  UserSubContractors,
  UserSubcontractorConsumption,
  UserEstimationLibrary,
  UserEstimationsConsumption,
} from "../../../database/models";
import { onSuccess, onError } from "../../../utils/response";

class SubcontractorConsumptionController {
  // create subcontractor consumption
  static async createSubcontractorConsumption(req, res) {
    try {
      // consumedQuantity, consumedPrice, consumedDate, subcontractorId, percentage
      const {
        consumedQuantity,
        consumedPrice,
        consumedDate,
        subcontractorId,
        name,
        unit,
        estimationId,
      } = req.body;

      if (subcontractorId) {
        const subcontractor = await UserSubContractors.findOne({
          where: { id: subcontractorId },
          include: [
            {
              model: UserEstimationLibrary,
              as: "subcontractor_calculation",
              attributes: ["subContractorTotalAmount"],
            },
          ],
        });
        if (!subcontractor) {
          return onError(res, 404, "subcontractor not found");
        }
        const estimation = await UserEstimationsConsumption.findOne({
          where: { id: estimationId },
        });
        if (!estimation) {
          return onError(res, 404, "consumed estimation not found");
        }

        const consumedTotal = consumedQuantity * consumedPrice;
        const percentage =
          consumedTotal / subcontractor.subContractorTotalAmount;

        const subcontractorConsumption =
          await UserSubcontractorConsumption.create({
            consumedQuantity,
            consumedPrice,
            consumedDate,
            estimationId,
            subContractorId: subcontractorId,
            consumedTotal: consumedTotal.toFixed(2),
            percentage: percentage.toFixed(2),
          });

        // calculate sum
        const totalSubcontractorConsumed =
          await UserSubcontractorConsumption.sum("consumedTotal", {
            where: {
              estimationId,
            },
          });
        await estimation.update({
          totalSubcontractorConsumed: totalSubcontractorConsumed.toFixed(2),
        });

        return onSuccess(
          res,
          201,
          "subcontractor consumption created successfully",
          subcontractorConsumption
        );
      }

      const estimation = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "consumed estimation not found");
      }

      const consumedTotal = consumedQuantity * consumedPrice;

      const subcontractorConsumption =
        await UserSubcontractorConsumption.create({
          name,
          unit,
          estimationId,
          consumedQuantity,
          consumedPrice,
          consumedDate,
          consumedTotal: consumedTotal.toFixed(2),
          percentage: 0,
        });

      // calculate sum
      const totalSubcontractorConsumed = await UserSubcontractorConsumption.sum(
        "consumedTotal",
        {
          where: {
            estimationId,
          },
        }
      );
      await estimation.update({
        totalSubcontractorConsumed: totalSubcontractorConsumed.toFixed(2),
      });

      return onSuccess(
        res,
        201,
        "subcontractor consumption created successfully",
        subcontractorConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // edit subcontractor consumption
  static async editSubcontractorConsumption(req, res) {
    try {
      const { id } = req.params;
      const {
        consumedQuantity,
        consumedPrice,
        consumedDate,
        subContractorId,
        name,
        unit,
        estimationId,
      } = req.body;
      if (subContractorId) {
        const subcontractor = await UserSubContractors.findOne({
          where: { id: subContractorId },
          include: [
            {
              model: UserEstimationLibrary,
              as: "subcontractor_calculation",
              attributes: ["subContractorTotalAmount"],
            },
          ],
        });
        if (!subcontractor) {
          return onError(res, 404, "subcontractor not found");
        }
        const estimation = await UserEstimationsConsumption.findOne({
          where: { id: estimationId },
        });
        if (!estimation) {
          return onError(res, 404, "consumed estimation not found");
        }

        const subcontractorConsumption =
          await UserSubcontractorConsumption.findOne({ where: { id } });
        if (!subcontractorConsumption) {
          return onError(res, 404, "subcontractor consumption not found");
        }

        const consumedQty = consumedQuantity
          ? consumedQuantity
          : subcontractorConsumption.consumedQuantity;
        const consumedPrc = consumedPrice
          ? consumedPrice
          : subcontractorConsumption.consumedPrice;
        const consumedDte = consumedDate
          ? consumedDate
          : subcontractorConsumption.consumedDate;
        const consumedTot = consumedQuantity * consumedPrice;
        const percentage =
          consumedTot /
          subcontractor.subcontractor_calculation.subContractorTotalAmount;

        await subcontractorConsumption.update({
          consumedQuantity: consumedQty,
          consumedPrice: consumedPrc,
          consumedDate: consumedDte,
          subContractorId: subContractorId,
          consumedTotal: consumedTot.toFixed(2),
          percentage: percentage.toFixed(2),
        });

        const updated = await subcontractorConsumption.reload();

        // calculate sum
        const totalSubcontractorConsumed =
          await UserSubcontractorConsumption.sum("consumedTotal", {
            where: {
              estimationId,
            },
          });
        await estimation.update({
          totalSubcontractorConsumed: totalSubcontractorConsumed.toFixed(2),
        });

        return onSuccess(
          res,
          "subcontractor consumption updated successfully",
          updated
        );
      }

      // update subcontractor consumption
      const estimation = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "consumed estimation not found");
      }

      const subcontractorConsumption =
        await UserSubcontractorConsumption.findOne({ where: { id } });
      if (!subcontractorConsumption) {
        return onError(res, 404, "subcontractor consumption not found");
      }

      const consumedQty = consumedQuantity
        ? consumedQuantity
        : subcontractorConsumption.consumedQuantity;
      const consumedPrc = consumedPrice
        ? consumedPrice
        : subcontractorConsumption.consumedPrice;
      const consumedDte = consumedDate
        ? consumedDate
        : subcontractorConsumption.consumedDate;
      const consumedTot = consumedQuantity * consumedPrice;
      const editName = name ? name : subcontractorConsumption.name;
      const unitName = unit ? unit : subcontractorConsumption.unit;

      await subcontractorConsumption.update({
        consumedQuantity: consumedQty,
        consumedPrice: consumedPrc,
        consumedDate: consumedDte,
        subContractorId: subContractorId,
        consumedTotal: consumedTot.toFixed(2),
        name: editName,
        unit: unitName,
      });

      const updated = await subcontractorConsumption.reload();

      // calculate sum
      const totalSubcontractorConsumed = await UserSubcontractorConsumption.sum(
        "consumedTotal",
        {
          where: {
            estimationId,
          },
        }
      );
      await estimation.update({
        totalSubcontractorConsumed: totalSubcontractorConsumed.toFixed(2),
      });

      return onSuccess(
        res,
        "subcontractor consumption updated successfully",
        updated
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // delete subcontractor consumption
  static async deleteSubcontractorConsumption(req, res) {
    try {
      const { id } = req.params;
      const { estimationId } = req.body;

      const estimation = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "consumed estimation not found");
      }

      const subcontractorConsumption =
        await UserSubcontractorConsumption.findOne({ where: { id } });
      if (!subcontractorConsumption) {
        return onError(res, 404, "subcontractor consumption not found");
      }

      await subcontractorConsumption.destroy();

      // calculate sum
      const totalSubcontractorConsumed = await UserSubcontractorConsumption.sum(
        "consumedTotal",
        {
          where: {
            estimationId,
          },
        }
      );
      await estimation.update({
        totalSubcontractorConsumed: totalSubcontractorConsumed.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "subcontractor consumption deleted successfully",
        subcontractorConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // get all subcontractor consumptions
  static async getAllSubcontractorConsumption(req, res) {
    try {
      const subcontractorConsumptions =
        await UserSubcontractorConsumption.findAll({
          include: [
            {
              model: UserSubContractors,
              as: "consumed_subcontractor",
              attributes: ["id", "name", "unit", "quantity", "price"],
              include: [
                {
                  model: UserEstimationLibrary,
                  as: "subcontractor_calculation",
                  attributes: ["subContractorTotalAmount"],
                },
              ],
            },
          ],
        });

      return (
        res,
        200,
        "subcontractor consumption retrieved successfully",
        subcontractorConsumptions
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // get subcontractor consumption by id
  static async getSubcontractorConsumptionById(req, res) {
    try {
      const { id } = req.params;
      const subcontractorConsumption =
        await UserSubcontractorConsumption.findOne({
          where: { id },
          include: [
            {
              model: UserSubContractors,
              as: "consumed_subcontractor",
              attributes: ["id", "name", "unit", "quantity", "price"],
              include: [
                {
                  model: UserEstimationLibrary,
                  as: "subcontractor_calculation",
                  attributes: ["subContractorTotalAmount"],
                },
              ],
            },
          ],
        });
      if (!subcontractorConsumption) {
        return onError(res, 404, "subcontractor consumption not found");
      }
      return onSuccess(
        res,
        200,
        "subcontractor consumption retrieved successfully",
        subcontractorConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }
}

export default SubcontractorConsumptionController;

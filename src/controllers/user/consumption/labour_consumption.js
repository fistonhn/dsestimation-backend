import {
  UserLabours,
  UserLabourConsumption,
  UserEstimationLibrary,
  UserEstimationsConsumption,
} from "../../../database/models";
import { onSuccess, onError } from "../../../utils/response";

class LabourConsumptionController {
  // create labour consumption
  static async createLabourConsumption(req, res) {
    try {
      // consumedQuantity, consumedPrice, consumedDate, labourId, percentage
      const {
        consumedQuantity,
        consumedPrice,
        consumedDate,
        labourId,
        estimationId,
        name,
        unit,
      } = req.body;

      if (labourId) {
        const labour = await UserLabours.findOne({
          where: { id: labourId },
          include: [
            {
              model: UserEstimationLibrary,
              as: "labour_calculation",
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          ],
        });
        if (!labour) {
          return onError(res, 404, "labour not found");
        }
        const estimation = await UserEstimationsConsumption.findOne({
          where: { id: estimationId },
        });
        if (!estimation) {
          return onError(res, 404, "consumed estimation not found");
        }

        const consumedTotal = consumedQuantity * consumedPrice;
        const percentage =
          consumedTotal / labour.labour_calculation.labourTotalAmount;

        const labourConsumption = await UserLabourConsumption.create({
          consumedQuantity,
          consumedPrice,
          consumedDate,
          labourId,
          estimationId,
          consumedTotal: consumedTotal.toFixed(2),
          percentage: percentage.toFixed(2),
        });

        const totalLabourConsumed = await UserLabourConsumption.sum(
          "consumedTotal",
          {
            where: { estimationId },
          }
        );
        await estimationConsumed.update({
          totalLabourConsumed: totalLabourConsumed.toFixed(2),
        });

        return onSuccess(
          res,
          201,
          "labour consumption created successfully",
          labourConsumption
        );
      }
      const estimationConsumed = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimationConsumed) {
        return onError(res, 404, "consumed estimation not found");
      }

      const consumedTotal = consumedQuantity * consumedPrice;

      const labourConsumption = await UserLabourConsumption.create({
        name,
        unit,
        estimationId,
        consumedQuantity,
        consumedPrice,
        consumedDate,
        labourId,
        consumedTotal: consumedTotal.toFixed(2),
        percentage: 0,
      });
      // calculate the sum of consumedTotal insite UserLabourConsumption and add it value totalLabourConsumed of UserEstimationsConsumption

      const totalLabourConsumed = await UserLabourConsumption.sum(
        "consumedTotal",
        {
          where: { estimationId },
        }
      );
      await estimationConsumed.update({
        totalLabourConsumed: totalLabourConsumed.toFixed(2),
      });

      return onSuccess(
        res,
        201,
        "labour consumption created successfully",
        labourConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // edit equipment consumption
  static async editLabourConsumption(req, res) {
    try {
      const { id } = req.params;
      const {
        consumedQuantity,
        consumedPrice,
        consumedDate,
        labourId,
        name,
        unit,
        estimationId,
      } = req.body;

      if (labourId) {
        const labour = await UserLabours.findOne({
          where: { id: labourId },
          include: [
            {
              model: UserEstimationLibrary,
              as: "labour_calculation",
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          ],
        });
        if (!labour) {
          return onError(res, 404, "labour not found");
        }

        const estimation = await UserEstimationsConsumption.findOne({
          where: { id: estimationId },
        });
        if (!estimation) {
          return onError(res, 404, "consumed estimation not found");
        }

        const labourConsumption = await UserLabourConsumption.findOne({
          where: { id, estimationId },
        });

        if (!labourConsumption) {
          return onError(res, 404, "labour consumption not found");
        }

        const consumedQty = consumedQuantity
          ? consumedQuantity
          : labourConsumption.consumedQuantity;
        const consumedPrc = consumedPrice
          ? consumedPrice
          : labourConsumption.consumedPrice;
        const consumedDt = consumedDate
          ? consumedDate
          : labourConsumption.consumedDate;
        const consumedTot = consumedQty * consumedPrc;
        const percentage =
          consumedTot / labour.labour_calculation.labourTotalAmount;

        await labourConsumption.update({
          consumedQuantity: consumedQty,
          consumedPrice: consumedPrc,
          consumedDate: consumedDt,
          consumedTotal: consumedTot.toFixed(2),
          percentage: percentage.toFixed(2),
        });

        const updatedConsumption = await labourConsumption.reload();

        const totalLabourConsumed = await UserLabourConsumption.sum(
          "consumedTotal",
          {
            where: { estimationId },
          }
        );
        await estimation.update({
          totalLabourConsumed: totalLabourConsumed.toFixed(2),
        });

        return onSuccess(
          res,
          200,
          "labour consumption updated successfully",
          updatedConsumption
        );
      }
      // created labour consumption
      const estimation = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "consumed estimation not found");
      }

      const labourConsumption = await UserLabourConsumption.findOne({
        where: { id, estimationId },
      });

      if (!labourConsumption) {
        return onError(res, 404, "labour consumption not found");
      }

      const consumedQty = consumedQuantity
        ? consumedQuantity
        : labourConsumption.consumedQuantity;
      const consumedPrc = consumedPrice
        ? consumedPrice
        : labourConsumption.consumedPrice;
      const consumedDt = consumedDate
        ? consumedDate
        : labourConsumption.consumedDate;
      const consumedTot = consumedQty * consumedPrc;
      const labourName = name ? name : labourConsumption.name;
      const unitName = unit ? unit : labourConsumption.unit;

      await labourConsumption.update({
        consumedQuantity: consumedQty,
        consumedPrice: consumedPrc,
        consumedDate: consumedDt,
        consumedTotal: consumedTot.toFixed(2),
        name: labourName,
        unit: unitName,
      });

      const updatedConsumption = await labourConsumption.reload();

      const totalLabourConsumed = await UserLabourConsumption.sum(
        "consumedTotal",
        {
          where: { estimationId },
        }
      );
      await estimation.update({
        totalLabourConsumed: totalLabourConsumed.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "labour consumption updated successfully",
        updatedConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // delete equipment consumption
  static async deleteLabourConsumption(req, res) {
    try {
      const { id } = req.params;
      const { estimationId } = req.body;
      const estimation = await UserEstimationsConsumption.findOne({
        where: { id: estimationId },
      });
      if (!estimation) {
        return onError(res, 404, "consumed estimation not found");
      }
      const labourConsumption = await UserLabourConsumption.findOne({
        where: { id, estimationId: estimation.id },
      });
      if (!labourConsumption) {
        return onError(res, 404, "labour consumption not found");
      }
      await labourConsumption.destroy();

      const totalLabourConsumed = await UserLabourConsumption.sum(
        "consumedTotal",
        {
          where: { estimationId },
        }
      );
      await estimation.update({
        totalLabourConsumed: totalLabourConsumed.toFixed(2),
      });
      return onSuccess(
        res,
        200,
        "Labour consumption deleted successfully",
        labourConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // get all equipment consumption
  static async getAllLabourConsumption(req, res) {
    try {
      const labourConsumption = await UserLabourConsumption.findAll({
        include: [
          {
            model: UserLabours,
            as: "consumed_labour",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            include: [
              {
                model: UserEstimationLibrary,
                as: "labour_calculation",
                attributes: ["labourFactorQuantity", "labourTotalAmount"],
              },
            ],
          },
        ],
      });
      return onSuccess(
        res,
        "Labour consumption fetched successfully",
        labourConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }

  // get equipment consumption by id
  static async getLabourConsumptionById(req, res) {
    try {
      const { id } = req.params;
      const labourConsumption = await UserLabourConsumption.findOne({
        where: { id },
        include: [
          {
            model: UserLabours,
            as: "consumed_labour",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            include: [
              {
                model: UserEstimationLibrary,
                as: "labour_calculation",
                attributes: ["labourFactorQuantity", "labourTotalAmount"],
              },
            ],
          },
        ],
      });
      if (!labourConsumption) {
        return onError(res, 404, "labour consumption not found");
      }
      return onSuccess(
        res,
        "Labour consumption fetched successfully",
        labourConsumption
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error);
    }
  }
}

export default LabourConsumptionController;

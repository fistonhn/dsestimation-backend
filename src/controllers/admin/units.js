import { Units } from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class UnitsController {
  // get all units
  static async getAllUnits(req, res) {
    try {
      const units = await Units.findAll();
      if (units.length === 0) {
        return onError(res, 404, "You have no units");
      }
      return onSuccess(res, 200, "Units retrieved successfully", units);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // get unit by id
  static async getUnitById(req, res) {
    try {
      const unit = await Units.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!unit) {
        return onError(res, 404, "Unit not found");
      }
      return onSuccess(res, 200, "Unit retrieved successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // create new unit
  static async createUnit(req, res) {
    try {
      const unit = await Units.create({
        ...req.body,
      });
      return onSuccess(res, 201, "Unit created successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // update unit
  static async updateUnit(req, res) {
    try {
      const { id } = req.params;
      const unit = await Units.findOne({ where: { id } });
      await unit.update({ ...req.body });
      return onSuccess(res, 200, "Unit updated successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // delete unit
  static async deleteUnit(req, res) {
    try {
      const { id } = req.params;
      const unit = await Units.findOne({ where: { id } });
      await unit.destroy();
      return onSuccess(res, 200, "Unit deleted successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }
}

export default UnitsController;

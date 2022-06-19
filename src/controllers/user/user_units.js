import { UserUnits, Units } from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class UserUnitsController {
  // get all units
  static async getAllUnits(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const units = await UserUnits.findAll({
        where: { userId: managerId ? managerId : userId },
      });
      return onSuccess(res, 200, "Units retrieved successfully", units);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // get unit by id
  static async getUnitById(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const unit = await UserUnits.findOne({
        where: {
          id: req.params.id,
          userId: managerId ? managerId : userId,
        },
      });
      return onSuccess(res, 200, "Unit retrieved successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // create new unit
  static async createUnit(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const unit = await UserUnits.create({
        ...req.body,
        userId: managerId ? managerId : userId,
      });
      await Units.create({
        ...req.body,
        userId: managerId ? managerId : userId,
        isApproved: false,
      });

      return onSuccess(res, 201, "Unit created successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // update unit
  static async updateUnit(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const { id } = req.params;
      const unit = await UserUnits.findOne({ where: { id, userId: managerId ? managerId : userId } });
      return onSuccess(res, 200, "Unit updated successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // delete unit
  static async deleteUnit(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const { id } = req.params;
      const unit = await UserUnits.findOne({ where: { id, userId: managerId ? managerId : userId } });
      await unit.destroy();
      return onSuccess(res, 200, "Unit deleted successfully", unit);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }
}

export default UserUnitsController;

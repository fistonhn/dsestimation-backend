import {
  UserLabours,
  Labours,
  UserEstimationLibrary,
} from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class UserLabourController {
  // Get all labours
  static async getAllLabour(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const labours = await UserLabours.findAll({
        where: { userId: managerId ? managerId : userId },
        include: [
          {
            model: UserEstimationLibrary,
            as: "labour_calculation",
            attributes: ["labourFactorQuantity", "labourTotalAmount"],
          },
        ],
      });
      return onSuccess(res, 200, "Labours retrieved successfully", labours);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }

  // get labour by id
  static async getLabourById(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, managerId } = req.user;
      const labour = await UserLabours.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserEstimationLibrary,
            as: "labour_calculation",
            attributes: ["labourFactorQuantity", "labourTotalAmount"],
          },
        ],
      });
      return onSuccess(res, 200, "Labour retrieved successfully", labour);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }

  // create labour
  static async createLabour(req, res) {
    try {
      const { id: userId, role, managerId } = req.user;
      if (role === "manager" || role === "admin") {
        // find if labour already exists
        const labourExist = await UserLabours.findOne({
          where: {
            userId: managerId ? managerId : userId,
            name: req.body.name,
          },
        });
        if (labourExist) {
          return onError(res, 400, "Labour already exists in your data store");
        }

        const ourLabour = await Labours.findOne({
          where: { name: req.body.name },
        });
        if (ourLabour) {
          return onError(
            res,
            409,
            "Labour already exists in our data store, please use the existing labour"
          );
        }

        const labour = await UserLabours.create({
          ...req.body,
          userId: managerId ? managerId : userId,
        });

        await Labours.create({
          ...req.body,
          userId: managerId ? managerId : userId,
          isApproved: false,
        });
        return onSuccess(res, 201, "Labour created successfully", labour);
      }
      const ourLabour = await Labours.findOne({
        where: { name: req.body.name },
      });
      if (ourLabour) {
        return onError(
          res,
          409,
          "Labour already exists in our data store, please use the existing labour"
        );
      }
      const labour = await Labours.create({
        ...req.body,
      });
      return onSuccess(res, 201, "Labour created successfully", labour);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }

  // update labour
  static async updateLabour(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, managerId } = req.user;
      const labour = await UserLabours.findOne({
        where: { id, userId: managerId ? managerId : userId },
      });
      await labour.update({ ...req.body });
      return onSuccess(res, 200, "Labour updated successfully", labour);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }

  // delete labour

  static async deleteLabour(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, managerId } = req.user;
      const labour = await UserLabours.findOne({
        where: { id, userId: managerId ? managerId : userId },
      });
      await labour.destroy();

      return onSuccess(res, 200, "Labour deleted successfully", labour);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }
}
export default UserLabourController;

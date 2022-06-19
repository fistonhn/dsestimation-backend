import {
  UserSubContractors,
  SubContractors,
  UserEstimationLibrary,
} from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class UserSubContractorsController {
  // get all sub contractors
  static async getAllSubContractors(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const subContractors = await UserSubContractors.findAll({
        where: { userId: managerId ? managerId : userId },
        include: [
          {
            model: UserEstimationLibrary,
            as: "subcontractor_calculation",
            attributes: ["subContractorTotalAmount"],
          },
        ],
      });
      return onSuccess(
        res,
        200,
        "All Sub Contractors retrieved successfully",
        subContractors
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // get a sub contractor by id
  static async getSubContractorById(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const subContractor = await UserSubContractors.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserEstimationLibrary,
            as: "subcontractor_calculation",
            attributes: ["subContractorTotalAmount"],
          },
        ],
      });

      return onSuccess(
        res,
        200,
        "Sub Contractor retrieved successfully",
        subContractor
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // create a sub contractor
  static async createSubContractor(req, res) {
    try {
      const { id: userId, role, managerId } = req.user;
      if (role === "manager" || role === "admin") {
        const subContractor = await UserSubContractors.create({
          ...req.body,
          userId: managerId ? managerId : userId,
        });

        await SubContractors.create({
          ...req.body,
          userId: managerId ? managerId : userId,
          isApproved: false,
        });
        return onSuccess(
          res,
          201,
          "Sub Contractor created successfully",
          subContractor
        );
      }

      const subContractor = await SubContractors.create({ ...req.body });
      return onSuccess(
        res,
        201,
        "Sub Contractor created successfully",
        subContractor
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // update a sub contractor
  static async updateSubContractor(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const { id } = req.params;
      const subContractor = await UserSubContractors.findOne({
        where: { id, userId: managerId ? managerId : userId },
      });
      await subContractor.update({ ...req.body });
      return onSuccess(
        res,
        200,
        "Sub Contractor updated successfully",
        subContractor
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // delete a sub contractor
  static async deleteSubContractor(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const { id } = req.params;
      const subContractor = await UserSubContractors.findOne({
        where: { id, userId: managerId ? managerId : userId },
      });
      await subContractor.destroy();
      return onSuccess(
        res,
        200,
        "Sub Contractor deleted successfully",
        subContractor
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
}
export default UserSubContractorsController;

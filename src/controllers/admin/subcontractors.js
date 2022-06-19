import { SubContractors } from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class SubContractorsController {
  // get all sub contractors
  static async getAllSubContractors(req, res) {
    try {
      const subContractors = await SubContractors.findAll();
      if (subContractors.length === 0) {
        return onError(res, 404, "You have no sub contractors");
      }
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
      const subContractor = await SubContractors.findOne({
        where: { id: req.params.id },
      });
      if (!subContractor) {
        return onError(res, 404, "Sub Contractor not found");
      }
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
      const { id } = req.params;
      const subContractor = await SubContractors.findOne({ where: { id } });
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
      const { id } = req.params;
      const subContractor = await SubContractors.findOne({ where: { id } });
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
export default SubContractorsController;

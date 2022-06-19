import { Labours } from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class LabourController {
  // Get all labours
  static async getAllLabour(req, res) {
    try {
      const labours = await Labours.findAll();
      if (labours.length === 0) {
        return onError(res, 404, "You have no labours");
      }
      return onSuccess(res, 200, "Labours retrieved successfully", labours);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }

  // get labour by id
  static async getLabourById(req, res) {
    try {
      const labour = await Labours.findOne({
        where: { id: req.params.id },
      });
      if (!labour) {
        return onError(res, 404, "Labour not found");
      }
      return onSuccess(res, 200, "Labour retrieved successfully", labour);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }

  // create labour
  static async createLabour(req, res) {
    try {
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
      const labour = await Labours.findOne({
        where: { id },
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
      const labour = await Labours.findOne({ where: { id } });
      await labour.destroy();
      return onSuccess(res, 200, "Labour deleted successfully", labour);
    } catch (error) {
      return onError(res, 500, "Internal  Server Error", error.message);
    }
  }
}
export default LabourController;

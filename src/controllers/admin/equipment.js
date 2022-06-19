import { Equipments } from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class EquipmentController {
  // get all equipments
  static async getAllEquipments(req, res) {
    try {
      const equipments = await Equipments.findAll();
      if (equipments.length === 0) {
        return onError(res, 404, "You have no equipments");
      }
      return onSuccess(
        res,
        200,
        "Equipments Retrieved Successfully",
        equipments
      );
    } catch (error) {
      return onError(res, 500, error);
    }
  }

  // get equipment by id
  static async getEquipmentById(req, res) {
    try {
      const { id } = req.params;
      const equipment = await Equipments.findOne({
        where: { id },
      });
      if (!equipment) {
        return onError(res, 404, "Equipment not found");
      }
      return onSuccess(res, 200, "Equipment Retrieved Successfully", equipment);
    } catch (error) {
      return onError(res, 500, error);
    }
  }

  // create equipment
  static async createEquipment(req, res) {
    try {
      const equipment = await Equipments.create({
        ...req.body,
      });

      return onSuccess(res, 201, "Equipment Created Successfully", equipment);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // update equipment
  static async updateEquipment(req, res) {
    try {
      const { id } = req.params;
      const equipment = await Equipments.findOne({
        where: { id },
      });
      await equipment.update({ ...req.body });

      return onSuccess(res, 200, "Equipment Updated Successfully", equipment);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // delete equipment
  static async deleteEquipment(req, res) {
    try {
      const { id } = req.params;

      const equipment = await Equipments.findOne({
        where: { id },
      });
      await equipment.destroy();

      return onSuccess(res, 200, "Equipment Deleted Successfully", equipment);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
}
export default EquipmentController;

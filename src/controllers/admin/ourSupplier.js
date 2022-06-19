import {
  Suppliers,
  Equipments,
  Materials,
  Users,
} from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class SuppliersController {
  // get all suppliers
  static async getAllSuppliers(req, res) {
    try {
      const suppliers = await Suppliers.findAll({
        include: [
          {
            model: Equipments,
            as: "supplied_equipments",
            attributes: [
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
              "isApproved",
            ],
          },
          {
            model: Materials,
            as: "supplied_materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
              "isApproved",
            ],
          },
          {
            model: Users,
            as: "client-suppliers",
            attributes: ["name"],
          },
        ],
      });
      return onSuccess(res, 200, "Suppliers retrieved successfully", suppliers);
    } catch (error) {
      console.log(error);
      return onError(res, 500, "Internal Server Error");
    }
  }

  // get a supplier
  static async getSupplierById(req, res) {
    try {
      const { id: supplierId } = req.params;
      const supplier = await Suppliers.findOne({
        where: {
          id: supplierId,
        },
        include: [
          {
            model: Equipments,
            as: "supplied_equipments",
            attributes: [
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
              "isApproved",
            ],
          },
          {
            model: Materials,
            as: "supplied_materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
              "isApproved",
            ],
          },
        ],
      });
      return onSuccess(res, 200, "Supplier retrieved successfully", supplier);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // create a supplier
  static async createSupplier(req, res) {
    try {
      const supplier = await Suppliers.create({
        ...req.body,
      });
      return onSuccess(res, 201, "Supplier created successfully", supplier);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // update a supplier
  static async updateSupplier(req, res) {
    try {
      const { id: supplierId } = req.params;
      const supplier = await Suppliers.findOne({ where: { id: supplierId } });
      await supplier.update({ ...req.body });
      return onSuccess(res, 200, "Supplier updated successfully", supplier);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  static async deleteSupplier(req, res) {
    try {
      const { id: supplierId } = req.params;
      const supplier = await Suppliers.findOne({ where: { id: supplierId } });
      await supplier.destroy();
      return onSuccess(res, 200, "Supplier deleted successfully", supplier);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
}
export default SuppliersController;

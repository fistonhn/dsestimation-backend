import {
  UserSupplier,
  Suppliers,
  UserEquipments,
  UserMaterials,
  Projects,
  Users,
} from "../../database/models";
import { onSuccess, onError } from "../../utils/response";

class SuppliersController {
  // get all supplier
  static async getAllSuppliers(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const suppliers = await UserSupplier.findAll({
        where: {
          userId: managerId ? managerId : userId,
        },
        include: [
          {
            model: Projects,
            as: "projects",
            attributes: ["name", "description"],
          },
          {
            model: UserEquipments,
            as: "supplied_equipments",
            attributes: [
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
          },
          {
            model: UserMaterials,
            as: "supplied_materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
          },
        ],
      });
      return onSuccess(res, 200, "Suppliers retrieved successfully", suppliers);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // get a supplier
  static async getSupplierById(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const { id: supplierId } = req.params;
      const supplier = await UserSupplier.findOne({
        where: {
          id: supplierId,
          userId: managerId ? managerId : userId,
        },
        include: [
          {
            model: Projects,
            as: "projects",
            attributes: ["name", "description"],
          },
          {
            model: UserEquipments,
            as: "supplied_equipments",
            attributes: [
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
          },
          {
            model: UserMaterials,
            as: "supplied_materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
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
      const { id: userId, role, managerId } = req.user;

      if(role === "manager" || role ==='admin') {
      const { projectId } = req.body;
      const supplier = await UserSupplier.create({
        ...req.body,
        projectId,
        userId: managerId ? managerId : userId,
      });

      await Suppliers.create({
        ...req.body,
        userId: managerId ? managerId : userId,
        isApproved: false,
      });

      return onSuccess(res, 201, "Supplier created successfully", supplier);
    }
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
      const { id: userId, managerId } = req.user;
      const { id: supplierId } = req.params;
      const supplier = await UserSupplier.findOne({
        where: { id: supplierId, userId: managerId ? managerId : userId },
      });
      await supplier.update({ ...req.body });
      return onSuccess(res, 200, "Supplier updated successfully", supplier);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  static async deleteSupplier(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const { id: supplierId } = req.params;
      const supplier = await UserSupplier.findOne({
        where: { id: supplierId, userId: managerId ? managerId : userId },
      });
      await supplier.destroy();
      return onSuccess(res, 200, "Supplier deleted successfully", supplier);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
}

export default SuppliersController;

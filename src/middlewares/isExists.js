import {
  Units,
  Materials,
  Users,
  Staffs,
  UserMaterials,
  UserUnits,
  UserLabours,
  UserSubContractors,
  UserEquipments,
  UserEstimations,
  Estimations,
  Projects,
} from "../database/models";
import { onError } from "../utils/response";

class Exists {
  // check if unit exists
  static async isUnitExists(req, res, next) {
    const unit = await Units.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!unit) {
      return onError(res, 404, "Unit not found");
    }
    next();
  }

  // check if material exists
  static async isMaterialExists(req, res, next) {
    const material = await Materials.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!material) {
      return onError(res, 404, "Material not found");
    }
    next();
  }

  // check if there is data in the database
  static async isDataExistsInUnits(req, res, next) {
    const unit = await Units.findAll();
    if (unit.length === 0) {
      return onError(res, 404, "No data in the database");
    }
    next();
  }

  static async isDataExistsInMaterial(req, res, next) {
    const material = await Materials.findAll();
    if (material.length === 0) {
      return onError(res, 404, "No data in the database");
    }
    next();
  }

  // check if user exists
  static async isUserExists(req, res, next) {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    const staff = await Staffs.findOne({ where: { managerId: req.params.id } });
    if (!user && !staff) {
      return onError(res, 404, "User not found");
    }
    next();
  }

  // is owner
  static async isOwner(req, res, next) {
    const { role } = req.user;
    if (role !== "owner") {
      return onError(res, 403, "You are not authorized");
    }
    next();
  }

  // usermaterials
  static async isUserMaterialExists(req, res, next) {
    const material = await UserMaterials.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!material) {
      return onError(res, 404, "Material not found");
    }
    next();
  }

  // userunits
  static async isUserUnitExists(req, res, next) {
    const unit = await UserUnits.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!unit) {
      return onError(res, 404, "Unit not found");
    }
    next();
  }

  // userlabours
  static async isUserLabourExists(req, res, next) {
    const labour = await UserLabours.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!labour) {
      return onError(res, 404, "Labour not found");
    }
    next();
  }

  // usersubcontractors
  static async isUserSubContractorExists(req, res, next) {
    const subContractor = await UserSubContractors.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!subContractor) {
      return onError(res, 404, "SubContractor not found");
    }
    next();
  }

  // userequipments
  static async isUserEquipmentExists(req, res, next) {
    const equipment = await UserEquipments.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!equipment) {
      return onError(res, 404, "Equipment not found");
    }
    next();
  }

  // userestimations
  static async isUserEstimationExists(req, res, next) {
    const estimation = await UserEstimations.findOne({
      where: {
        id: req.params.id,
      },
    });
    const defaultEstimation = await Estimations.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!estimation && !defaultEstimation) {
      return onError(res, 404, "Estimation not found");
    }
    next();
  }

  // projects
  static async isProjectExists(req, res, next) {
    const { id: userId, managerId } = req.user;
    const project = await Projects.findOne({
      where: {
        id: req.params.id,
        userId: managerId ? managerId : userId
      },
    });
    if (!project) {
      return onError(res, 404, "Project not found");
    }
    next();
  }
  // projects with estimation
  static async isProjectExistsWithEstimation(req, res, next) {
    const { id: userId, managerId } = req.user;
    const project = await Projects.findOne({
      where: {
        id: req.params.projectId,
        userId: managerId ? managerId : userId
      },
    });
    if (!project) {
      return onError(res, 404, "Project not found");
    }
    next();
  }

  // isProject Approved
  static async isProjectApproved(req, res, next) {
    const { id: userId, managerId } = req.user;
    const project = await Projects.findOne({
      where: {
        id: req.params.id,
        userId: managerId ? managerId : userId
      },
    });
    const {isApproved} = project
    if (isApproved) {
      return onError(res, 404, "Project is already approved, edit disabled!");
    }
    next();
  }
  // isProject Approved
  static async isProjectAlreadyApproved(req, res, next) {
    const { id: userId, managerId } = req.user;
    const project = await Projects.findOne({
      where: {
        id: req.params.projectId,
        userId: managerId ? managerId : userId
      },
    });
    const isApproved = project?.isApproved;
    if (isApproved) {
      return onError(res, 404, "Project is already approved, edit disabled!");
    }
    next();
  }
}
export default Exists;

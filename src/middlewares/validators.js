import { onError } from "../utils/response";
import {
  validateMaterial,
  validateEquipment,
  validateLabour,
  validateSubContractor,
  validateSupplier,
  validateUnit,
  validateCreateEstimation,
  validateUserLogin,
  validateUserRegister,
  validateEmail,
  validateProject,
  validateEquipmentConsumption,
  validateMaterialConsumption,
  validateLabourConsumption,
  validateSubContractorConsumption,
  validateEstimationConsumption,
} from "../validators";

class Validators {
  // validate material
  static isMaterialValid(req, res, next) {
    const { error } = validateMaterial(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  // validate unit
  static isUnitValid(req, res, next) {
    const { error } = validateUnit(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  static isEquipmentValid(req, res, next) {
    const { error } = validateEquipment(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  static isLabourInputValid(req, res, next) {
    const { error } = validateLabour(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  static isSubContractorInputValid(req, res, next) {
    const { error } = validateSubContractor(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  static isSupplierInputValid(req, res, next) {
    const { error } = validateSupplier(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  // validate estimation CREATE
  static isEstimationCreateValid(req, res, next) {
    const { error } = validateCreateEstimation(req.body);
    if (error) {
      return onError(res, 400, error.message);
    }
    next();
  }

  // validate user login
  static isLoginInputValid(req, res, next) {
    const { error } = validateUserLogin(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  // validate user register
  static isUserRegisterValid(req, res, next) {
    const { error } = validateUserRegister(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  // validate email
  static validateForgotPasswordEmail(req, res, next) {
    const { error } = validateEmail(req.body);
    if (error) return onError(res, 400, error.details[0].message);
    next();
  }

  // validate project input
  static isProjectInputValid(req, res, next) {
    const { error } = validateProject(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  // consumption validation
  static isEquipmentConsumptionValid(req, res, next) {
    const { error } = validateEquipmentConsumption(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  static isMaterialConsumptionValid(req, res, next) {
    const { error } = validateMaterialConsumption(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  static isLabourConsumptionValid(req, res, next) {
    const { error } = validateLabourConsumption(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }

  static isSubcontractorConsumptionValid(req, res, next) {
    const { error } = validateSubContractorConsumption(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }
  static isEstimationConsumptionValid(req, res, next) {
    const { error } = validateEstimationConsumption(req.body);
    if (error) {
      return onError(res, 400, error.details[0].message);
    }
    next();
  }
}
export default Validators;

import validateMaterial from "./materials";
import validateEquipment from "./equipment";
import validateUnit from "./unit";
import validateLabour from "./labour";
import validateSubContractor from "./subcontractor";
import validateSupplier from "./supplier";
import {
  validateCreateEstimation,
  validateUpdateEstimation,
  validateEstimationEquipmentEdit,
} from "./estimation";
import { validateUserLogin, validateUserRegister, validateEmail } from "./user";
import validateProject from "./projects";
import {
  validateIdParamas,
  validateProjectIdParamas,
  validateSupplierIdParamas,
} from "./validateIds";

// consumption validation
import validateEquipmentConsumption from "./equipment_consumption";
import validateMaterialConsumption from "./material_consumption";
import validateLabourConsumption from "./labour_consumption";
import validateSubContractorConsumption from "./subcontractor_consumption";
import validateEstimationConsumption from "./estimation_consumption";

export {
  validateMaterial,
  validateUnit,
  validateCreateEstimation,
  validateUpdateEstimation,
  validateUserLogin,
  validateUserRegister,
  validateEmail,
  validateProject,
  validateIdParamas,
  validateProjectIdParamas,
  validateEstimationEquipmentEdit,
  validateEquipment,
  validateLabour,
  validateSubContractor,
  validateSupplier,
  validateSupplierIdParamas,
  // consumption validation
  validateEquipmentConsumption,
  validateMaterialConsumption,
  validateLabourConsumption,
  validateSubContractorConsumption,
  validateEstimationConsumption,
};

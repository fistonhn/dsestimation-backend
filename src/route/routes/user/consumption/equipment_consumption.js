import express from "express";
const router = express.Router();

import { EquipmentConsumptionController } from "../../../../controllers";
import {
  verifyAccessToken,
  ValidateParams,
  Validators,
} from "../../../../middlewares";

// get all equipment consumption
router.get(
  "/all",
  verifyAccessToken,
  EquipmentConsumptionController.getAllEquipmentConsumption
);

// get equipment consumption by id
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EquipmentConsumptionController.getEquipmentConsumptionById
);

// create equipment consumption
router.post(
  "/create",
  verifyAccessToken,
  Validators.isEquipmentConsumptionValid,
  EquipmentConsumptionController.createEquipmentConsumption
);

// update equipment consumption
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EquipmentConsumptionController.editEquipmentConsumption
);

router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EquipmentConsumptionController.deleteEquipmentConsumption
);

export default router;

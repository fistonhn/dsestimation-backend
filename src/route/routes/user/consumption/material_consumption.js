import express from "express";
const router = express.Router();

import { MaterialConsumptionController } from "../../../../controllers";
import {
  verifyAccessToken,
  ValidateParams,
  Validators,
} from "../../../../middlewares";

// get all material consumption
router.get(
  "/all",
  verifyAccessToken,
  MaterialConsumptionController.getAllMaterialConsumption
);

// get material consumption by id
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  MaterialConsumptionController.getMaterialConsumptionById
);

// create material consumption
router.post(
  "/create",
  verifyAccessToken,
  Validators.isMaterialConsumptionValid,
  MaterialConsumptionController.createMaterialConsumption
);

// update material consumption
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  MaterialConsumptionController.editMaterialConsumption
);

// delete material consumption
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  MaterialConsumptionController.deleteMaterialConsumption
);

export default router;

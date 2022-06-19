import express from "express";
const router = express.Router();

import { LabourConsumptionController } from "../../../../controllers";
import {
  verifyAccessToken,
  ValidateParams,
  Validators,
} from "../../../../middlewares";

// get all labour consumption
router.get(
  "/all",
  verifyAccessToken,
  LabourConsumptionController.getAllLabourConsumption
);

// get labour consumption by id
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  LabourConsumptionController.getLabourConsumptionById
);

// create labour consumption
router.post(
  "/create",
  verifyAccessToken,
  Validators.isLabourConsumptionValid,
  LabourConsumptionController.createLabourConsumption
);

// update labour consumption
router.patch(
  "/:id/update",
  verifyAccessToken,
  Validators.isLabourConsumptionValid,
  LabourConsumptionController.editLabourConsumption
);

// delete labour consumption
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  LabourConsumptionController.deleteLabourConsumption
);

export default router;

import express from "express";
const router = express.Router();

import { EstimationConsumptionController } from "../../../../controllers";
import {
  verifyAccessToken,
  ValidateParams,
  Validators,
} from "../../../../middlewares";

// get all Estimation consumption
router.get(
  "/all",
  verifyAccessToken,
  EstimationConsumptionController.getAllEstimationConsumption
);

// get estimation consumption by id
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationConsumptionController.getEstimationConsumption
);

// create estimation consumption
router.post(
  "/create",
  verifyAccessToken,
  Validators.isEstimationConsumptionValid,
  EstimationConsumptionController.createEstimationConsumption
);

// update estimation consumption
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationConsumptionController.editEstimationConsumption
);

router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationConsumptionController.deleteEstimationConsumption
);

export default router;

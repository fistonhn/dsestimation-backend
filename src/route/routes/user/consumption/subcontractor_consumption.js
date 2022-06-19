import express from "express";
const router = express.Router();

import { SubContractorsConsumptionController } from "../../../../controllers";
import {
  verifyAccessToken,
  ValidateParams,
  Validators,
} from "../../../../middlewares";

// get all subcontractor consumption
router.get(
  "/all",
  verifyAccessToken,
  SubContractorsConsumptionController.getAllSubcontractorConsumption
);

// get subcontractor consumption by id
router.get(
  ":id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  SubContractorsConsumptionController.getSubcontractorConsumptionById
);

// create subcontractor consumption
router.post(
  "/create",
  verifyAccessToken,
  Validators.isSubcontractorConsumptionValid,
  SubContractorsConsumptionController.createSubcontractorConsumption
);

// update subcontractor consumption
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  SubContractorsConsumptionController.editSubcontractorConsumption
);

// delete subcontractor consumption
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  SubContractorsConsumptionController.deleteSubcontractorConsumption
);

export default router;

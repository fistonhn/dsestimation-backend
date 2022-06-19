import express from "express";
const router = express.Router();
import { UserEstimationController } from "../../../controllers";
import {
  verifyAccessToken,
  Exists,
  ValidateParams,
  Validators,
} from "../../../middlewares";

// routes
router.get(
  "/all",
  verifyAccessToken,
  UserEstimationController.getAllEstimations
);
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.getEstimationById
);
router.post(
  "/create",
  verifyAccessToken,
  Validators.isEstimationCreateValid,
  UserEstimationController.createEstimation
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.updateEstimation
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.deleteEstimation
);
router.patch(
  "/:id/duplicate",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  UserEstimationController.copyEstimation
);

// equipments
router.patch(
  "/:id/equipment/add",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.addEquipmentToEstimation
);
router.patch(
  "/:id/equipment/remove",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.removeEquipmentFromEstimation
);
router.patch(
  "/:id/equipment/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.editEstimationEquipment
);

// materials
router.patch(
  "/:id/material/add",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.addMaterialToEstimation
);
router.patch(
  "/:id/material/remove",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.removeMaterialFromEstimation
);
router.patch(
  "/:id/material/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.editEstimationMaterials
);

// labor
router.patch(
  "/:id/labour/add",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.addLabourToEstimation
);
router.patch(
  "/:id/labour/remove",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.removeLabourFromEstimation
);
router.patch(
  "/:id/labour/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.editLabourEstimation
);

// subcontractors
router.patch(
  "/:id/subcontractor/add",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.addSubcontractorToEstimation
);
router.patch(
  "/:id/subcontractor/remove",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.removeSubcontractorFromEstimation
);
router.patch(
  "/:id/subcontractor/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEstimationExists,
  UserEstimationController.editSubcontractorEstimation
);

export default router;

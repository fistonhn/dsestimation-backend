import express from "express";
const router = express.Router();
import { EstimationController } from "../../../controllers";
import {
  Role,
  verifyAccessToken,
  ValidateParams,
  Validators,
} from "../../../middlewares";

router.get(
  "/unverified/all",
  verifyAccessToken,
  Role.isOwner,
  EstimationController.getAllUnverifiedEstimations
);

router.post(
  "/create",
  verifyAccessToken,
  Validators.isEstimationCreateValid,
  Role.isOwner,
  EstimationController.createEstimation
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  EstimationController.updateEstimation
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  EstimationController.deleteEstimation
);

// equipments
router.patch(
  "/:id/add-equipment",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  EstimationController.addEquipmentToEstimation
);
router.patch(
  "/:id/remove-equipment",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  EstimationController.removeEquipmentFromEstimation
);
router.patch(
  "/:id/equipment/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.editEstimationEquipment
);

// materials
router.patch(
  "/:id/material/add",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.addMaterialToEstimation
);
router.patch(
  "/:id/material/remove",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.removeMaterialFromEstimation
);
router.patch(
  "/:id/material/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  // Validators.isEstimationEquipmentEditValid,
  EstimationController.editEstimationMaterials
);

// labor
router.patch(
  "/:id/labour/add",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.addLabourToEstimation
);
router.patch(
  "/:id/labour/remove",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.removeLabourFromEstimation
);
router.patch(
  "/:id/labour/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  // Validators.isEstimationEquipmentEditValid,
  EstimationController.editLabourEstimation
);

// subcontractors
router.patch(
  "/:id/subcontractor/add",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.addSubcontractorToEstimation
);
router.patch(
  "/:id/subcontractor/remove",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.removeSubcontractorFromEstimation
);
router.patch(
  "/:id/subcontractor/edit",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  // Validators.isEstimationEquipmentEditValid,
  EstimationController.editSubcontractorEstimation
);

export default router;

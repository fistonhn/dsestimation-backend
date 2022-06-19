import express from "express";
const router = express.Router();

import { EquipmentController } from "../../../controllers";
import { Role, verifyAccessToken, ValidateParams } from "../../../middlewares";

// routes
router.post(
  "/create",
  verifyAccessToken,
  Role.isOwner,
  EquipmentController.createEquipment
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  EquipmentController.updateEquipment
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  EquipmentController.deleteEquipment
);

export default router;

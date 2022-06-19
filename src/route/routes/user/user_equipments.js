import express from "express";
const router = express.Router();

import { UserEquipmentController } from "../../../controllers";
import {
  verifyAccessToken,
  Exists,
  ValidateParams,
  Validators
} from "../../../middlewares";

// routes
router.get("/all", verifyAccessToken, UserEquipmentController.getAllEquipments);
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEquipmentExists,
  UserEquipmentController.getEquipmentById
);
router.post(
  "/create",
  verifyAccessToken,
  Validators.isEquipmentValid,
  UserEquipmentController.createEquipment
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEquipmentExists,
  UserEquipmentController.updateEquipment
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserEquipmentExists,
  UserEquipmentController.deleteEquipment
);

export default router;

import express from "express";
const router = express.Router();
import { MaterialsController } from "../../../controllers";
import {
  Exists,
  Validators,
  Role,
  verifyAccessToken,
  ValidateParams,
} from "../../../middlewares";

// routes

router.post(
  "/create",
  verifyAccessToken,
  Role.isOwner,
  Validators.isMaterialValid,
  MaterialsController.createMaterial
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  Exists.isMaterialExists,
  MaterialsController.updateMaterial
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  Exists.isMaterialExists,
  MaterialsController.deleteMaterial
);

export default router;

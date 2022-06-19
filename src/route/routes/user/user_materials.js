import express from "express";
const router = express.Router();
import { UserMaterialController } from "../../../controllers";
import {
  Exists,
  Validators,
  verifyAccessToken,
  ValidateParams,
} from "../../../middlewares";

// routes

router.get("/all", verifyAccessToken, UserMaterialController.getAllMaterials);

router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserMaterialExists,
  UserMaterialController.getMaterialById
);
router.post(
  "/create",
  verifyAccessToken,
  Validators.isMaterialValid,
  UserMaterialController.createMaterial
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserMaterialExists,
  UserMaterialController.updateMaterial
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserMaterialExists,
  UserMaterialController.deleteMaterial
);

export default router;

import express from "express";
const router = express.Router();
import { UnitsController } from "../../../controllers";
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
  Validators.isUnitValid,
  UnitsController.createUnit
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  Exists.isUnitExists,
  UnitsController.updateUnit
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  Exists.isUnitExists,
  UnitsController.deleteUnit
);

export default router;

import express from "express";
const router = express.Router();
import { UserUnitsController } from "../../../controllers";
import {
  Exists,
  Validators,
  verifyAccessToken,
  ValidateParams,
} from "../../../middlewares";

// routes
router.get("/all", verifyAccessToken, UserUnitsController.getAllUnits);
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserUnitExists,
  UserUnitsController.getUnitById
);
router.post(
  "/create",
  verifyAccessToken,
  Validators.isUnitValid,
  UserUnitsController.createUnit
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserUnitExists,
  UserUnitsController.updateUnit
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserUnitExists,
  UserUnitsController.deleteUnit
);

export default router;

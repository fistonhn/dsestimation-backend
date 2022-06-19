import express from "express";
const router = express.Router();

import { UserSuppliersController } from "../../../controllers";
import { verifyAccessToken, Validators, ValidateParams } from "../../../middlewares";

// routes
router.get("/all", verifyAccessToken, UserSuppliersController.getAllSuppliers);
router.get("/:id", verifyAccessToken, ValidateParams.isIdPresentAndValid, UserSuppliersController.getSupplierById);
router.post(
  "/create",
  verifyAccessToken,
  Validators.isSupplierInputValid,
  UserSuppliersController.createSupplier
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  UserSuppliersController.updateSupplier
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  UserSuppliersController.deleteSupplier
);

export default router;

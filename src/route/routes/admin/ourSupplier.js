import express from "express";
const router = express.Router();

import { OurSuppliersController } from "../../../controllers";
import { verifyAccessToken, ValidateParams, Role } from "../../../middlewares";

router.post(
  "/create",
  verifyAccessToken,
  Role.isOwner,
  OurSuppliersController.createSupplier
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  OurSuppliersController.updateSupplier
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  OurSuppliersController.deleteSupplier
);

export default router;

import express from "express";
const router = express.Router();
import { LabourController } from "../../../controllers";
import { Role, verifyAccessToken, ValidateParams } from "../../../middlewares";

// routes

router.post(
  "/create",
  verifyAccessToken,
  Role.isOwner,
  LabourController.createLabour
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  LabourController.updateLabour
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  LabourController.deleteLabour
);

export default router;

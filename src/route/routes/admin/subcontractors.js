import express from "express";
const router = express.Router();
import { SubContractorsController } from "../../../controllers";
import { Role, verifyAccessToken, ValidateParams } from "../../../middlewares";

// routes

router.post(
  "/create",
  verifyAccessToken,
  Role.isOwner,
  SubContractorsController.createSubContractor
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  SubContractorsController.updateSubContractor
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Role.isOwner,
  SubContractorsController.deleteSubContractor
);

export default router;

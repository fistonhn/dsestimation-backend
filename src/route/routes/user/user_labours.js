import express from "express";
const router = express.Router();
import { UserLabourController } from "../../../controllers";
import {
  verifyAccessToken,
  Exists,
  ValidateParams,
  Validators
} from "../../../middlewares";

// routes
router.get("/all", verifyAccessToken, UserLabourController.getAllLabour);
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserLabourExists,
  UserLabourController.getLabourById
);
router.post("/create", verifyAccessToken, Validators.isLabourInputValid, UserLabourController.createLabour);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserLabourExists,
  UserLabourController.updateLabour
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserLabourExists,
  UserLabourController.deleteLabour
);

export default router;

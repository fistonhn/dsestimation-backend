import express from "express";
const router = express.Router();
import { UserEstimationCategoryController } from "../../../controllers";
import { verifyAccessToken, ValidateParams } from "../../../middlewares";

// routes
router.get("/all", verifyAccessToken, UserEstimationCategoryController.getAll);
router.get(
  "/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  UserEstimationCategoryController.getById
);
router.post(
  "/create",
  verifyAccessToken,
  UserEstimationCategoryController.create
);
router.patch(
  "/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  UserEstimationCategoryController.update
);
router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  UserEstimationCategoryController.delete
);

export default router;

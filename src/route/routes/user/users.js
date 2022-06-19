import express from "express";
const router = express.Router();
import { UserController } from "../../../controllers";
import {
  Validators,
  Exists,
  verifyAccessToken,
  Role,
  ValidateParams,
} from "../../../middlewares";

//routes
router.get("/all", verifyAccessToken, UserController.getAllUsers);
router.get("/profile", verifyAccessToken, UserController.getProfile);
router.get("/:id", verifyAccessToken, ValidateParams.isIdPresentAndValid, Exists.isUserExists, UserController.getUserById);
router.post(
  "/register",
  Validators.isUserRegisterValid,
  UserController.registerUser
);
router.get("/verify/signup", UserController.createUser);
router.get("/staff/accept/verify", UserController.createStaff);
router.post("/login", Validators.isLoginInputValid, UserController.loginUser);
router.delete("/logout", verifyAccessToken, UserController.logoutUser);

router.delete(
  "/account/delete",
  verifyAccessToken,
  UserController.deleteMyAccount
);

router.delete(
  "/:id/delete",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserExists,
  UserController.deleteUser
);

router.patch(
  "/:id/role",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUserExists,
  UserController.changeRole
);

router.patch(
  "/account/:id/activate",
  verifyAccessToken,
  UserController.disableOrEnableUser
);
router.patch(
  "/account/:id/update",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  UserController.updateUser
);

router.patch(
  "/session/:id/renew-token",
  Exists.isUserExists,
  UserController.refreshToken
);

router.post(
  "/forgot-password",
  Validators.validateForgotPasswordEmail,
  UserController.forgotPassword
);

// staff
router.post( "/register/staff", verifyAccessToken, Validators.isUserRegisterValid, UserController.registerStaff);

router.get("/reset-password/url", UserController.getResetPasswordLink);

router.patch("/reset-password/:token/:email", UserController.resetPassword); // backend reset password

export default router;

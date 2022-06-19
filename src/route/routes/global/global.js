import express from "express";
const router = express.Router();

import {
  EquipmentController,
  MaterialsController,
  EstimationController,
  LabourController,
  SubContractorsController,
  UnitsController,
  EstimationCategoryController,
  OurSuppliersController,
} from "../../../controllers";
import {
  verifyAccessToken,
  Exists,
  ValidateParams,
} from "../../../middlewares";

// routes

// equipment

router.get(
  "/equipment/all",
  verifyAccessToken,
  EquipmentController.getAllEquipments
);
router.get(
  "/equipment/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EquipmentController.getEquipmentById
);

// Estimation
router.get(
  "/estimation/all",
  verifyAccessToken,
  EstimationController.getAllEstimations
);
router.get(
  "/estimation/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationController.getEstimationById
);

// labours

router.get("/labour/all", verifyAccessToken, LabourController.getAllLabour);
router.get(
  "/labour/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  LabourController.getLabourById
);

// materials

router.get(
  "/material/all",
  verifyAccessToken,
  Exists.isDataExistsInMaterial,
  MaterialsController.getAllMaterials
);

router.get(
  "/material/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isMaterialExists,
  MaterialsController.getMaterialById
);

// subcontractor

router.get(
  "/subcontractor/all",
  verifyAccessToken,
  SubContractorsController.getAllSubContractors
);
router.get(
  "/subcontractor/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  SubContractorsController.getSubContractorById
);

router.get(
  "/unit/all",
  verifyAccessToken,
  Exists.isDataExistsInUnits,
  UnitsController.getAllUnits
);
router.get(
  "/unit/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  Exists.isUnitExists,
  UnitsController.getUnitById
);

// category
router.get(
  "/estimationCategory/all",
  verifyAccessToken,
  EstimationCategoryController.getAll
);

router.get(
  "/estimationCategory/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  EstimationCategoryController.getById
);

// supplier
// routes
router.get(
  "/supplier/all",
  verifyAccessToken,
  OurSuppliersController.getAllSuppliers
);
router.get(
  "/supplier/:id",
  verifyAccessToken,
  ValidateParams.isIdPresentAndValid,
  OurSuppliersController.getSupplierById
);

export default router;

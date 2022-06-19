// admin
import materialRoutes from "./routes/admin/materials";
import unitRoutes from "./routes/admin/units";
import estimationRoutes from "./routes/admin/estimations";
import equipmentsRoutes from "./routes/admin/equipments";
import labourRoutes from "./routes/admin/labours";
import subcontractorsRoutes from "./routes/admin/subcontractors";
import estimationCategoryRoutes from "./routes/admin/estimationCategory";
import ourSupplierRoutes from "./routes/admin/ourSupplier";

//user
import userRoutes from "./routes/user/users";
import userProjectRoutes from "./routes/user/user_projects";
import userEstimationRoutes from "./routes/user/user_estimations";
import userEquipmentRoutes from "./routes/user/user_equipments";
import userLabourRoutes from "./routes/user/user_labours";
import userSubcontractorRoutes from "./routes/user/user_subcontractors";
import userMaterialRoutes from "./routes/user/user_materials";
import userUnitRoutes from "./routes/user/user_units";
import userSupplierRoutes from "./routes/user/user_suppliers";
import userEstimationCategoryRoutes from "./routes/user/user_estimation_category";

// consumption
import equipmentConsumptionRoutes from "./routes/user/consumption/equipment_consumption";
import materialConsumptionRoutes from "./routes/user/consumption/material_consumption";
import labourConsumptionRoutes from "./routes/user/consumption/labour_consumption";
import subcontractorConsumptionRoutes from "./routes/user/consumption/subcontractor_consumption";
import estimationConsumptionRoutes from "./routes/user/consumption/estimation_consumption";

// global routes

import globalRoutes from "./routes/global/global";

export {
  materialRoutes,
  unitRoutes,
  estimationRoutes,
  equipmentsRoutes,
  labourRoutes,
  subcontractorsRoutes,
  estimationCategoryRoutes,
  ourSupplierRoutes,
  // USER
  userRoutes,
  userProjectRoutes,
  userEstimationRoutes,
  userEquipmentRoutes,
  userLabourRoutes,
  userSubcontractorRoutes,
  userMaterialRoutes,
  userUnitRoutes,
  userSupplierRoutes,
  userEstimationCategoryRoutes,
  // CONSUMPTION
  equipmentConsumptionRoutes,
  materialConsumptionRoutes,
  labourConsumptionRoutes,
  subcontractorConsumptionRoutes,
  estimationConsumptionRoutes,
  // GLOBAL
  globalRoutes,
};

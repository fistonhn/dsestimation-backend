import "babel-polyfill";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import {
  materialRoutes,
  unitRoutes,
  estimationRoutes,
  equipmentsRoutes,
  labourRoutes,
  subcontractorsRoutes,
  estimationCategoryRoutes,
  ourSupplierRoutes,

  // user routes
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

  // consumption
  equipmentConsumptionRoutes,
  materialConsumptionRoutes,
  labourConsumptionRoutes,
  subcontractorConsumptionRoutes,
  estimationConsumptionRoutes,
  // global routes
  globalRoutes,
} from "./route";
import { onError } from "./utils/response";

const app = express();

// middleware
app.use(express.json());
app.use(cors());
dotenv.config();

// documentation
const options = {
  customCss:
    ".swagger-container .swagger-ui { max-width: 1100px; margin: auto; } .swagger-ui .topbar { display: none } .swagger-ui { background: #00000e6; }",
  customSiteTitle: "DS Estimation API",
  customfavIcon: "./assets/favicon.ico",
};

app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(swaggerDocument, options));

// routes

// admin routes
app.use("/api/owner/unit", unitRoutes);
app.use("/api/owner/material", materialRoutes);
app.use("/api/owner/estimation", estimationRoutes);
app.use("/api/owner/equipment", equipmentsRoutes);
app.use("/api/owner/labour", labourRoutes);
app.use("/api/owner/subcontractor", subcontractorsRoutes);
app.use("/api/owner/estimationCategory", estimationCategoryRoutes);
app.use("/api/owner/ourSupplier", ourSupplierRoutes);

// user routes
app.use("/api/user", userRoutes);
app.use("/api/user/estimation", userEstimationRoutes);
app.use("/api/user/unit", userUnitRoutes);
app.use("/api/user/material", userMaterialRoutes);
app.use("/api/user/equipment", userEquipmentRoutes);
app.use("/api/user/labour", userLabourRoutes);
app.use("/api/user/subcontractor", userSubcontractorRoutes);
app.use("/api/user/project", userProjectRoutes);
app.use("/api/user/supplier", userSupplierRoutes);
app.use("/api/user/estimationCategory", userEstimationCategoryRoutes);

// consumption routes
app.use("/api/consumption/report/equipment", equipmentConsumptionRoutes);
app.use("/api/consumption/report/material", materialConsumptionRoutes);
app.use("/api/consumption/report/labour", labourConsumptionRoutes);
app.use(
  "/api/consumption/report/subcontractor",
  subcontractorConsumptionRoutes
);
app.use("/api/consumption/report/estimation", estimationConsumptionRoutes);

// global routes
app.use("/api/global", globalRoutes);
// 404 error routes
app.get("*", (req, res) => {
  return onError(res, 404, "Page not found");
});
app.post("*", (req, res) => {
  return onError(res, 404, "Page not found");
});
app.delete("*", (req, res) => {
  return onError(res, 404, "Page not found");
});
app.patch("*", (req, res) => {
  return onError(res, 404, "Page not found");
});
app.put("*", (req, res) => {
  return onError(res, 404, "Page not found");
});

export default app;

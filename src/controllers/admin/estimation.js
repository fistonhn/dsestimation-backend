import {
  Materials,
  Estimations,
  Labours,
  SubContractors,
  EstimationLibrary,
  Equipments,
  EstimationCategory,
} from "../../database/models";
import { onError, onSuccess } from "../../utils/response";

class EstimationController {
  // get all estimations
  static async getAllEstimations(req, res) {
    try {
      // find all estimations include Materials , Units and exclude EstimationLibrary
      const estimations = await Estimations.findAll({
        where: {isApproved: true },
        include: [
          {
            model: EstimationCategory,
            as: "category",
            attributes: ["name"],
          },
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return onSuccess(
        res,
        200,
        "estimations returned successfully",
        estimations
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async getAllUnverifiedEstimations(req, res) {
    try {
      // find all estimations include Materials , Units and exclude EstimationLibrary
      const estimations = await Estimations.findAll({
        where: {isApproved: false},
        include: [
          {
            model: EstimationCategory,
            as: "category",
            attributes: ["name"],
          },
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });
      return onSuccess(
        res,
        200,
        "estimations returned successfully",
        estimations
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async getEstimationById(req, res) {
    try {
      const estimation = await Estimations.findOne({
        where: { id: req.params.id, isApproved: true },
        include: [
          {
            model: EstimationCategory,
            as: "category",
            attributes: ["name"],
          },
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });
      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }
      return onSuccess(
        res,
        200,
        "Estimation returned successfully",
        estimation
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // create estimation
  static async createEstimation(req, res) {
    try {
      const { name, estimationUnit, estimationQuantity, categoryId } = req.body;

      const category = await EstimationCategory.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        return onError(
          res,
          404,
          "Category not found, please create new one or use existing one"
        );
      }
      // create estimation
      const estimation = await Estimations.create({
        name,
        estimationUnit,
        estimationQuantity,
        estimationCategoryId: categoryId,
      });

      return onSuccess(res, 201, "Estimation created successfully", estimation);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // update estimation
  static async updateEstimation(req, res) {
    try {
      const {
        wastagePercentage,
        transportPercentage,
        profitPercentage,
        overHeadPercentage,
        contigencyPercentage,
        estimationQuantity,
      } = req.body;

      // estimation
      
      const estimation = await Estimations.findOne({
        where: { id: req.params.id},
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { equipments, materials, labours, subContractors } = estimation;

      // use default percemyage or working hours when user dont not input
      const estimationQty = estimationQuantity
        ? estimationQuantity
        : +estimation?.estimationQuantity;
      const wastage =
        wastagePercentage === 0
          ? 0
          : wastagePercentage > 0
          ? wastagePercentage * 0.01
          : +estimation?.wastagePercentage;
      const transport =
        transportPercentage === 0
          ? 0
          : transportPercentage > 0
          ? transportPercentage * 0.01
          : +estimation?.transportPercentage;
      const profit =
        profitPercentage === 0
          ? 0
          : profitPercentage > 0
          ? profitPercentage * 0.01
          : +estimation?.profitPercentage;
      const overHead =
        overHeadPercentage === 0
          ? 0
          : overHeadPercentage > 0
          ? overHeadPercentage * 0.01
          : +estimation?.overHeadPercentage;
      const contigency =
        contigencyPercentage === 0
          ? 0
          : contigencyPercentage > 0
          ? contigencyPercentage * 0.01
          : +estimation?.contigencyPercentage;

      // ==============Variables for calculation====================

      let equipmentTotal = 0;
      let fuelTotal = 0;
      let labourTotal = 0;
      let subcontractorTotal = 0;

      // ============Loop for equipment calculation===============
      for (let i = 0; i < equipments.length; i++) {
        const equipment = equipments[i];
        // equipment Performance
        const equipmentPerformance =
          +equipment?.caveragePerUnit * estimationQty;

        const equipmentTotalAmount =
          equipmentPerformance * +equipment.hireRatePrice;

        // ==============EQUIPMENT TOTAL PRICE====================
        equipmentTotal += equipmentTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            equipmentId: equipment.id,
          },
        });
        await estimationLibary.update({
          equipmentPerformance: equipmentPerformance,
          equipmentTotalAmount: equipmentTotalAmount,
        });
      }

      // LOOP THROUGH MATERIALS
      for (let i = 0; i < materials.length; i++) {
        const material = materials[i];

        // calculate machine quantinty formula
        // formaulas material and equipment
        const materialFactorQuantity =
          +material.caveragePerUnit * estimationQty;

        const materialTotalAmount = materialFactorQuantity * +material.price;

        // ==============MATERIAL TOTAL PRICE====================
        fuelTotal += materialTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            materialId: material.id,
          },
        });
        await estimationLibary.update({
          materialFactorQuantity: materialFactorQuantity.toFixed(2),
          materialTotalAmount: materialTotalAmount.toFixed(2),
        });
      }

      // LOOP THROUGH LABOURS
      for (let i = 0; i < labours.length; i++) {
        const labor = labours[i];
        // formaulas
        const labourFactorQuantity = +labor.caveragePerUnit * estimationQty;

        const labourTotalAmount = labourFactorQuantity * +labor.wages;

        // ==============MATERIAL TOTAL PRICE====================
        labourTotal += labourTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            labourId: labor.id,
          },
        });
        await estimationLibary.update({
          labourFactorQuantity,
          labourTotalAmount,
        });
      }
      // LOOP THROUGH SUBCONTRACTORS
      for (let i = 0; i < subContractors.length; i++) {
        const subc = subContractors[i];
        // formaulas

        const subContractorTotalAmount = +subc.quantity * +subc.price;
        // ==============MATERIAL TOTAL PRICE====================
        subcontractorTotal += subContractorTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            subContractorId: subc.id,
          },
        });
        await estimationLibary.update({
          subContractorTotalAmount,
        });
      }
      // =========Calculate Wastage and Transport=======

      const calculatedWastageTotal = fuelTotal * wastage;
      const calculatedTransportTotal = fuelTotal * transport;

      // material
      const materialCostPerWorkItem =
        fuelTotal + +calculatedWastageTotal + +calculatedTransportTotal;
      const materialRatePerUnit = materialCostPerWorkItem / estimationQty;

      // equipment
      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit = equipmentCostPerWorkiItem / estimationQty;
      // labour
      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit = labourCostperWorkItem / estimationQty;
      // subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;
      // // calculate subtotal formula ========= Subtotal =========
      const calculatedSubtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        labourCostperWorkItem +
        subcontractorCostPerWorkItem;

      // calculate material Total ======= Material Total ==========
      const materialTotal =
        fuelTotal + calculatedWastageTotal + calculatedTransportTotal;

      // // calculate profile, overhead and contigency formula
      const calculatedProfit = calculatedSubtotal * profit;
      const calculatedOverhead = calculatedSubtotal * overHead;
      const calculatedContigency = calculatedSubtotal * contigency;

      // calculate estimationRate and estimationTotalAmount formula
      const indirectCostPerWorkItem =
        calculatedOverhead + calculatedContigency + calculatedProfit;

      // rate per unit formula
      const indirectRatePerUnit = indirectCostPerWorkItem / estimationQty;

      const totalAmount = calculatedSubtotal + indirectCostPerWorkItem;

      const ratePerUnit =
        equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit;

      // update estimation
      await estimation.update({
        wastagePercentage: wastage,
        transportPercentage: transport,
        profitPercentage: profit,
        overHeadPercentage: overHead,
        contigencyPercentage: contigency,
        equipmentTotal: equipmentTotal.toFixed(2),
        materialTotal: materialTotal.toFixed(2),
        wastageTotal: calculatedWastageTotal.toFixed(2),
        transportTotal: calculatedTransportTotal.toFixed(2),
        subtotal: calculatedSubtotal.toFixed(2),
        profitTotal: calculatedProfit.toFixed(2),
        overHeadTotal: calculatedOverhead.toFixed(2),
        contigencyTotal: calculatedContigency.toFixed(2),
        estimationRate: ratePerUnit.toFixed(2),
        estimationTotalAmount: totalAmount.toFixed(2),
        estimationQuantity: estimationQty,
        materialCostPerWorkItem: materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: indirectRatePerUnit.toFixed(2),
        labourCostperWorkItem: labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: subcontractorCostPerWorkItem.toFixed(2),
      });

      // get updated estimation
      const updatedestimation = await Estimations.findOne({
        where: { id: req.params.id},
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: [
              "id",
              "name",
              "unit",
              "quantity",
              "price",
              "caveragePerUnit",
            ],
            through: {
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });

      return onSuccess(
        res,
        200,
        "Estimation updated successfully",
        updatedestimation
      );
    } catch (error) {
      console.log("error", error);
      return onError(res, 500, "Internal Server Error");
    }
  }

  // delete estimation
  static async deleteEstimation(req, res) {
    try {
      const { id } = req.params;

      // get all estimation library where estimationId = id
      const estimationLibrary = await EstimationLibrary.findAll({
        where: { estimationId: id },
      });
      // delete all estimation library
      for (let i = 0; i < estimationLibrary.length; i++) {
        const estimationJunction = await EstimationLibrary.findOne({
          where: { estimationId: estimationLibrary[i].estimationId },
        });
        await estimationJunction.destroy();
      }
      const estimation = await Estimations.findOne({ where: { id } });
      await estimation.destroy();

      return onSuccess(res, 200, "Estimation deleted successfully", estimation);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add equipment to estimation
  static async addEquipmentToEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { equipmentName } = req.body;

      if (!equipmentName || typeof equipmentName !== "string") {
        return onError(res, 400, "Equipment name is required");
      }
      const equipment = await Equipments.findOne({
        where: { name: equipmentName},
      });

      if (!equipment) {
        return onError(
          res,
          404,
          "Equipment not found, add new one or use existing equipment"
        );
      }
        // formaulas material and equipment

      const equipmentExist = estimation.equipments.find(equip => equip.name === equipmentName);

      if (equipmentExist) return onError(res, 409, "Equipment Already Added");


        const equipmentPerformance =
          +equipment.caveragePerUnit * +estimation.estimationQuantity;

        const equipmentTotalAmount =
          equipmentPerformance * +equipment.hireRatePrice;

        // add equipment and mataerial to estimationLibary
        await EstimationLibrary.create({
          estimationId: estimation.id,
          equipmentId: equipment.id,
          equipmentPerformance: equipmentPerformance,
          equipmentTotalAmount: equipmentTotalAmount,
        });

        const updateEstimation = await Estimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: Materials,
              as: "materials",
              attributes: [
                "name",
                "quantity",
                "unit",
                "caveragePerUnit",
                "price",
              ],
              through: {
                attributes: ["materialFactorQuantity", "materialTotalAmount"],
              },
            },
            {
              model: Equipments,
              as: "equipments",
              attributes: [
                "id",
                "name",
                "unit",
                "caveragePerUnit",
                "hireRatePrice",
                "number",
              ],
              through: {
                attributes: ["equipmentPerformance", "equipmentTotalAmount"],
              },
            },
            {
              model: Labours,
              as: "labours",
              attributes: [
                "id",
                "name",
                "number",
                "unit",
                "caveragePerUnit",
                "wages",
              ],
              through: {
                attributes: ["labourFactorQuantity", "labourTotalAmount"],
              },
            },
            {
              model: SubContractors,
              as: "subContractors",
              attributes: ["id", "name", "unit", "quantity", "price"],
              through: {
                attributes: [
                  
                  "subContractorTotalAmount",
                ],
              },
            },
          ],
        });
        const { equipments, materials, labours, subContractors } =
          updateEstimation;

        // ==============EQUIPMENT TOTAL PRICE====================
        const equipmentTotal = equipments.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.materialTotalAmount;
        }, 0);

        // ========LABOURS ==============
        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
        }, 0);

        // Subcontractor
        const subcontractorCostPerWorkItem = subcontractorTotal;

        // =========Calculate Wastage and Transport=======

        const calculatedWastageTotal =
          materialSubtotal * +estimation?.wastagePercentage;
        const calculatedTransportTotal =
          materialSubtotal * +estimation?.transportPercentage;

        const materialCostPerWorkItem =
          materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

        const materialRatePerUnit =
          materialCostPerWorkItem / +estimation.estimationQuantity;

        const equipmentCostPerWorkiItem = equipmentTotal;
        const equipmentRatePerUnit =
          equipmentCostPerWorkiItem / +estimation.estimationQuantity;
        const subtotal =
          materialCostPerWorkItem +
          equipmentCostPerWorkiItem +
          labourCostperWorkItem +
          subcontractorCostPerWorkItem;

        // calculate Overhead, Contigency and Profit
        const calculatedOverHead = subtotal * +estimation?.overHeadPercentage;
        const calculatedContigency =
          subtotal * +estimation?.contigencyPercentage;
        const calculatedProfit = subtotal * +estimation?.profitPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +estimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit;

        // update estimation
        await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
        });

        return onSuccess(
          res,
          200,
          "Equipment added successfully",
          updateEstimation
        );
      
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // remove equipment from estimation
  static async removeEquipmentFromEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { equipmentName } = req.body;

      if (!equipmentName || typeof equipmentName !== "string") {
        return onError(res, 400, "Equipment name is required");
      }
      const equipmentExist = estimation.equipments.find(
        (equipment) => equipment.name === equipmentName
      );
      // console.log("equipmentExist", equipmentExist);
      if (!equipmentExist)
        return onError(
          res,
          404,
          "equipment doesn't exist within this estimation"
        );

      // remove equipment from EstimationLibrary
      await EstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          equipmentId: equipmentExist.id,
        },
      });

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

      // ==============EQUIPMENT TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary.materialTotalAmount;
      }, 0);

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
      }, 0);

      // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;
      

      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // =========Calculate Wastage and Transport=======

      const calculatedWastageTotal =
        materialSubtotal * +estimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialSubtotal * +estimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +estimation.estimationQuantity;

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +estimation.estimationQuantity;
      const subtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        subcontractorCostPerWorkItem +
        labourCostperWorkItem;

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead = subtotal * +estimation?.overHeadPercentage;
      const calculatedContigency = subtotal * +estimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +estimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit;

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "Equipment Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // edit estimation equipment
  static async editEstimationEquipment(req, res) {
    try {
      const { caveragePerUnit, equipmentName, equipmentPrice } = req.body;

      // estimation
      
      const estimation = await Estimations.findOne({
        where: { id: req.params.id},
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      //
      const estimationQty = +estimation?.estimationQuantity;

      // check if equipment exist
      const equipmentExist = estimation.equipments.find(
        (equipment) => equipment.name === equipmentName
      );

      if (!equipmentExist) {
        return onError(
          res,
          404,
          "Equipment you are trying to update does not exist with this estimation"
        );
      }

      // caverage per unit
      const caverage = caveragePerUnit
        ? caveragePerUnit
        : +equipmentExist.caveragePerUnit;

      // equipment price
      const equipPrice = equipmentPrice
        ? equipmentPrice
        : +equipmentExist.hireRatePrice;
      // equipment id
      const equipmentId = equipmentExist.id;

      // find equipment
      const equipment = await Equipments.findOne({
        where: { name: equipmentName, id: equipmentId },
      });

      // update equipment
      await equipment.update({
        caveragePerUnit: caverage,
        hireRatePrice: equipPrice,
      });

      // make new calculation;

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
           {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours,subContractors} = updateEstimation;

      let equipmentTotal = 0;

      // ============Loop for equipment calculation===============
      for (let i = 0; i < equipments.length; i++) {
        const equipment = equipments[i];
        // equipment Performance
        const equipmentPerformance = +equipment.caveragePerUnit * estimationQty;

        const equipmentTotalAmount =
          equipmentPerformance * +equipment.hireRatePrice;

        // ==============EQUIPMENT TOTAL PRICE====================
        equipmentTotal += equipmentTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            equipmentId: equipment.id,
          },
        });
        await estimationLibary.update({
          equipmentPerformance: equipmentPerformance,
          equipmentTotalAmount: equipmentTotalAmount,
        });
      }

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.materialTotalAmount;
      }, 0);

      //  ========= LABOUR WASTAGE PRICE =======

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

      // =========Calculate Wastage and Transport=======

      const calculatedWastageTotal =
        materialSubtotal * +updateEstimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialSubtotal * +updateEstimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +updateEstimation.estimationQuantity;

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
      const subtotal = materialCostPerWorkItem + equipmentCostPerWorkiItem + labourCostperWorkItem + subcontractorCostPerWorkItem;

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead =
        subtotal * +updateEstimation?.overHeadPercentage;
      const calculatedContigency =
        subtotal * +updateEstimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +updateEstimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit = equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit;

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "Equipment Updated successfully",
        updateEstimation
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add material to estimation
  static async addMaterialToEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { materialName } = req.body;

      if (!materialName || typeof materialName !== "string") {
        return onError(res, 400, "Material name is required");
      }
      const material = await Materials.findOne({
        where: { name: materialName},
      });

      if (!material) {
        return onError(
          res,
          404,
          "material not found, add new one or use existing material"
        );
      }

      const materialExist = estimation.materials.find(
        (material) => material.name === materialName
      );

      if (materialExist) return onError(res, 409, "material already exists");

        // formaulas material and equipment

        const materialFactorQuantity =
          +material.caveragePerUnit * +estimation.estimationQuantity;

        const materialTotalAmount = materialFactorQuantity * +material.price;

        // add equipment and mataerial to estimationLibary
        await EstimationLibrary.create({
          estimationId: estimation.id,
          materialId: material.id,
          materialFactorQuantity: materialFactorQuantity,
          materialTotalAmount: materialTotalAmount,
        });

        const updateEstimation = await Estimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: Materials,
              as: "materials",
              attributes: [
                "name",
                "quantity",
                "unit",
                "caveragePerUnit",
                "price",
              ],
              through: {
                attributes: ["materialFactorQuantity", "materialTotalAmount"],
              },
            },
            {
              model: Equipments,
              as: "equipments",
              attributes: [
                "id",
                "name",
                "unit",
                "caveragePerUnit",
                "hireRatePrice",
                "number",
              ],
              through: {
                attributes: ["equipmentPerformance", "equipmentTotalAmount"],
              },
            },
            {
              model: Labours,
              as: "labours",
              attributes: [
                "id",
                "name",
                "number",
                "unit",
                "caveragePerUnit",
                "wages",
              ],
              through: {
                attributes: ["labourFactorQuantity", "labourTotalAmount"],
              },
            },
            {
              model: SubContractors,
              as: "subContractors",
              attributes: ["id", "name", "unit", "quantity", "price"],
              through: {
                attributes: [
                  
                  "subContractorTotalAmount",
                ],
              },
            },
          ],
        });
        const { equipments, materials, labours, subContractors } =
          updateEstimation;

        // ==============EQUIPMENT TOTAL PRICE====================
        const equipmentTotal = equipments.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.materialTotalAmount;
        }, 0);

        //  ========= LABOUR WASTAGE PRICE =======

        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
        }, 0);

        // Subcontractor
        const subcontractorCostPerWorkItem = subcontractorTotal;

        // =========Calculate Wastage and Transport=======

        const calculatedWastageTotal =
          materialSubtotal * +estimation?.wastagePercentage;
        const calculatedTransportTotal =
          materialSubtotal * +estimation?.transportPercentage;

        const materialCostPerWorkItem =
          materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

        const materialRatePerUnit =
          materialCostPerWorkItem / +estimation.estimationQuantity;

        const equipmentCostPerWorkiItem = equipmentTotal;
        const equipmentRatePerUnit =
          equipmentCostPerWorkiItem / +estimation.estimationQuantity;
        const subtotal =
          materialCostPerWorkItem +
          equipmentCostPerWorkiItem +
          subcontractorCostPerWorkItem +
          labourCostperWorkItem;

        // calculate Overhead, Contigency and Profit
        const calculatedOverHead = subtotal * +estimation?.overHeadPercentage;
        const calculatedContigency =
          subtotal * +estimation?.contigencyPercentage;
        const calculatedProfit = subtotal * +estimation?.profitPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +estimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit

        // update estimation
        await updateEstimation.update({
          wastageTotal: +calculatedWastageTotal.toFixed(2),
          transportTotal: +calculatedTransportTotal.toFixed(2),
          profitTotal: +calculatedProfit.toFixed(2),
          overheadTotal: +calculatedOverHead.toFixed(2),
          contigencyTotal: +calculatedContigency.toFixed(2),
          materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
          materialRatePerUnit: +materialRatePerUnit.toFixed(2),
          equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
          equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
          indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
          indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
          estimationTotalAmount: +totalAmount.toFixed(2),
          estimationRate: +ratePerUnit.toFixed(2),
          subtotal: +subtotal.toFixed(2),
          labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
          labourRatePerUnit: +labourRatePerUnit.toFixed(2),
          subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
        });

        return onSuccess(
          res,
          200,
          "Material added successfully",
          updateEstimation
        );

    } catch (error) {
      console.log(error)
      return onError(res, 500, "Internal Server Error");
    }
  }

  // remove material from estimation
  static async removeMaterialFromEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { materialName } = req.body;

      if (!materialName || typeof materialName !== "string") {
        return onError(res, 400, "material name is required");
      }
      const materialExist = estimation.materials.find(
        (material) => material.name === materialName
      );
      if (!materialExist)
        return onError(
          res,
          404,
          "material doesn't exist within this estimation"
        );

      // remove equipment from EstimationLibrary
      await EstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          materialId: materialExist.id,
        },
      });

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

      // ==============EQUIPMENT TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.materialTotalAmount;
      }, 0);

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
      }, 0);

      // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;
      
      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // =========Calculate Wastage and Transport=======

      const calculatedWastageTotal =
        materialSubtotal * +estimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialSubtotal * +estimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +estimation.estimationQuantity;

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +estimation.estimationQuantity;
      const subtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        subcontractorCostPerWorkItem +
        labourCostperWorkItem;

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead = subtotal * +estimation?.overHeadPercentage;
      const calculatedContigency = subtotal * +estimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +estimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "Material Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // edit estimation materials
  static async editEstimationMaterials(req, res) {
    try {
      const { caveragePerUnit, materialName, materialPrice, quantity } =
        req.body;

      // estimation
      
      const estimation = await Estimations.findOne({
        where: { id: req.params.id},
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      //
      const estimationQty = +estimation?.estimationQuantity;

      // check if equipment exist
      const materialExist = estimation.materials.find(
        (material) => material.name === materialName
      );

      if (!materialExist) {
        return onError(
          res,
          404,
          "Material you are trying to update does not exist with this estimation"
        );
      }

      // caverage per unit
      const caverage = caveragePerUnit
        ? caveragePerUnit
        : +materialExist.caveragePerUnit;

      // equipment price
      const matPrice = materialPrice ? materialPrice : +materialExist.price;
      // equipment id
      const materialId = materialExist.id;
      const materialQuantity = quantity ? quantity : +materialExist.quantity;

      // find equipment
      const material = await Materials.findOne({
        where: { name: materialName, id: materialId },
      });

      // update equipment
      await material.update({
        caveragePerUnit: caverage,
        price: matPrice,
        quantity: materialQuantity,
      });

      // make new calculation;

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
           {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } = updateEstimation;

      let materialTotal = 0;

      // ============Loop for equipment calculation===============
      for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        // equipment Performance
        const materialFactorQuantity =
          +material.caveragePerUnit * estimationQty;

        const materialTotalAmount = materialFactorQuantity * +material.price;

        // ==============Material TOTAL PRICE====================
        materialTotal += materialTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            materialId: material.id,
          },
        });
        await estimationLibary.update({
          materialFactorQuantity,
          materialTotalAmount,
        });
      }

      // =========Calculate Wastage and Transport=======

      const calculatedWastageTotal =
        materialTotal * +updateEstimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialTotal * +updateEstimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialTotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +updateEstimation.estimationQuantity;

        //  ========= LABOUR WASTAGE PRICE =======

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

      // ==============MATERIAL TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
      }, 0);

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
      const subtotal = materialCostPerWorkItem + equipmentCostPerWorkiItem + labourCostperWorkItem + subcontractorCostPerWorkItem

      

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead =
        subtotal * +updateEstimation?.overHeadPercentage;
      const calculatedContigency =
        subtotal * +updateEstimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +updateEstimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit = equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "Material Updated successfully",
        updateEstimation
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add labour to estimation
  static async addLabourToEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { labourName } = req.body;

      if (!labourName || typeof labourName !== "string") {
        return onError(res, 400, "labour name is required");
      }
      const labour = await Labours.findOne({
        where: { name: labourName},
      });

      if (!labour) {
        return onError(
          res,
          404,
          "labour not found, add new one or use existing material"
        );
      }

      const labourExist = estimation.labours.find(
        (labour) => labour.name === labourName
      );

      if (labourExist) return onError(res, 409, "labour already exists");
        // formaulas material and equipment

        const labourFactorQuantity =
          +labour.caveragePerUnit * +estimation.estimationQuantity;

        const labourTotalAmount = labourFactorQuantity * +labour.wages;

        // add equipment and mataerial to estimationLibary
        await EstimationLibrary.create({
          estimationId: estimation.id,
          labourId: labour.id,
          labourFactorQuantity,
          labourTotalAmount,
        });

        const updateEstimation = await Estimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: Materials,
              as: "materials",
              attributes: [
                "id",
                "name",
                "quantity",
                "unit",
                "caveragePerUnit",
                "price",
              ],
              through: {
                attributes: ["materialFactorQuantity", "materialTotalAmount"],
              },
            },
            {
              model: Equipments,
              as: "equipments",
              attributes: [
                "id",
                "name",
                "unit",
                "caveragePerUnit",
                "hireRatePrice",
                "number",
              ],
              through: {
                attributes: ["equipmentPerformance", "equipmentTotalAmount"],
              },
            },
            {
              model: Labours,
              as: "labours",
              attributes: [
                "id",
                "name",
                "number",
                "unit",
                "caveragePerUnit",
                "wages",
              ],
              through: {
                attributes: ["labourFactorQuantity", "labourTotalAmount"],
              },
            },
            {
              model: SubContractors,
              as: "subContractors",
              attributes: ["id", "name", "unit", "quantity", "price"],
              through: {
                attributes: [
                  
                  "subContractorTotalAmount",
                ],
              },
            },
          ],
        });
        const { equipments, materials, labours, subContractors } =
          updateEstimation;

        // ==============EQUIPMENT TOTAL PRICE====================
        const equipmentTotal = equipments.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.materialTotalAmount;
        }, 0);

        // ============== LABOUR TOTAL PRICE ============

        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
        }, 0);

        // Subcontractor
        const subcontractorCostPerWorkItem = subcontractorTotal;

        // =========Calculate Wastage and Transport=======

        const calculatedWastageTotal =
          materialSubtotal * +updateEstimation?.wastagePercentage;
        const calculatedTransportTotal =
          materialSubtotal * +updateEstimation?.transportPercentage;

        const materialCostPerWorkItem =
          materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

        const materialRatePerUnit =
          materialCostPerWorkItem / +updateEstimation.estimationQuantity;

        const equipmentCostPerWorkiItem = equipmentTotal;
        const equipmentRatePerUnit =
          equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
        const subtotal =
          materialCostPerWorkItem +
          equipmentCostPerWorkiItem +
          labourCostperWorkItem +
          subcontractorCostPerWorkItem;

        // calculate Overhead, Contigency and Profit
        const calculatedOverHead =
          subtotal * +updateEstimation?.overHeadPercentage;
        const calculatedContigency =
          subtotal * +updateEstimation?.contigencyPercentage;
        const calculatedProfit = subtotal * +updateEstimation?.profitPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit

        // update estimation
        await updateEstimation.update({
          wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
        });

        return onSuccess(
          res,
          200,
          "Labour added successfully",
          updateEstimation
        );
      
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // remove labour from estimation
  static async removeLabourFromEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { labourName } = req.body;

      if (!labourName || typeof labourName !== "string") {
        return onError(res, 400, "labour name is required");
      }
      const labourExist = estimation.labours.find(
        (labour) => labour.name === labourName
      );
      if (!labourExist)
        return onError(res, 404, "labour doesn't exist within this estimation");

      // remove equipment from EstimationLibrary
      await EstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          labourId: labourExist.id,
        },
      });

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

      // ==============EQUIPMENT TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.materialTotalAmount;
      }, 0);

      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
      }, 0);

      // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;
      
      // =========Calculate Wastage and Transport=======

      const calculatedWastageTotal =
        materialSubtotal * +estimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialSubtotal * +estimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +estimation.estimationQuantity;

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +estimation.estimationQuantity;
      const subtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        labourCostperWorkItem +
        subcontractorCostPerWorkItem;

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead = subtotal * +estimation?.overHeadPercentage;
      const calculatedContigency = subtotal * +estimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +estimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "Labour Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // edit estimation materials
  static async editLabourEstimation(req, res) {
    try {
      const { caveragePerUnit, labourName, wages, number } = req.body;

      // estimation
      
      const estimation = await Estimations.findOne({
        where: { id: req.params.id},
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      //
      const estimationQty = +estimation?.estimationQuantity;

      // check if equipment exist
      const labourExist = estimation.labours.find(
        (labour) => labour.name === labourName
      );

      if (!labourExist) {
        return onError(
          res,
          404,
          "Labour you are trying to update does not exist with this estimation"
        );
      }

      // caverage per unit
      const caverage = caveragePerUnit
        ? caveragePerUnit
        : +labourExist.caveragePerUnit;

      // equipment price
      const labWages = wages ? wages : +labourExist.wages;
      // equipment id
      const labourId = labourExist.id;
      const labourNumber = number ? number : +labourExist.number;

      // find equipment
      const labour = await Labours.findOne({
        where: { name: labourName, id: labourId },
      });

      // update equipment
      await labour.update({
        caveragePerUnit: caverage,
        wages: labWages,
        number: labourNumber,
      });

      // make new calculation;

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours,subContractors } = updateEstimation;

      let labourTotal = 0;

      // ============Loop for equipment calculation===============
      for (let i = 0; i < labours.length; i++) {
        const labour = labours[i];
        // labour Performance
        const labourFactorQuantity = +labour.caveragePerUnit * estimationQty;

        const labourTotalAmount = labourFactorQuantity * +labour.wages;

        // ==============Material TOTAL PRICE====================
        labourTotal += labourTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            labourId: labour.id,
          },
        });
        await estimationLibary.update({
          labourFactorQuantity,
          labourTotalAmount,
        });
      }

      // =========Calculate Wastage and Transport=======

      //  ========= LABOUR WASTAGE PRICE =======
      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.materialTotalAmount;
      }, 0);

      const calculatedWastageTotal =
        materialSubtotal * +updateEstimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialSubtotal * +updateEstimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +updateEstimation.estimationQuantity;

      // ==============EQUIPMENTA TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
      }, 0);

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;

         // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;
      const subtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        labourCostperWorkItem + subcontractorCostPerWorkItem

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead =
        subtotal * +updateEstimation?.overHeadPercentage;
      const calculatedContigency =
        subtotal * +updateEstimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +updateEstimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "Labour Updated successfully",
        updateEstimation
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add subcontractor to estimation
  static async addSubcontractorToEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { subcontractorName } = req.body;

      if (!subcontractorName || typeof subcontractorName !== "string") {
        return onError(res, 400, "subcontractor name is required");
      }
      const subcontractor = await SubContractors.findOne({
        where: { name: subcontractorName},
      });

      if (!subcontractor) {
        return onError(
          res,
          404,
          "subcontracto not found, add new one or use existing material"
        );
      }

      const subcontractor_Exist = estimation.subContractors.find(
        (subc) => subc.name === subcontractorName
      );

      if (subcontractor_Exist)
        return onError(res, 409, "subcontractor already exists");

        // formaulas material and equipment


        const subContractorTotalAmount =
          subcontractor.quantity * +subcontractor.price;

        // add equipment and mataerial to estimationLibary
        await EstimationLibrary.create({
          estimationId: estimation.id,
          subContractorId: subcontractor.id,
          subContractorTotalAmount,
        });

        const updateEstimation = await Estimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: Materials,
              as: "materials",
              attributes: [
                "id",
                "name",
                "quantity",
                "unit",
                "caveragePerUnit",
                "price",
              ],
              through: {
                attributes: ["materialFactorQuantity", "materialTotalAmount"],
              },
            },
            {
              model: Equipments,
              as: "equipments",
              attributes: [
                "id",
                "name",
                "unit",
                "caveragePerUnit",
                "hireRatePrice",
                "number",
              ],
              through: {
                attributes: ["equipmentPerformance", "equipmentTotalAmount"],
              },
            },
            {
              model: Labours,
              as: "labours",
              attributes: [
                "id",
                "name",
                "number",
                "unit",
                "caveragePerUnit",
                "wages",
              ],
              through: {
                attributes: ["labourFactorQuantity", "labourTotalAmount"],
              },
            },
            {
              model: SubContractors,
              as: "subContractors",
              attributes: ["id", "name", "unit", "quantity", "price"],
              through: {
                attributes: [
                  
                  "subContractorTotalAmount",
                ],
              },
            },
          ],
        });
        const { equipments, materials, labours, subContractors } =
          updateEstimation;

        // ==============EQUIPMENT TOTAL PRICE====================
        const equipmentTotal = equipments.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.materialTotalAmount;
        }, 0);

        // ============== LABOUR TOTAL PRICE ============

        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE ===========
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
        }, 0);

        // Subcontractor
        const subcontractorCostPerWorkItem = subcontractorTotal;

        // =========Calculate Wastage and Transport=======

        const calculatedWastageTotal =
          materialSubtotal * +updateEstimation?.wastagePercentage;
        const calculatedTransportTotal =
          materialSubtotal * +updateEstimation?.transportPercentage;

        const materialCostPerWorkItem =
          materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

        const materialRatePerUnit =
          materialCostPerWorkItem / +updateEstimation.estimationQuantity;

        const equipmentCostPerWorkiItem = equipmentTotal;
        const equipmentRatePerUnit =
          equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
        const subtotal =
          materialCostPerWorkItem +
          equipmentCostPerWorkiItem +
          labourCostperWorkItem +
          subcontractorCostPerWorkItem;

        // calculate Overhead, Contigency and Profit
        const calculatedOverHead =
          subtotal * +updateEstimation?.overHeadPercentage;
        const calculatedContigency =
          subtotal * +updateEstimation?.contigencyPercentage;
        const calculatedProfit = subtotal * +updateEstimation?.profitPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit

        // update estimation
        await updateEstimation.update({
            wastageTotal: +calculatedWastageTotal.toFixed(2),
            transportTotal: +calculatedTransportTotal.toFixed(2),
            profitTotal: +calculatedProfit.toFixed(2),
            overheadTotal: +calculatedOverHead.toFixed(2),
            contigencyTotal: +calculatedContigency.toFixed(2),
            materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
            materialRatePerUnit: +materialRatePerUnit.toFixed(2),
            equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
            equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
            indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
            indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
            estimationTotalAmount: +totalAmount.toFixed(2),
            estimationRate: +ratePerUnit.toFixed(2),
            subtotal: +subtotal.toFixed(2),
            labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
            labourRatePerUnit: +labourRatePerUnit.toFixed(2),
            subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
        });

        return onSuccess(
          res,
          200,
          "subcontractor added successfully",
          updateEstimation
        );
    } catch (error) {
      console.log(error);
      return onError(res, 500, "Internal Server Error");
    }
  }

  // remove subcontractor from estimation
  static async removeSubcontractorFromEstimation(req, res) {
    try {
      const { id } = req.params;
      
      const estimation = await Estimations.findOne({
        where: { id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }

      const { subcontractorName } = req.body;

      if (!subcontractorName || typeof subcontractorName !== "string") {
        return onError(res, 400, "subcontractor name is required");
      }
      const subc_Exist = estimation.subContractors.find(
        (subc) => subc.name === subcontractorName
      );
      if (!subc_Exist)
        return onError(
          res,
          404,
          "subcontractor doesn't exist within this estimation"
        );

      // remove equipment from EstimationLibrary
      await EstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          subContractorId: subc_Exist.id,
        },
      });

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

      // ==============EQUIPMENT TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.materialTotalAmount;
      }, 0);

      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ============== SUB CONTRACTOR TOTAL PRICE ===========
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.subContractorTotalAmount;
      }, 0);

      // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;

      // =========Calculate Wastage and Transport=======

      const calculatedWastageTotal =
        materialSubtotal * +estimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialSubtotal * +estimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +estimation.estimationQuantity;

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +estimation.estimationQuantity;
      const subtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        labourCostperWorkItem +
        subcontractorCostPerWorkItem;

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead = subtotal * +estimation?.overHeadPercentage;
      const calculatedContigency = subtotal * +estimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +estimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2)
      });

      return onSuccess(
        res,
        200,
        "Subcontractor Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
  // edit estimation subcontractor
  static async editSubcontractorEstimation(req, res) {
    try {
      const { subcontractorName, price, quantity } = req.body;

      // estimation
      
      const estimation = await Estimations.findOne({
        where: { id: req.params.id},
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });

      if (!estimation) {
        return onError(res, 404, "Estimation not found");
      }


      // check if subcontractor exist
      const subc_Exist = estimation.subContractors.find(
        (subc) => subc.name === subcontractorName
      );

      if (!subc_Exist) {
        return onError(
          res,
          404,
          "subcontractor you are trying to update does not exist with this estimation"
        );
      }

      // caverage per unit

      // subcontractor price
      const subc_price = price ? price : +subc_Exist.price;
      // subcontractor id
      const subContractorId = subc_Exist.id;
      const subc_quantity = quantity ? quantity : +subc_Exist.quantity;

      // find subcontractor
      const subcontractor = await SubContractors.findOne({
        where: { name: subcontractorName, id: subContractorId },
      });

      // update equipment
      await subcontractor.update({
        price: subc_price,
        quantity: subc_quantity,
      });

      // make new calculation;

      const updateEstimation = await Estimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: Materials,
            as: "materials",
            attributes: [
              "id",
              "name",
              "quantity",
              "unit",
              "caveragePerUnit",
              "price",
            ],
            through: {
              attributes: ["materialFactorQuantity", "materialTotalAmount"],
            },
          },
          {
            model: Equipments,
            as: "equipments",
            attributes: [
              "id",
              "name",
              "unit",
              "caveragePerUnit",
              "hireRatePrice",
              "number",
            ],
            through: {
              attributes: ["equipmentPerformance", "equipmentTotalAmount"],
            },
          },
          {
            model: Labours,
            as: "labours",
            attributes: [
              "id",
              "name",
              "number",
              "unit",
              "caveragePerUnit",
              "wages",
            ],
            through: {
              attributes: ["labourFactorQuantity", "labourTotalAmount"],
            },
          },
          {
            model: SubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: [
                "subContractorTotalAmount",
              ],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

      let subc_Total = 0;

      // ============Loop for equipment calculation===============
      for (let i = 0; i < subContractors.length; i++) {
        const subco = subContractors[i];

        const subContractorTotalAmount = +subco.quantity * +subco.price;

        // ==============Material TOTAL PRICE====================
        subc_Total += subContractorTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await EstimationLibrary.findOne({
          where: {
            estimationId: estimation.id,
            subContractorId: subco.id,
          },
        });
        await estimationLibary.update({
          subContractorTotalAmount,
        });
      }

      // ========= SUB CONTRACTORS =======
      // Subcontractor
      const subcontractorCostPerWorkItem = subc_Total;

      //  ========= LABOUR WASTAGE PRICE =======

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.materialTotalAmount;
      }, 0);

      const calculatedWastageTotal =
        materialSubtotal * +updateEstimation?.wastagePercentage;
      const calculatedTransportTotal =
        materialSubtotal * +updateEstimation?.transportPercentage;

      const materialCostPerWorkItem =
        materialSubtotal + calculatedWastageTotal + calculatedTransportTotal;

      const materialRatePerUnit =
        materialCostPerWorkItem / +updateEstimation.estimationQuantity;

      // ==============EQUIPMENTA TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.EstimationLibrary?.equipmentTotalAmount;
      }, 0);

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
      const subtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        labourCostperWorkItem +
        subcontractorCostPerWorkItem;

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead =
        subtotal * +updateEstimation?.overHeadPercentage;
      const calculatedContigency =
        subtotal * +updateEstimation?.contigencyPercentage;
      const calculatedProfit = subtotal * +updateEstimation?.profitPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit

      // update estimation
      await updateEstimation.update({
        wastageTotal: +calculatedWastageTotal.toFixed(2),
        transportTotal: +calculatedTransportTotal.toFixed(2),
        profitTotal: +calculatedProfit.toFixed(2),
        overheadTotal: +calculatedOverHead.toFixed(2),
        contigencyTotal: +calculatedContigency.toFixed(2),
        materialCostPerWorkItem: +materialCostPerWorkItem.toFixed(2),
        materialRatePerUnit: +materialRatePerUnit.toFixed(2),
        equipmentCostPerWorkItem: +equipmentCostPerWorkiItem.toFixed(2),
        equipmentRatePerUnit: +equipmentRatePerUnit.toFixed(2),
        indirectCostPerWorkItem: +indirectCostPerWorkItem.toFixed(2),
        indirectRatePerUnit: +indirectRatePerUnit.toFixed(2),
        estimationTotalAmount: +totalAmount.toFixed(2),
        estimationRate: +ratePerUnit.toFixed(2),
        subtotal: +subtotal.toFixed(2),
        labourCostperWorkItem: +labourCostperWorkItem.toFixed(2),
        labourRatePerUnit: +labourRatePerUnit.toFixed(2),
        subcontractorCostPerWorkItem: +subcontractorCostPerWorkItem.toFixed(2),
      });

      return onSuccess(
        res,
        200,
        "subcontractor Updated successfully",
        updateEstimation
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }
}

export default EstimationController;

import {
  UserMaterials,
  UserEstimations,
  Estimations,
  EstimationLibrary,
  UserEstimationLibrary,
  UserEquipments,
  Equipments,
  Materials,
  UserLabours,
  UserSubContractors,
  UserEstimationCategory,
  EstimationCategory,
  Labours,
  SubContractors,
} from "../../database/models";
import { onError, onSuccess } from "../../utils/response";
import sequelize from '../transaction/sequelize'

class UserEstimationController {
  // get all estimations
  static async getAllEstimations(req, res) {
    try {
      // find all estimations include Materials , Units and exclude UserEstimationLibrary
      const { id: userId, role, managerId } = req.user;
      if(role === "manager" || role === 'admin'){
      const estimations = await UserEstimations.findAll({
        where: { userId: managerId ? managerId : userId, projectId: null },
        order: [["id", "ASC"]],
        include: [
          {
            model: UserEstimationCategory,
            as: "category",
            attributes: ["name"],
          },
          {
            model: UserMaterials,
            as: "materials",
            order: [["id", "DESC"]],
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
      return onSuccess(
        res,
        200,
        "estimations returned successfully",
        estimations
      );
    }
    } catch (error) {
      console.log(error);
      return onError(res, 500, "Internal Server Error");
    }
  }

  static async getEstimationById(req, res) {
    try {
      const { id: userId, role, managerId } = req.user;
      if(role === 'manager' || role === 'admin'){
      const estimation = await UserEstimations.findOne({
        where: { userId: managerId ? managerId : userId, projectId: null, id: req.params.id },
        include: [
          {
            model: UserEstimationCategory,
            as: "category",
            attributes: ["name"],
          },
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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

      return onSuccess(
        res,
        200,
        "Estimation returned successfully",
        estimation
      );
      }
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // create estimation
  static async createEstimation(req, res) {
    try {
      const { id: userId, role, managerId } = req.user;
      const { name, estimationUnit, estimationQuantity, categoryId } = req.body;

      if(role === 'manager' || role === 'admin'){

      const category = await UserEstimationCategory.findOne({
        where: { id: categoryId, userId: managerId ? managerId : userId },
      });
      const defaultCategory = await EstimationCategory.findOne({
        where: { id: categoryId },
      });
      if (!category && !defaultCategory) {
        return onError(
          res,
          404,
          "Category not found, please create new one or use existing one"
        );
      }
      // check if estimation name already exist
      const lowerCaseName = name.toLowerCase()
      const estimationExist = await UserEstimations.findOne({
        where: { name: lowerCaseName, userId: managerId ? managerId : userId },
      });
      if (estimationExist) {
        return onError(res, 409, "Estimation name already exist");
      }
      if (defaultCategory) {
        const userCategory = await UserEstimationCategory.findOne({
          where: { name: defaultCategory.name, userId: managerId ? managerId : userId },
        });
        if (userCategory) {
          const estimation = await UserEstimations.create({
            name,
            estimationUnit,
            estimationQuantity,
            userEstimationCategoryId: userCategory.id,
            userId: managerId ? managerId : userId,
            projectId: null
          });
          const ourEstimation = await Estimations.findOne({ where: {name: estimation.name} })
          if(!ourEstimation){
            await Estimations.create({
              name: name.toLowerCase(),
              estimationUnit,
              estimationQuantity,
              estimationCategoryId: categoryId,
              userId: managerId ? managerId : userId,
              isApproved: false
            });
          }
          return onSuccess(
            res,
            201,
            "Estimation created successfully",
            estimation
          );
        }
        const category = await UserEstimationCategory.create({
          name: defaultCategory.name,
          userId: managerId ? managerId : userId,
        });
        const defaultCaty = await EstimationCategory.findOne({
        where: { name: category.name },
        });
        if(!defaultCaty){
          await EstimationCategory.create({
          name: category.name,
          userId: managerId ? managerId : userId,
          isApproved: false
        });
        }
        const estimation = await UserEstimations.create({
          name: name.toLowerCase(),
          estimationUnit,
          estimationQuantity,
          userEstimationCategoryId: category.id,
          userId: managerId ? managerId : userId,
          projectId: null
        });
        const ourEstimation = await Estimations.findOne({ where: {name: estimation.name} })
        if(!ourEstimation){
            await Estimations.create({
              name: name.toLowerCase(),
              estimationUnit,
              estimationQuantity,
              estimationCategoryId: categoryId,
              userId: managerId ? managerId : userId,
              isApproved: false
          });
        }
        return onSuccess(
          res,
          201,
          "Estimation created successfully",
          estimation
        );
      }
      if(category) {
        const estimation = await UserEstimations.create({
          name: name.toLowerCase(),
          estimationUnit,
          estimationQuantity,
          userEstimationCategoryId: categoryId,
          userId: managerId ? managerId : userId,
        });
        const ourEstimation = await Estimations.findOne({ where: {name: estimation.name} })
          if(!ourEstimation){
            await Estimations.create({
              name: name.toLowerCase(),
              estimationUnit,
              estimationQuantity,
              estimationCategoryId: categoryId,
              userId: managerId ? managerId : userId,
              isApproved: false
            });
          }
        return onSuccess(
          res,
          201,
          "Estimation created successfully",
          estimation
        );
      }
    }

    // ADMIN ACTION
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
      const lowerCaseName = name.toLowerCase()
      const estimationExist = await Estimations.findOne({
        where: { name: lowerCaseName },
      });
      if (estimationExist) {
        return onError(res, 409, "Estimation name already exist");
      }
      // create estimation
      const estimation = await Estimations.create({
        name: name.toLowerCase(),
        estimationUnit,
        estimationQuantity,
        estimationCategoryId: categoryId,
        isApproved: true
      });

      return onSuccess(res, 201, "Estimation created successfully", estimation);
      
    } catch (error) {
      console.log(error);
      return onError(res, 500, "Internal Server Error, Try Again");
    }
  }

  // copy estimation with it all activity
  
  static async copyEstimation (req, res){
    const t = await sequelize.transaction();
    try{
      const { id: userId, managerId, role } = req.user;

      if(role === 'manager' || role === 'admin'){
      const estimation = await UserEstimations.findOne({
        where: { userId: managerId ? managerId : userId, id: req.params.id },
        order: [["id", "ASC"]],
        include: [
          {
            model: UserEstimationCategory,
            as: "category",
            attributes: ["name"],
          },
          {
            model: UserMaterials,
            as: "materials",
            order: [["id", "DESC"]],
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
            as: "subContractors",
            attributes: ["id", "name", "unit", "quantity", "price"],
            through: {
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });

      // dupliacte project and if name already exist increment by one;

      if(!estimation) return(res, 404, "Estimation doesn't exist!")
       
      const estimationName = `${estimation.name} copy`;

        const { 
          name,
          estimationUnit,
          estimationQuantity,
          wastagePercentage,
          wastageTotal,
          transportPercentage,
          transportTotal,
          profitPercentage,
          profitTotal,
          overHeadPercentage,
          overHeadTotal,
          contigencyPercentage,
          contigencyTotal,
          subtotal,
          estimationRate,
          estimationTotalAmount,
          userEstimationCategoryId,
          equipmentCostPerWorkItem,
          equipmentRatePerUnit,
          materialCostPerWorkItem,
          materialRatePerUnit,
          indirectCostPerWorkItem,
          indirectRatePerUnit,
          labourCostperWorkItem,
          labourRatePerUnit,
          subcontractorCostPerWorkItem,
          equipments,
          materials,
          labours,
          subContractors
        } = estimation
        const newEstimation = await UserEstimations.create({
          name: estimationName,
          estimationUnit,
          estimationQuantity,
          wastagePercentage,
          wastageTotal,
          transportPercentage,
          transportTotal,
          profitPercentage,
          profitTotal,
          overHeadPercentage,
          overHeadTotal,
          contigencyPercentage,
          contigencyTotal,
          subtotal,
          estimationRate,
          estimationTotalAmount,
          userEstimationCategoryId,
          equipmentCostPerWorkItem,
          equipmentRatePerUnit,
          materialCostPerWorkItem,
          materialRatePerUnit,
          indirectCostPerWorkItem,
          indirectRatePerUnit,
          labourCostperWorkItem,
          labourRatePerUnit,
          subcontractorCostPerWorkItem,
          userId: managerId ? managerId : userId,
        }, { transaction: t });

        // loop through equipment
         for (let i = 0 ; i <equipments.length ; i++) {

            const {
              name,
              unit,
              caveragePerUnit,
              hireRatePrice,
              number,
              supplierId,
              UserEstimationLibrary: library
            } = equipments[i];

           const newEquipment = await UserEquipments.create({
              name,
              unit,
              caveragePerUnit,
              hireRatePrice,
              number,
              supplierId,
              userId: managerId ? managerId : userId,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: newEquipment.id,
              equipmentPerformance: library?.equipmentPerformance ? library?.equipmentPerformance : 0,
              equipmentTotalAmount: library?.equipmentTotalAmount ? library?.equipmentTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
            }, { transaction: t });
        }

        // LOOP THROUGH Materials
        for (let i = 0; i < materials.length; i++) {
          const {
            name,
            quantity,
            unit,
            caveragePerUnit,
            price,
            supplierId,
            UserEstimationLibrary: library
          } = materials[i];

            // create new material
            const newMaterial = await UserMaterials.create({
              name,
              quantity,
              unit,
              caveragePerUnit,
              price,
              supplierId,
              userId: managerId ? managerId : userId,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: newMaterial.id,
              materialFactorQuantity: library?.materialFactorQuantity ? library?.materialFactorQuantity : 0,
              materialTotalAmount: library?.materialTotalAmount ? library?.materialTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
            }, { transaction: t });
          
        }

        // LOOP THROUGH labours
        for (let i = 0; i < labours.length; i++) {
          const {
            name,
            number,
            unit,
            wages,
            caveragePerUnit,
            UserEstimationLibrary: library,
          } = labours[i];

            const newLabour = await UserLabours.create({
              name,
              number,
              unit,
              wages,
              caveragePerUnit,
              userId: managerId ? managerId : userId,
            }, { transaction: t });

            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: newLabour.id,
              labourFactorQuantity: library?.labourFactorQuantity ? library?.labourFactorQuantity : 0,
              labourTotalAmount: library?.labourTotalAmount ? library?.labourTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
            }, { transaction: t });
          
        }

        // LOOP THROUGH subContractors
        for (let i = 0; i < subContractors.length; i++) {
          const {
            name,
            unit,
            quantity,
            price,
            UserEstimationLibrary: library,
          } = subContractors[i];

            const newSubContractor = await UserSubContractors.create({
              name,
              unit,
              quantity,
              price,
              userId: managerId ? managerId : userId,
            }, { transaction: t });

            await await UserEstimationLibrary.create({
              subContractorId: newSubContractor.id,
              subContractorTotalAmount: library?.subContractorTotalAmount ? library?.subContractorTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
            }, { transaction: t }); 
       
      }

    await t.commit();

    return onSuccess(res, 200, 'Estimation copied successfully', newEstimation)
    }
      if(role === 'owner'){
      const estimation = await Estimations.findOne({
        where: { id: req.params.id },
        order: [["id", "ASC"]],
        include: [
          {
            model: EstimationCategory,
            as: "category",
            attributes: ["name"],
          },
          {
            model: Materials,
            as: "materials",
            order: [["id", "DESC"]],
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

      // dupliacte project and if name already exist increment by one;

      if(!estimation) return(res, 404, "Estimation doesn't exist!")
       
      const estimationName = `${estimation.name} copy`;

        const { 
          name,
          estimationUnit,
          estimationQuantity,
          wastagePercentage,
          wastageTotal,
          transportPercentage,
          transportTotal,
          profitPercentage,
          profitTotal,
          overHeadPercentage,
          overHeadTotal,
          contigencyPercentage,
          contigencyTotal,
          subtotal,
          estimationRate,
          estimationTotalAmount,
          estimationCategoryId,
          equipmentCostPerWorkItem,
          equipmentRatePerUnit,
          materialCostPerWorkItem,
          materialRatePerUnit,
          indirectCostPerWorkItem,
          indirectRatePerUnit,
          labourCostperWorkItem,
          labourRatePerUnit,
          subcontractorCostPerWorkItem,
          isApproved,
          equipments,
          materials,
          labours,
          subContractors
        } = estimation
        const newEstimation = await Estimations.create({
          name: estimationName,
          estimationUnit,
          estimationQuantity,
          wastagePercentage,
          wastageTotal,
          transportPercentage,
          transportTotal,
          profitPercentage,
          profitTotal,
          overHeadPercentage,
          overHeadTotal,
          contigencyPercentage,
          contigencyTotal,
          subtotal,
          estimationRate,
          estimationTotalAmount,
          estimationCategoryId,
          equipmentCostPerWorkItem,
          equipmentRatePerUnit,
          materialCostPerWorkItem,
          materialRatePerUnit,
          indirectCostPerWorkItem,
          indirectRatePerUnit,
          labourCostperWorkItem,
          labourRatePerUnit,
          subcontractorCostPerWorkItem,
          isApproved,
        }, { transaction: t });

        // loop through equipment
         for (let i = 0 ; i <equipments.length ; i++) {

            const {
              name,
              unit,
              caveragePerUnit,
              hireRatePrice,
              number,
              supplierId,
              EstimationLibrary: library,
            } = equipments[i];

           const newEquipment = await Equipments.create({
              name,
              unit,
              caveragePerUnit,
              hireRatePrice,
              number,
              supplierId,
            }, { transaction: t });
            // create new EstimationLibary
            await EstimationLibrary.create({
              equipmentId: newEquipment.id,
              equipmentPerformance: library?.equipmentPerformance ? library?.equipmentPerformance : 0,
              equipmentTotalAmount: library?.equipmentTotalAmount ? library?.equipmentTotalAmount : 0,
              estimationId: newEstimation.id,
            }, { transaction: t });
        }

        // LOOP THROUGH Materials
        for (let i = 0; i < materials.length; i++) {
          const {
            name,
            quantity,
            unit,
            caveragePerUnit,
            price,
            supplierId,
            EstimationLibrary: library
          } = materials[i];

            // create new material
            const newMaterial = await Materials.create({
              name,
              quantity,
              unit,
              caveragePerUnit,
              price,
              supplierId,
            }, { transaction: t });
            // create new EstimationLibary
            await EstimationLibrary.create({
              materialId: newMaterial.id,
              materialFactorQuantity: library?.materialFactorQuantity ? library?.materialFactorQuantity : 0,
              materialTotalAmount: library?.materialTotalAmount ? library?.materialTotalAmount : 0,
              estimationId: newEstimation.id,
            }, { transaction: t });
          
        }

        // LOOP THROUGH labours
        for (let i = 0; i < labours.length; i++) {
          const {
            name,
            number,
            unit,
            wages,
            caveragePerUnit,
            EstimationLibrary: library
          } = labours[i];

            const newLabour = await Labours.create({
              name,
              number,
              unit,
              wages,
              caveragePerUnit,
            }, { transaction: t });

            // create new EstimationLibary
            await EstimationLibrary.create({
              labourId: newLabour.id,
              labourFactorQuantity: library?.labourFactorQuantity ? library?.labourFactorQuantity : 0,
              labourTotalAmount: library?.labourTotalAmount ? library?.labourTotalAmount : 0,
              estimationId: newEstimation.id,
            }, { transaction: t });
          
        }

        // LOOP THROUGH subContractors
        for (let i = 0; i < subContractors.length; i++) {
          const {
            name,
            unit,
            quantity,
            price,
            EstimationLibrary: library,
          } = subContractors[i];

            const newSubContractor = await SubContractors.create({
              name,
              unit,
              quantity,
              price,
            }, { transaction: t });

            await await EstimationLibrary.create({
              subContractorId: newSubContractor.id,
              subContractorTotalAmount: library?.subContractorTotalAmount ? library?.subContractorTotalAmount : 0,
              estimationId: newEstimation.id,
            }, { transaction: t }); 
       
      }

    await t.commit();

    return onSuccess(res, 200, 'Estimation copied successfully', newEstimation)
    }


    }catch(error){
      console.log('error: ', error)
      await t.rollback();
      return onError(res, 500, 'Internal Server Error', error.message)
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
      const { id: userId, role, managerId } = req.user;

      if(role === 'manager' || role === 'admin'){
      const estimation = await UserEstimations.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        const calculatedPriceAmount = +equipment?.number * +equipment.hireRatePrice * equipmentPerformance
        const equipmentTotalAmount = calculatedPriceAmount

        // ==============EQUIPMENT TOTAL PRICE====================
        equipmentTotal += equipmentTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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
          +material?.caveragePerUnit * estimationQty;

        const materialTotalAmount = materialFactorQuantity * +material.price;

        // ==============MATERIAL TOTAL PRICE====================
        fuelTotal += materialTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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
        const labourFactorQuantity = +labor?.caveragePerUnit * estimationQty;

        const calculatedWagesAmount = +labor?.number * +labor.wages * labourFactorQuantity;
        const labourTotalAmount = calculatedWagesAmount;

        // ==============MATERIAL TOTAL PRICE====================
        labourTotal += labourTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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

        const subContractorTotalAmount = estimationQty * +subc.price;
        // ==============MATERIAL TOTAL PRICE====================
        subcontractorTotal += subContractorTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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
      const calculatedOverHead= +estimation?.estimationRate * estimationQty * overHead;
      const tempProfit = +estimation?.estimationRate * estimationQty + calculatedOverHead;
      const calculatedProfit = tempProfit * profit;
      const tempContigency = +estimation?.estimationRate * estimationQty + calculatedProfit;
      const calculatedContigency = tempContigency * contigency;

      // calculate estimationRate and estimationTotalAmount formula
      const indirectCostPerWorkItem =
        calculatedOverHead+ calculatedContigency + calculatedProfit;

      // rate per unit formula
      const indirectRatePerUnit = indirectCostPerWorkItem / estimationQty;

      const totalAmount = calculatedSubtotal + indirectCostPerWorkItem;

      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + 
        indirectRatePerUnit;

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
        overHeadTotal: calculatedOverHead.toFixed(2),
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

      return onSuccess(
        res,
        200,
        "Estimation updated successfully",
        estimation
      );
      }
      // estimation Admin
      
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
        const equipmentPerformance = +equipment?.caveragePerUnit * estimationQty;
        const calculatedPriceAmount = +equipment?.number * +equipment.hireRatePrice * equipmentPerformance;
        const equipmentTotalAmount = calculatedPriceAmount

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
          +material?.caveragePerUnit * estimationQty;

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
        const labourFactorQuantity = +labor?.caveragePerUnit * estimationQty;;

        const calculatedWagesAmount = +labor.number * +labor.wages * labourFactorQuantity
        const labourTotalAmount = calculatedWagesAmount;

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

        const subContractorTotalAmount = estimationQty * +subc.price;
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
      const calculatedOverHead= +estimation?.estimationRate * estimationQty * overHead;
      const tempProfit = +estimation?.estimationRate * estimationQty + calculatedOverHead;
      const calculatedProfit = tempProfit * profit;
      const tempContigency = +estimation?.estimationRate * estimationQty + calculatedProfit;
      const calculatedContigency = tempContigency * contigency;

      // calculate estimationRate and estimationTotalAmount formula
      const indirectCostPerWorkItem =
        calculatedOverHead+ calculatedContigency + calculatedProfit;

      // rate per unit formula
      const indirectRatePerUnit = indirectCostPerWorkItem / estimationQty;

      const totalAmount = calculatedSubtotal + indirectCostPerWorkItem;

      const ratePerUnit =
        equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit;

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
        overHeadTotal: calculatedOverHead.toFixed(2),
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

      return onSuccess(
        res,
        200,
        "Estimation updated successfully",
        estimation
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // delete estimation
  static async deleteEstimation(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, role, managerId } = req.user;
      // get all estimation library where estimationId = id
      if(role === 'manager' || role === 'admin'){

      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
      });
      if(!estimation) return onError(res, 404, 'Estimation Not Found')

      const estimationLibrary = await UserEstimationLibrary.findAll({
        where: { estimationId: estimation.id },
      });
      // delete all estimation library
      for (let i = 0; i < estimationLibrary.length; i++) {
        const estimationJunction = await UserEstimationLibrary.findOne({
          where: { estimationId: estimationLibrary[i].estimationId },
        });
        await estimationJunction.destroy();
      }
      
      await estimation.destroy();

      return onSuccess(res, 200, "Estimation deleted successfully", estimation);
    }
    // get all estimation library where estimationId = id

    const estimation = await UserEstimations.findOne({
        where: { id },
      });
    if(!estimation) return onError(res, 404, 'Estimation Not Found')

      const estimationLibrary = await EstimationLibrary.findAll({
        where: { estimationId: estimation.id },
      });
      // delete all estimation library
      for (let i = 0; i < estimationLibrary.length; i++) {
        const estimationJunction = await EstimationLibrary.findOne({
          where: { estimationId: estimationLibrary[i].estimationId },
        });
        await estimationJunction.destroy();
      }

      return onSuccess(res, 200, "Estimation deleted successfully", estimation);
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add equipment to estimation
  static async addEquipmentToEstimation(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, role, managerId } = req.user;
      if(role === 'manager' || role === 'admin'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
      const equipment = await UserEquipments.findOne({
        where: { name: equipmentName, userId: managerId ? managerId : userId },
      });
      const defaultEquipment = await Equipments.findOne({
        where: { name: equipmentName },
      });

      if (!equipment && !defaultEquipment) {
        return onError(
          res,
          404,
          "Equipment not found, add new one or use existing equipment"
        );
      }

      const equipmentExist = estimation.equipments.find(
        (equipment) => equipment.name === equipmentName
      );

      if (equipmentExist) return onError(res, 409, "Equipment Already Added");

      if (defaultEquipment) {
        // create UserMaterials and UserEquipments from defaultEquipment and defaultMaterial

        const existingEquipment = await UserEquipments.findOne({
          where: { name: defaultEquipment.name, userId: managerId ? managerId : userId },
        });

        if (existingEquipment) {
          // formaulas material and equipment

          const equipmentPerformance =
            +existingEquipment?.caveragePerUnit * +estimation.estimationQuantity;
          
          const calculatedPriceAmount = +existingEquipment?.number * +existingEquipment.hireRatePrice * equipmentPerformance;
          const equipmentTotalAmount = calculatedPriceAmount

          // add equipment and mataerial to estimationLibary
          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            equipmentId: existingEquipment.id,
            equipmentPerformance: equipmentPerformance,
            equipmentTotalAmount: equipmentTotalAmount,
          });

          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          //  ========= LABOUR WASTAGE PRICE =======

          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          // =========Calculate Wastage and Transport=======

          const calculatedWastageTotal =
            materialSubtotal * +estimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +estimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

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

          const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
          const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +estimation?.profitPercentage;
          const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +estimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit +
            indirectRatePerUnit
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
        } else {
          const createdEquipment = await UserEquipments.create({
            name: defaultEquipment.name,
            unit: defaultEquipment.unit,
            caveragePerUnit: defaultEquipment?.caveragePerUnit,
            hireRatePrice: defaultEquipment.hireRatePrice,
            number: defaultEquipment.number,
            supplierId: defaultEquipment?.supplierId,
            userId: managerId ? managerId : userId
          });

          // formaulas material and equipment

          const equipmentPerformance =
            +createdEquipment?.caveragePerUnit * +estimation.estimationQuantity;

          const calculatedPriceAmount = +createdEquipment?.number * +createdEquipment.hireRatePrice * equipmentPerformance;
            
          const equipmentTotalAmount = calculatedPriceAmount

          // add equipment and mataerial to estimationLibary
          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            equipmentId: createdEquipment.id,
            equipmentPerformance: equipmentPerformance.toFixed(2),
            equipmentTotalAmount: equipmentTotalAmount.toFixed(2),
          });

          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          // ===============LABOUR =============
          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          // =========Calculate Wastage and Transport=======

          const calculatedWastageTotal =
            materialSubtotal * +estimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +estimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

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
          const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
          const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +estimation?.profitPercentage;
          const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +estimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit +
            indirectRatePerUnit

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
        }
      } 
      if (equipment) {
        // formaulas material and equipment

        const equipmentPerformance = +equipment?.caveragePerUnit * +estimation.estimationQuantity;

        const calculatedPrice = +equipment?.number * +equipment.hireRatePrice * equipmentPerformance

        const equipmentTotalAmount = calculatedPrice;
          
        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          equipmentId: equipment.id,
          equipmentPerformance: equipmentPerformance,
          equipmentTotalAmount: equipmentTotalAmount,
        });

        const updateEstimation = await UserEstimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: UserMaterials,
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
              model: UserEquipments,
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
              model: UserLabours,
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
              model: UserSubContractors,
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
          return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
        }, 0);

        // ========LABOURS ==============
        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
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
        const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
        const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +estimation?.profitPercentage;
        const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +estimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit +
          indirectRatePerUnit;

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
      
    }
  }

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


        const equipmentPerformance = +equipment?.caveragePerUnit * +estimation.estimationQuantity;

        const calculatedPrice = +equipment.number * +equipment.hireRatePrice * equipmentPerformance;
        const equipmentTotalAmount = calculatedPrice;

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
        const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
        const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +estimation?.profitPercentage;
        const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +estimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit +
          indirectRatePerUnit;

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
      const { id: userId, role, managerId } = req.user;
      if(role === 'manager' || role === 'admin'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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

      // remove equipment from UserEstimationLibrary
      await UserEstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          equipmentId: equipmentExist.id,
        },
      });

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        return acc + +curr.UserEstimationLibrary.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary.materialTotalAmount;
      }, 0);

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
      }, 0);

      // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;
      

      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit +
        indirectRatePerUnit;

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
      }
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit +
        indirectRatePerUnit;

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
      const { caveragePerUnit, equipmentName, editName, editUnit, equipmentPrice, number } = req.body;

      // estimation
      const { id: userId, role, managerId } = req.user;
  
      if(role === 'manager' || role === 'admin'){
      const estimation = await UserEstimations.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        : +equipmentExist?.caveragePerUnit;

      // equipment price
      const equipPrice = equipmentPrice
        ? equipmentPrice
        : +equipmentExist.hireRatePrice;
      // equipment id
      const equipmentId = equipmentExist.id;

      const equipmentNumber = number ? number : +equipmentExist.number;

      const editEquipmentName = editName ? editName : equipmentExist.name;
      const editEquipmentUnit = editUnit ? editUnit : equipmentExist.unit;

      // find equipment
      const equipment = await UserEquipments.findOne({
        where: { name: equipmentName, id: equipmentId },
      });

      // update equipment
      await equipment.update({
        caveragePerUnit: caverage,
        hireRatePrice: equipPrice,
        number: equipmentNumber,
        name: editEquipmentName,
        unit: editEquipmentUnit,
      });

      // make new calculation;

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        const equipmentPerformance = +equipment?.caveragePerUnit * estimationQty;

        const calculatePrice = +equipment?.number * +equipment.hireRatePrice * equipmentPerformance;
        const equipmentTotalAmount = calculatePrice;

        // ==============EQUIPMENT TOTAL PRICE====================
        equipmentTotal += equipmentTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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
        return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
      }, 0);

      //  ========= LABOUR WASTAGE PRICE =======

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
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
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit = equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit;

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
      }
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
        : +equipmentExist?.caveragePerUnit;

      // equipment price
      const equipPrice = equipmentPrice
        ? equipmentPrice
        : +equipmentExist.hireRatePrice;
      // equipment id
      const equipmentId = equipmentExist.id;

      const equipmentNumber = number ? number : +equipmentExist.number;
      const editEquipmentName = editName ? editName : equipmentExist.name;
      const editEquipmentUnit = editUnit ? editUnit : equipmentExist.unit;

      // find equipment
      const equipment = await Equipments.findOne({
        where: { name: equipmentName, id: equipmentId },
      });

      // update equipment
      await equipment.update({
        caveragePerUnit: caverage,
        hireRatePrice: equipPrice,
        number: equipmentNumber,
        name: editEquipmentName,
        unit: editEquipmentUnit,
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
        const equipmentPerformance = +equipment?.caveragePerUnit * estimationQty;

        const calculatedPrice = +equipment?.number * +equipment.hireRatePrice * equipmentPerformance;
        const equipmentTotalAmount = calculatedPrice

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
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit = equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit;

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
      const { id: userId, role, managerId } = req.user;
      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
      const material = await UserMaterials.findOne({
        where: { name: materialName, userId: managerId ? managerId : userId },
      });
      const defaultmaterial = await Materials.findOne({
        where: { name: materialName },
      });

      if (!material && !defaultmaterial) {
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

      if (defaultmaterial) {
        // create UserMaterials from defaultMaterial

        const existingMaterial = await UserMaterials.findOne({
          where: { name: defaultmaterial.name, userId: managerId ? managerId : userId },
        });

        if (existingMaterial) {
          // formaulas material

          const materialFactorQuantity =
            +existingMaterial?.caveragePerUnit * +estimation.estimationQuantity;

          const materialTotalAmount =
            materialFactorQuantity * +existingMaterial.price;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            materialId: existingMaterial.id,
            materialFactorQuantity: materialFactorQuantity,
            materialTotalAmount: materialTotalAmount,
          });

          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          //  ========= LABOUR WASTAGE PRICE =======

          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          // =========Calculate Wastage and Transport=======

          const calculatedWastageTotal =
            materialSubtotal * +estimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +estimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

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
          const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
          const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +estimation?.profitPercentage;
          const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +estimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit + 
            indirectRatePerUnit;
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
        } else {
          const createdMaterial = await UserMaterials.create({
            name: defaultmaterial.name,
            unit: defaultmaterial.unit,
            caveragePerUnit: defaultmaterial?.caveragePerUnit,
            quantity: defaultmaterial.quantity,
            price: defaultmaterial.price,
            supplierId: defaultmaterial?.supplierId,
            userId: managerId ? managerId : userId 
          });

          // formaulas material and equipment

          const materialFactorQuantity =
            +createdMaterial?.caveragePerUnit * +estimation.estimationQuantity;

          const materialTotalAmount =
            materialFactorQuantity * +createdMaterial.price;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            materialId: createdMaterial.id,
            materialFactorQuantity: materialFactorQuantity,
            materialTotalAmount: materialTotalAmount,
          });
          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          //  ========= LABOUR WASTAGE PRICE =======

          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          // =========Calculate Wastage and Transport=======

          const calculatedWastageTotal =
            materialSubtotal * +estimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +estimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

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
          const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
          const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +estimation?.profitPercentage;
          const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +estimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit + indirectRatePerUnit;

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
        }
      } if (material) {
        // formaulas material and equipment

        const materialFactorQuantity =
          +material?.caveragePerUnit * +estimation.estimationQuantity;

        const materialTotalAmount = materialFactorQuantity * +material.price;

        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          materialId: material.id,
          materialFactorQuantity: materialFactorQuantity,
          materialTotalAmount: materialTotalAmount,
        });

        const updateEstimation = await UserEstimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: UserMaterials,
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
              model: UserEquipments,
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
              model: UserLabours,
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
              model: UserSubContractors,
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
          return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
        }, 0);

        //  ========= LABOUR WASTAGE PRICE =======

        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
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
        const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
        const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +estimation?.profitPercentage;
        const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +estimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit + indirectRatePerUnit;

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
      }
    }

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
          +material?.caveragePerUnit * +estimation.estimationQuantity;

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
        const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
        const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +estimation?.profitPercentage;
        const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +estimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit + indirectRatePerUnit;

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
      console.log('add material error: ', error)
      return onError(res, 500, "Internal Server Error");
    }
  }

  // remove material from estimation
  static async removeMaterialFromEstimation(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, role, managerId } = req.user;
      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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

      // remove equipment from UserEstimationLibrary
      await UserEstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          materialId: materialExist.id,
        },
      });

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
      }, 0);

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
      }, 0);

      // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;
      

      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit

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
      }
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit

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
      const { caveragePerUnit, materialName, editName, editUnit, materialPrice, quantity } =
        req.body;

      // estimation
      const { id: userId, role, managerId } = req.user;
      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        : +materialExist?.caveragePerUnit;

      // equipment price
      const matPrice = materialPrice ? materialPrice : +materialExist.price;
      // equipment id
      const materialId = materialExist.id;
      const materialQuantity = quantity ? quantity : +materialExist.quantity;

      const editMaterialName = editName ? editName : materialExist.name;
      const editMaterialUnit = editUnit ? editUnit : materialExist.unit

      // find equipment
      const material = await UserMaterials.findOne({
        where: { name: materialName, id: materialId },
      });

      // update equipment
      await material.update({
        caveragePerUnit: caverage,
        price: matPrice,
        quantity: materialQuantity,
        name: editMaterialName,
        unit: editMaterialUnit,
      });

      // make new calculation;

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
          +material?.caveragePerUnit * estimationQty;

        const materialTotalAmount = materialFactorQuantity * +material.price;

        // ==============Material TOTAL PRICE====================
        materialTotal += materialTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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
        return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
      }, 0);

      // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;

      // ==============MATERIAL TOTAL PRICE====================
      const equipmentTotal = equipments.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
      }, 0);

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
      const subtotal = materialCostPerWorkItem + equipmentCostPerWorkiItem + labourCostperWorkItem + subcontractorCostPerWorkItem

      

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit = equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit;

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
      }
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
        : +materialExist?.caveragePerUnit;

      // equipment price
      const matPrice = materialPrice ? materialPrice : +materialExist.price;
      // equipment id
      const materialId = materialExist.id;
      const materialQuantity = quantity ? quantity : +materialExist.quantity;

      const editMaterialName = editName ? editName : materialExist.name;
      const editMaterialUnit = editUnit ? editUnit : materialExist.unit

      // find equipment
      const material = await Materials.findOne({
        where: { name: materialName, id: materialId },
      });

      // update equipment
      await material.update({
        caveragePerUnit: caverage,
        price: matPrice,
        quantity: materialQuantity,
        name: editMaterialName,
        unit: editMaterialUnit,
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
          +material?.caveragePerUnit * estimationQty;

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
      const subtotal = materialCostPerWorkItem + equipmentCostPerWorkiItem + labourCostperWorkItem + subcontractorCostPerWorkItem;

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit = equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit;

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
      const { id: userId, role, managerId } = req.user;
      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
      const labour = await UserLabours.findOne({
        where: { name: labourName, userId: managerId ? managerId : userId },
      });
      const defaultLabour = await Labours.findOne({
        where: { name: labourName },
      });

      if (!labour && !defaultLabour) {
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

      if (defaultLabour) {
        // create UserLabours from defaultLabour

        const existingLabour = await UserLabours.findOne({
          where: { name: defaultLabour.name, userId: managerId ? managerId : userId },
        });

        if (existingLabour) {
          // formaulas material

          const labourFactorQuantity = +existingLabour?.caveragePerUnit * +estimation.estimationQuantity;
          const calculatedWages = +existingLabour?.number * existingLabour?.wages * labourFactorQuantity;
          const labourTotalAmount = calculatedWages;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            labourId: existingLabour.id,
            labourFactorQuantity,
            labourTotalAmount,
          });

          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          // ============== LABOUR TOTAL PRICE ============

          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          // =========Calculate Wastage and Transport=======

          // material
          const calculatedWastageTotal =
            materialSubtotal * +estimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +estimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

          const materialRatePerUnit =
            materialCostPerWorkItem / +updateEstimation.estimationQuantity;

          // equipment
          const equipmentCostPerWorkiItem = equipmentTotal;
          const equipmentRatePerUnit =
            equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
          const subtotal =
            materialCostPerWorkItem +
            equipmentCostPerWorkiItem +
            subcontractorCostPerWorkItem +
            labourCostperWorkItem;

          // calculate Overhead, Contigency and Profit
          const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
          const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
          const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit + indirectRatePerUnit
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
        } else {
          const createdLabour = await UserLabours.create({
            name: defaultLabour.name,
            unit: defaultLabour.unit,
            caveragePerUnit: defaultLabour?.caveragePerUnit,
            number: defaultLabour.number,
            wages: defaultLabour.wages,
            userId: managerId ? managerId : userId,
          });

          // formaulas material and equipment

          const labourFactorQuantity = +createdLabour?.caveragePerUnit * +estimation.estimationQuantity;
          const calculatedWages = +createdLabour?.number * +createdLabour.wages * labourFactorQuantity
          const labourTotalAmount = calculatedWages;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            labourId: createdLabour.id,
            labourFactorQuantity,
            labourTotalAmount,
          });
          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          // ============== LABOUR TOTAL PRICE ============

          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          // =========Calculate Wastage and Transport=======

          const calculatedWastageTotal =
            materialSubtotal * +updateEstimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +updateEstimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

          const materialRatePerUnit =
            materialCostPerWorkItem / +updateEstimation.estimationQuantity;

          const equipmentCostPerWorkiItem = equipmentTotal;
          const equipmentRatePerUnit =
            equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
          const subtotal =
            materialCostPerWorkItem +
            equipmentCostPerWorkiItem +
            subcontractorCostPerWorkItem +
            labourCostperWorkItem;

          // calculate Overhead, Contigency and Profit
          const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
          const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
          const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit + indirectRatePerUnit;

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
        }
      } if (labour) {
        // formaulas material and equipment

        const labourFactorQuantity = +labour?.caveragePerUnit * +estimation.estimationQuantity;
        const calculatedWages = +labour?.number * +labour.wages * labourFactorQuantity;

        const labourTotalAmount = calculatedWages;

        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          labourId: labour.id,
          labourFactorQuantity,
          labourTotalAmount,
        });

        const updateEstimation = await UserEstimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: UserMaterials,
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
              model: UserEquipments,
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
              model: UserLabours,
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
              model: UserSubContractors,
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
          return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
        }, 0);

        // ============== LABOUR TOTAL PRICE ============

        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
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
        const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
        const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
        const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit + indirectRatePerUnit;

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
      }
    }

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
        where: { name: labourName },
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

        const labourFactorQuantity = +labour?.caveragePerUnit * +estimation.estimationQuantity;
        
        const calculatedWage = +labour?.number * +labour.wages * labourFactorQuantity;

        const labourTotalAmount = calculatedWage

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
        const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
        const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
        const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit + indirectRatePerUnit;

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
      const { id: userId, role, managerId } = req.user;

      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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

      // remove equipment from UserEstimationLibrary
      await UserEstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          labourId: labourExist.id,
        },
      });

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
      }, 0);

      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit;

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
      }
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit;

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
      const { caveragePerUnit, labourName, editName, editUnit, wages, number } = req.body;

      // estimation
      const { id: userId, role, managerId } = req.user;

      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        : +labourExist?.caveragePerUnit;

      // equipment price
      const labWages = wages ? wages : +labourExist.wages;
      // equipment id
      const labourId = labourExist.id;
      const labourNumber = number ? number : +labourExist.number;

      const labourLabourName = editName ? editName : labourExist.name;
      const labourLabourUnit = editUnit ? editUnit : labourExist.unit

      // find equipment
      const labour = await UserLabours.findOne({
        where: { name: labourName, id: labourId },
      });

      // update equipment
      await labour.update({
        caveragePerUnit: caverage,
        wages: labWages,
        number: labourNumber,
        name: labourLabourName,
        unit: labourLabourUnit,
      });

      // make new calculation;

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        const labourFactorQuantity = +labour?.caveragePerUnit * estimationQty;

        const calculatedWage = +labour.wages * labourNumber * labourFactorQuantity
        const labourTotalAmount = calculatedWage;

        // ==============Material TOTAL PRICE====================
        labourTotal += labourTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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
        return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
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
        return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
      }, 0);

      const equipmentCostPerWorkiItem = equipmentTotal;
      const equipmentRatePerUnit =
        equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;

      // ============== SUB CONTRACTOR TOTAL PRICE
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
      }, 0);

          // Subcontractor
      const subcontractorCostPerWorkItem = subcontractorTotal;
      const subtotal =
        materialCostPerWorkItem +
        equipmentCostPerWorkiItem +
        labourCostperWorkItem + subcontractorCostPerWorkItem

      // calculate Overhead, Contigency and Profit
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit;

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
      }
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
        : +labourExist?.caveragePerUnit;

      // equipment price
      const labWages = wages ? wages : +labourExist.wages;
      // equipment id
      const labourId = labourExist.id;
      const labourNumber = number ? number : +labourExist.number;

      const labourLabourName = editName ? editName : labourExist.name;
      const labourLabourUnit = editUnit ? editUnit : labourExist.unit

      // find equipment
      const labour = await Labours.findOne({
        where: { name: labourName, id: labourId },
      });

      // update equipment
      await labour.update({
        caveragePerUnit: caverage,
        wages: labWages,
        number: labourNumber,
        name: labourLabourName,
        unit: labourLabourUnit,
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
        const labourFactorQuantity = +labour?.caveragePerUnit * estimationQty

        const calculatedWages = +labour.wages * labourNumber * labourFactorQuantity
        const labourTotalAmount = calculatedWages;

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
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit;

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
      const { id: userId, role, managerId } = req.user;

      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
      const subcontractor = await UserSubContractors.findOne({
        where: { name: subcontractorName, userId: managerId ? managerId : userId },
      });
      const default_subcontractor = await SubContractors.findOne({
        where: { name: subcontractorName },
      });

      if (!subcontractor && !default_subcontractor) {
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

      if (default_subcontractor) {
        // create UserLabours from default_subcontractor

        const existing_subcontractor = await UserSubContractors.findOne({
          where: { name: default_subcontractor.name, userId: managerId ? managerId : userId },
        });

        if (existing_subcontractor) {
          // formaulas material

          const subContractorTotalAmount =
            +estimation.estimationQuantity * +existing_subcontractor.price;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            subContractorId: existing_subcontractor.id,
            subContractorTotalAmount,
          });

          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          // ============== LABOUR TOTAL PRICE ============

          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          // ============== SUB CONTRACTOR TOTAL PRICE
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // =========Calculate Wastage and Transport=======

          // material
          const calculatedWastageTotal =
            materialSubtotal * +estimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +estimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

          const materialRatePerUnit =
            materialCostPerWorkItem / +updateEstimation.estimationQuantity;

          // equipment
          const equipmentCostPerWorkiItem = equipmentTotal;
          const equipmentRatePerUnit =
            equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
          const subtotal =
            materialCostPerWorkItem +
            equipmentCostPerWorkiItem +
            labourCostperWorkItem +
            subcontractorCostPerWorkItem;

          // calculate Overhead, Contigency and Profit
          const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
          const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
          const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit + indirectRatePerUnit
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
            "Subcontractor added successfully",
            updateEstimation
          );
        } else {
          const created_subcontractor = await UserSubContractors.create({
            name: default_subcontractor.name,
            unit: default_subcontractor.unit,
            quantity: estimation.estimationQuantity,
            price: default_subcontractor.price,
            userId: managerId ? managerId : userId
          });

          // formaulas subcontractor

          const subContractorTotalAmount =
            +created_subcontractor.quantity * +created_subcontractor.price;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            subContractorId: created_subcontractor.id,
            subContractorTotalAmount: subContractorTotalAmount.toFixed(2),
          });
          const updateEstimation = await UserEstimations.findOne({
            where: { id: estimation.id },
            include: [
              {
                model: UserMaterials,
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
                model: UserEquipments,
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
                model: UserLabours,
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
                model: UserSubContractors,
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
            return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
          }, 0);

          // ==============MATERIAL TOTAL PRICE====================
          const materialSubtotal = materials.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
          }, 0);

          // ============== LABOUR TOTAL PRICE ============

          const labourTotal = labours.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
          }, 0);

          const labourCostperWorkItem = labourTotal;
          const labourRatePerUnit =
            labourCostperWorkItem / +updateEstimation.estimationQuantity;

          // ============== SUB CONTRACTOR TOTAL PRICE ===========
          const subcontractorTotal = subContractors.reduce((acc, curr) => {
            return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
          }, 0);

          // Subcontractor
          const subcontractorCostPerWorkItem = subcontractorTotal;

          // =========Calculate Wastage and Transport=======

          const calculatedWastageTotal =
            materialSubtotal * +updateEstimation?.wastagePercentage;
          const calculatedTransportTotal =
            materialSubtotal * +updateEstimation?.transportPercentage;

          const materialCostPerWorkItem =
            materialSubtotal +
            calculatedWastageTotal +
            calculatedTransportTotal;

          const materialRatePerUnit =
            materialCostPerWorkItem / +updateEstimation.estimationQuantity;

          const equipmentCostPerWorkiItem = equipmentTotal;
          const equipmentRatePerUnit =
            equipmentCostPerWorkiItem / +updateEstimation.estimationQuantity;
          const subtotal =
            materialCostPerWorkItem +
            equipmentCostPerWorkiItem +
            subcontractorCostPerWorkItem +
            labourCostperWorkItem;

          // calculate Overhead, Contigency and Profit
          const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
          const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
          const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
          const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
          const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

          const indirectCostPerWorkItem =
            calculatedOverHead + calculatedContigency + calculatedProfit;
          const indirectRatePerUnit =
            indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

          const totalAmount = subtotal + indirectCostPerWorkItem;
          const ratePerUnit =
            equipmentRatePerUnit +
            materialRatePerUnit +
            labourRatePerUnit + indirectRatePerUnit

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
        }
      } if (subcontractor) {
        // formaulas material and equipment


        const subContractorTotalAmount =
          +estimation.estimationQuantity * +subcontractor.price;

        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          subContractorId: subcontractor.id,
          subContractorTotalAmount,
        });

        const updateEstimation = await UserEstimations.findOne({
          where: { id: estimation.id },
          include: [
            {
              model: UserMaterials,
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
              model: UserEquipments,
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
              model: UserLabours,
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
              model: UserSubContractors,
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
          return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
        }, 0);

        // ==============MATERIAL TOTAL PRICE====================
        const materialSubtotal = materials.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
        }, 0);

        // ============== LABOUR TOTAL PRICE ============

        const labourTotal = labours.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
        }, 0);

        const labourCostperWorkItem = labourTotal;
        const labourRatePerUnit =
          labourCostperWorkItem / +updateEstimation.estimationQuantity;

        // ============== SUB CONTRACTOR TOTAL PRICE ===========
        const subcontractorTotal = subContractors.reduce((acc, curr) => {
          return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
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
        const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
        const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
        const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit + indirectRatePerUnit

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
      }
    }
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
         +estimation.estimationQuantity * +subcontractor.price;

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
        const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
        const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
        const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
        const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
        const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

        const indirectCostPerWorkItem =
          calculatedOverHead + calculatedContigency + calculatedProfit;
        const indirectRatePerUnit =
          indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

        const totalAmount = subtotal + indirectCostPerWorkItem;
        const ratePerUnit =
          equipmentRatePerUnit +
          materialRatePerUnit +
          labourRatePerUnit + indirectRatePerUnit;

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
      const { id: userId, role, managerId } = req.user;

      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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

      // remove equipment from UserEstimationLibrary
      await UserEstimationLibrary.destroy({
        where: {
          estimationId: estimation.id,
          subContractorId: subc_Exist.id,
        },
      });

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
        return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
      }, 0);

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
      }, 0);

      // ============== LABOUR TOTAL PRICE ============

      const labourTotal = labours.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ============== SUB CONTRACTOR TOTAL PRICE ===========
      const subcontractorTotal = subContractors.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.subContractorTotalAmount;
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit;

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
      }
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
      const calculatedOverHead= +estimation?.estimationRate * +estimation.estimationQuantity * +estimation?.overHeadPercentage;
      const tempProfit = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +estimation?.profitPercentage;
      const tempContigency = +estimation?.estimationRate * +estimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +estimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +estimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit

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
      const { subcontractorName, price, editName, editUnit } = req.body;

      // estimation
      const { id: userId, role, managerId } = req.user;

      if(role !== 'owner'){
      const estimation = await UserEstimations.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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
      // const subc_quantity = quantity ? quantity : +subc_Exist.quantity;
      const editSubContractorName = editName ? editName : subc_Exist.name
      const editSubcontractorUnit = editUnit ? editUnit : subc_Exist.unit

      // find subcontractor
      const subcontractor = await UserSubContractors.findOne({
        where: { name: subcontractorName, id: subContractorId },
      });

      // update equipment
      await subcontractor.update({
        price: subc_price,
        name: editSubContractorName,
        unit: editSubcontractorUnit
      });

      // make new calculation;

      const updateEstimation = await UserEstimations.findOne({
        where: { id: estimation.id },
        include: [
          {
            model: UserMaterials,
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
            model: UserEquipments,
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
            model: UserLabours,
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
            model: UserSubContractors,
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

        const subContractorTotalAmount = +updateEstimation.estimationQuantity * +subco.price;

        // ==============Material TOTAL PRICE====================
        subc_Total += subContractorTotalAmount;
        // Update estimationLibrary
        const estimationLibary = await UserEstimationLibrary.findOne({
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
        return acc + +curr.UserEstimationLibrary?.labourTotalAmount;
      }, 0);

      const labourCostperWorkItem = labourTotal;
      const labourRatePerUnit =
        labourCostperWorkItem / +updateEstimation.estimationQuantity;

      // ==============MATERIAL TOTAL PRICE====================
      const materialSubtotal = materials.reduce((acc, curr) => {
        return acc + +curr.UserEstimationLibrary?.materialTotalAmount;
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
        return acc + +curr.UserEstimationLibrary?.equipmentTotalAmount;
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
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit;

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
      }
      const estimation = await Estimations.findOne({
        where: { id: req.params.id },
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
      // const subc_quantity = quantity ? quantity : +subc_Exist.quantity;
      const editSubContractorName = editName ? editName : subc_Exist.name

      // find subcontractor
      const subcontractor = await SubContractors.findOne({
        where: { name: subcontractorName, id: subContractorId },
      });

      // update equipment
      await subcontractor.update({
        price: subc_price,
        name: editSubContractorName,
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

        const subContractorTotalAmount = +updateEstimation.estimationQuantity * +subco.price;

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
      const calculatedOverHead= +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity * +updateEstimation?.overHeadPercentage;
      const tempProfit = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedOverHead;
      const calculatedProfit = tempProfit * +updateEstimation?.profitPercentage;
      const tempContigency = +updateEstimation?.estimationRate * +updateEstimation.estimationQuantity  + calculatedProfit;
      const calculatedContigency = tempContigency * +updateEstimation?.contigencyPercentage;

      const indirectCostPerWorkItem =
        calculatedOverHead + calculatedContigency + calculatedProfit;
      const indirectRatePerUnit =
        indirectCostPerWorkItem / +updateEstimation.estimationQuantity;

      const totalAmount = subtotal + indirectCostPerWorkItem;
      const ratePerUnit =
        equipmentRatePerUnit +
        materialRatePerUnit +
        labourRatePerUnit + indirectRatePerUnit

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

export default UserEstimationController;

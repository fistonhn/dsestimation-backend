import {
  Projects,
  UserMaterials,
  UserEquipments,
  UserEstimations,
  UserEstimationLibrary,
  Estimations,
  Equipments,
  Materials,
  Labours,
  UserLabours,
  SubContractors,
  UserSubContractors,
  UserEstimationCategory,
  EstimationCategory,
  UserEstimationsConsumption,
  UserEquipmentConsumption,
  UserLabourConsumption,
  UserMaterialConsumption,
  UserSubcontractorConsumption,
} from "../../database/models";
import { onSuccess, onError } from "../../utils/response";
import sequelize from '../transaction/sequelize'

class UserProjectsController {
  // get all projects
  static async getAllProjects(req, res) {
    try {
      // fetch all projects and their work specification and include equipments with UserEstimationLibrary junction table
      const { id: userId, managerId, role } = req.user;

      if(role === 'admin'){
        const projects = await Projects.findAll({
          where: { adminId: userId },
          order: [["createdAt", "DESC"]],
        });
        return onSuccess(res, 200, "Projects Fetched Successfully", projects);
      }
      if(role === 'manager'){
        const projects = await Projects.findAll({
          where: { userId },
          order: [["createdAt", "DESC"]],
        });
        return onSuccess(res, 200, "Projects Fetched Successfully", projects);
      }
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // get project by id
  static async getProjectById(req, res) {
    try {
      const { id: userId, managerId, role } = req.user;

      if(role === 'admin'){
        const project = await Projects.findOne({
          where: { id: req.params.id, adminId: userId },
        });
  
        const estimations = await UserEstimations.findAll({
          where: { userId: managerId, projectId: req.params.id },
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
            {
              model: UserEstimationsConsumption,
              as: "estimation_consumed",
              include: [
                {
                  model: UserEquipmentConsumption,
                  as: "consumed_equipment",
                },
                {
                  model: UserLabourConsumption,
                  as: "consumed_labour",
                },
                {
                  model: UserMaterialConsumption,
                  as: "consumed_material",
                },
                {
                  model: UserSubcontractorConsumption,
                  as: "consumed_subcontractor",
                },
              ]
            },
          ],
        });
  
        const projectData = { ...project.dataValues, activities: estimations };
  
        return onSuccess(res, 200, "Project Fetched Successfully", projectData);
      }

      if(role === 'manager'){
        const project = await Projects.findOne({
          where: { id: req.params.id, userId },
        });
  
        const estimations = await UserEstimations.findAll({
          where: { userId, projectId: req.params.id },
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
            {
              model: UserEstimationsConsumption,
              as: "estimation_consumed",
              include: [
                {
                  model: UserEquipmentConsumption,
                  as: "consumed_equipment",
                  attributes: ['name','unit', 'consumedQuantity', 'consumedPrice', 'consumedDate', 'consumedTotal'],
                  include: [
                    {
                      model: UserEquipments,
                      as: 'consumed_equipment',
                      attributes: ['name', 'unit']
                    }
                  ]
                },
                {
                  model: UserLabourConsumption,
                  as: "consumed_labour",
                  attributes: ['name','unit', 'consumedQuantity', 'consumedPrice', 'consumedDate', 'consumedTotal'],
                  include: [
                    {
                      model: UserLabours,
                      as: 'consumed_labour',
                      attributes: ['name', 'unit']
                    }
                  ]
                },
                {
                  model: UserMaterialConsumption,
                  as: "consumed_material",
                  attributes: ['name','unit', 'consumedQuantity', 'consumedPrice', 'consumedDate', 'consumedTotal'],
                  include: [
                    {
                      model: UserMaterials,
                      as: 'consumed_material',
                      attributes: ['name', 'unit']
                    }
                  ]
                },
                {
                  model: UserSubcontractorConsumption,
                  as: "consumed_subcontractor",
                  attributes: ['name','unit', 'consumedQuantity', 'consumedPrice', 'consumedDate', 'consumedTotal'],
                  include: [
                    {
                      model: UserSubContractors,
                      as: 'consumed_subcontractor',
                      attributes: ['name', 'unit']
                    }
                  ]
                },
              ]
            },
          ],
        });
  
        const projectData = { ...project.dataValues, activities: estimations };
  
        return onSuccess(res, 200, "Project Fetched Successfully", projectData);

      }
    } catch (error) {
      console.log('error: ', error)
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // create project and  imports estimations equipments into project
  static async createProject(req, res) {
    try {
      const { id: userId, managerId, role } = req.user;
      const { name } = req.body;

      if(role === 'admin'){

        const projectExist = await Projects.findOne({
           where: { name, adminId: userId },
         });

        if (projectExist) {
          return onError(res, 400, "Project name already exists");
        }

      // create project
      const project = await Projects.create({
        adminId: userId,
        userId: managerId,
        ...req.body,
      });

      return onSuccess(res, 201, "Project Created Successfully", project);
      }
      
      if(role === 'manager'){
      // project name already exists
      const projectExist = await Projects.findOne({
        where: { name, userId },
      });
      if (projectExist) {
        return onError(res, 400, "Project name already exists");
      }
      // create project
      const project = await Projects.create({
        userId,
        ...req.body,
      });
      return onSuccess(res, 201, "Project Created Successfully", project);
      }

    } catch (error) {
      console.log(error)
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // edit project
  static async editProject(req, res) {
    try {
      const { id: userId, managerId } = req.user;

      const project = await Projects.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
      });
      await project.update({ ...req.body });

      return onSuccess(res, 200, "Project Updated Successfully", project);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // approved the project

  static async approveProject(req, res){
    try{
      const { id: userId, role, managerId } = req.user;
      const project = await Projects.findOne({
        where: { id: req.params.id, userId: managerId ? managerId : userId },
      });

      if(role !== 'manager') return onError(res, 401, 'You are not allowed to approve or disapprove project')
       
      const { isApproved } = project;

      if (isApproved) {
          await project.update({ isApproved: false });
          return onSuccess(res, 200, "Project disapproved successfully", project);
      } else {
        await project.update({ isApproved: true });
        return onSuccess(res, 200, "Project Approved successfully", project);
      }

    } catch(error){
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // add project activity by adding caterory
  static async addProjectActivity(req, res) {
    const t = await sequelize.transaction()
    try {
      const { id: userId, managerId } = req.user;
      const { projectId } = req.params;
      const { activityName } = req.body;

      // find project
      const project = await Projects.findOne({
        where: { id: projectId, userId: managerId ? managerId : userId },
      });
      if (!project) {
        return onError(res, 404, "Project not found");
      }

      // search category in the default category
      const defaultCategory = await EstimationCategory.findOne({
        where: { name: activityName, isApproved: true },
        include: [
          {
            model: Estimations,
            as: "activities",
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
                  attributes: ["subContractorTotalAmount"],
                },
              },
            ],
          },
        ],
      });
      // search category in the user category
      const userCategory = await UserEstimationCategory.findOne({
        where: { name: activityName },
        include: [
          {
            model: UserEstimations,
            as: "activities",
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
                  attributes: ["subContractorTotalAmount"],
                },
              },
            ],
          },
        ],
      });

      // if category not found in the default category and user category return error
      if (!defaultCategory && !userCategory) {
        return onError(res, 404, "Category not found, please create new one");
      }
      if (userCategory) {
        const estimation = await UserEstimations.findAll({
          where: { userEstimationCategoryId: userCategory.id, userId: managerId ? managerId : userId },
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
                attributes: ["subContractorTotalAmount"],
              },
            },
          ],
        });
        // create new userCategory with userId and projectId
        const categoryExist = await UserEstimationCategory.findOne({
          where: {
            userId: managerId ? managerId : userId,
            projectId,
            name: userCategory.name,
          },
        });
        if (categoryExist) {
          return onError(
            res,
            409,
            "Activity already exists, please add estimation to it."
          );
        }
        const category = await UserEstimationCategory.create({
          userId: managerId ? managerId : userId,
          projectId,
          name: userCategory.name,
        });
        // const { activities: userActivities } = userCategory;

        // create userEstimation with userId and projectId
        for (let i = 0; i < estimation.length; i++) {
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
            subContractors,
          } = estimation[i];
          const newEstimation = await UserEstimations.create({
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
            userEstimationCategoryId: category.id,
            projectId,
            userId: managerId ? managerId : userId,
          });

          for (let j = 0; j < equipments.length; j++) {
            // Equipments
            const {
              name: equipmentName,
              unit: equipmentUnit,
              caveragePerUnit: equipmentCaveragePerUnit,
              hireRatePrice: equipmentHireRate,
              number: equipmentNumber,
              supplierId: equipmentSupplier,
              UserEstimationLibrary: equiplibrary,
            } = equipments[j];

            const userEquipment = await UserEquipments.findOne({
              where: { name, projectId },
            });
            if (!userEquipment) {
              const newEquipment = await UserEquipments.create({
                name: equipmentName,
                unit: equipmentUnit,
                caveragePerUnit: equipmentCaveragePerUnit,
                hireRatePrice: equipmentHireRate,
                number: equipmentNumber,
                supplierId: equipmentSupplier,
                userId: managerId ? managerId : userId,
                projectId,
              });
              // create new UserEstimationLibary
              await UserEstimationLibrary.create({
                equipmentId: newEquipment.id,
                equipmentPerformance: equiplibrary?.equipmentPerformance,
                equipmentTotalAmount: equiplibrary?.equipmentTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            } else {
              // CREATE UserEstimationLibary
              await UserEstimationLibrary.create({
                equipmentId: userEquipment.id,
                equipmentPerformance: equiplibrary?.equipmentPerformance,
                equipmentTotalAmount: equiplibrary?.equipmentTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            }
          }

          for (let k = 0; k < materials.length; k++) {
            // materials
            const {
              name: materialName,
              quantity: materilQuantity,
              unit: materialUnit,
              caveragePerUnit: materialCavergae,
              price: materialPrice,
              supplierId: materialSupplier,
              UserEstimationLibrary: matlibrary,
            } = materials[k];

            const userMaterial = await UserMaterials.findOne({
              where: { name, projectId },
            });

            if (!userMaterial) {
              const newMaterial = await UserMaterials.create({
                name: materialName,
                quantity: materilQuantity,
                unit: materialUnit,
                caveragePerUnit: materialCavergae,
                price: materialPrice,
                supplierId: materialSupplier,
                userId: managerId ? managerId : userId,
                projectId,
              });
              // create new UserEstimationLibary
              await UserEstimationLibrary.create({
                materialId: newMaterial.id,
                materialFactorQuantity: matlibrary.materialFactorQuantity,
                materialTotalAmount: matlibrary.materialTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            } else {
              // CREATE UserEstimationLibary
              await UserEstimationLibrary.create({
                materialId: userMaterial.id,
                materialFactorQuantity: matlibrary.materialFactorQuantity,
                materialTotalAmount: matlibrary.materialTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            }
          }

          for (let l = 0; l < labours.length; l++) {
            // labours
            const {
              name: labourName,
              unit: labourUnit,
              caveragePerUnit: labourCaverage,
              number: labourNumber,
              wages: labourWages,
              UserEstimationLibrary: labourLibrary,
            } = labours[l];
            const userLabour = await UserLabours.findOne({
              where: { name, projectId },
            });
            if (!userLabour) {
              const newLabour = await UserLabours.create({
                name: labourName,
                unit: labourUnit,
                caveragePerUnit: labourCaverage,
                number: labourNumber,
                wages: labourWages,
                userId: managerId ? managerId : userId,
                projectId,
              });
              // create new UserEstimationLibary
              await UserEstimationLibrary.create({
                labourId: newLabour.id,
                labourFactorQuantity: labourLibrary.labourFactorQuantity,
                labourTotalAmount: labourLibrary.labourTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            } else {
              // CREATE UserEstimationLibary
              await UserEstimationLibrary.create({
                labourId: userLabour.id,
                labourFactorQuantity: labourLibrary.labourFactorQuantity,
                labourTotalAmount: labourLibrary.labourTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            }
          }

          for (let m = 0; m < subContractors.length; m++) {
            // subcontractor
            const {
              name: subContractorName,
              unit: subContractorUnit,
              quantity: subContractorQuantity,
              price: subContractorPrice,
              UserEstimationLibrary: sublibrary,
            } = subContractors[m];

            const userSubContractor = await UserSubContractors.findOne({
              where: { name, projectId },
            });

            if (!userSubContractor) {
              const newSubContractor = await UserSubContractors.create({
                name: subContractorName,
                unit: subContractorUnit,
                quantity: subContractorQuantity,
                price: subContractorPrice,
                userId: managerId ? managerId : userId,
                projectId,
              });
              // create new UserEstimationLibary
              await UserEstimationLibrary.create({
                subContractorId: newSubContractor.id,
                subContractorTotalAmount: sublibrary.subContractorTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            } else {
              // CREATE UserEstimationLibary
              await UserEstimationLibrary.create({
                subContractorId: userSubContractor.id,
                subContractorTotalAmount: sublibrary.subContractorTotalAmount,
                estimationId: newEstimation.id,
                userId: managerId ? managerId : userId,
                projectId,
              });
            }
          }
        }

        return onSuccess(res, 200, "Activity added successfully", category);
      }
      // create new userCategory with userId and projectId
      const category = await UserEstimationCategory.create({
        userId: managerId ? managerId : userId,
        projectId,
        name: defaultCategory.name,
      });

      const estimation = await UserEstimations.findAll({
        where: { userEstimationCategoryId: defaultCategory.id, userId: managerId ? managerId : userId },
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
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });

      for (let i = 0; i < estimation.length; i++) {
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
          subContractors,
        } = estimation[i];
        const newEstimation = await UserEstimations.create({
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
          userEstimationCategoryId: category.id,
          projectId,
          userId: managerId ? managerId : userId,
        });

        for (let j = 0; j < equipments.length; j++) {
          // Equipments
          const {
            name: equipmentName,
            unit: equipmentUnit,
            caveragePerUnit: equipmentCaveragePerUnit,
            hireRatePrice: equipmentHireRate,
            number: equipmentNumber,
            supplierId: equipmentSupplier,
            UserEstimationLibrary: equiplibrary,
          } = equipments[j];

          const userEquipment = await UserEquipments.findOne({
            where: { name, projectId },
          });
          if (!userEquipment) {
            const newEquipment = await UserEquipments.create({
              name: equipmentName,
              unit: equipmentUnit,
              caveragePerUnit: equipmentCaveragePerUnit,
              hireRatePrice: equipmentHireRate,
              number: equipmentNumber,
              supplierId: equipmentSupplier,
              userId: managerId ? managerId : userId,
              projectId,
            });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: newEquipment.id,
              equipmentPerformance: equiplibrary.equipmentPerformance,
              equipmentTotalAmount: equiplibrary.equipmentTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: userEquipment.id,
              equipmentPerformance: equiplibrary.equipmentPerformance,
              equipmentTotalAmount: equiplibrary.equipmentTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          }
        }

        for (let k = 0; k < materials.length; k++) {
          // materials
          const {
            name: materialName,
            quantity: materilQuantity,
            unit: materialUnit,
            caveragePerUnit: materialCavergae,
            price: materialPrice,
            supplierId: materialSupplier,
            UserEstimationLibrary: matlibrary,
          } = materials[k];

          const userMaterial = await UserMaterials.findOne({
            where: { name, projectId },
          });

          if (!userMaterial) {
            const newMaterial = await UserMaterials.create({
              name: materialName,
              quantity: materilQuantity,
              unit: materialUnit,
              caveragePerUnit: materialCavergae,
              price: materialPrice,
              supplierId: materialSupplier,
              userId: managerId ? managerId : userId,
              projectId,
            });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: newMaterial.id,
              materialFactorQuantity: matlibrary.materialFactorQuantity,
              materialTotalAmount: matlibrary.materialTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: userMaterial.id,
              materialFactorQuantity: matlibrary.materialFactorQuantity,
              materialTotalAmount: matlibrary.materialTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          }
        }

        for (let l = 0; l < labours.length; l++) {
          // labours
          const {
            name: labourName,
            unit: labourUnit,
            caveragePerUnit: labourCaverage,
            number: labourNumber,
            wages: labourWages,
            UserEstimationLibrary: labourLibrary,
          } = labours[l];
          const userLabour = await UserLabours.findOne({
            where: { name, projectId },
          });
          if (!userLabour) {
            const newLabour = await UserLabours.create({
              name: labourName,
              unit: labourUnit,
              caveragePerUnit: labourCaverage,
              number: labourNumber,
              wages: labourWages,
              userId: managerId ? managerId : userId,
              projectId,
            });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: newLabour.id,
              labourFactorQuantity: labourLibrary.labourFactorQuantity,
              labourTotalAmount: labourLibrary.labourTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: userLabour.id,
              labourFactorQuantity: labourLibrary.labourFactorQuantity,
              labourTotalAmount: labourLibrary.labourTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          }
        }

        for (let m = 0; m < subContractors.length; m++) {
          // subcontractor
          const {
            name: subContractorName,
            unit: subContractorUnit,
            quantity: subContractorQuantity,
            price: subContractorPrice,
            UserEstimationLibrary: sublibrary,
          } = subContractors[m];

          const userSubContractor = await UserSubContractors.findOne({
            where: { name, projectId },
          });

          if (!userSubContractor) {
            const newSubContractor = await UserSubContractors.create({
              name: subContractorName,
              unit: subContractorUnit,
              quantity: subContractorQuantity,
              price: subContractorPrice,
              userId: managerId ? managerId : userId,
              projectId,
            });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              subContractorId: newSubContractor.id,
              subContractorTotalAmount: sublibrary.subContractorTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              subContractorId: userSubContractor.id,
              subContractorTotalAmount: sublibrary.subContractorTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            });
          }
        }
      }

      return onSuccess(res, 200, "Activity added successfully");
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // remove activity from project
  static async removeActivityFromProject(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const { projectId } = req.params;
      const { activityName } = req.body;

      const project = await Projects.findOne({
        where: { id: projectId, userId: managerId ? managerId : userId },
      });

      if (!project) {
        return onError(res, 404, "Project not found");
      }

      const estimations = await UserEstimations.findAll({
        where: { userId: managerId ? managerId : userId, projectId },
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

      const projectData = { ...project.dataValues, activities: estimations };

      const { activities } = projectData;

      // loop through workSpecification and delete category, activities and UserEstimationCategory
      for (let j = 0; j < activities.length; j++) {
        const {
          category: { name },
          id: estimationId,
          userEstimationCategoryId,
        } = activities[j];
        // delete all
        if (name === activityName) {
          await UserEstimationLibrary.destroy({
            where: {
              estimationId,
            },
          });
          await UserEstimations.destroy({
            where: {
              id: estimationId,
            },
          });
          await UserEstimationCategory.destroy({
            where: {
              id: userEstimationCategoryId,
            },
          });
        }
      }

      return onSuccess(res, 200, "Activity removed successfully", projectData);
    } catch (error) {
      console.log("error", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  static async getProjectEstimationById(req, res) {
    try {
      const { id: userId, role, managerId } = req.user;
      if(role === 'manager' || role === 'admin'){
      const estimation = await UserEstimations.findOne({
        where: { userId: managerId ? managerId : userId, projectId: req.params.projectId, id: req.params.id },
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

      if(!estimation) return onError(res, 400, 'Estimation does not exist within this project')
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

  // add estimation to project from category
  static async addEstimationToProject(req, res) {
    const t = await sequelize.transaction();
    try {
      const { estimationName } = req.body;
      const { id: userId, managerId } = req.user;
      const { projectId } = req.params;

      // default estimation
      const project = await Projects.findOne({
        where: { id: projectId, userId: managerId ? managerId : userId },
      });

      if (!project) {
        return onError(res, 404, "Project not found");
      }

      const defaultEstimation = await Estimations.findOne({
        where: { name: estimationName, isApproved: true },
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

      const userEstimation = await UserEstimations.findOne({
        where: { name: estimationName, userId: managerId ? managerId : userId, projectId: null },
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
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });

      if (!defaultEstimation && !userEstimation) {
        return onError(res, 404, "Estimation not found");
      }

      const estimations = await UserEstimations.findAll({
        where: { userId: managerId ? managerId : userId, projectId },
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

      // estimation already exist with project estimation

      const estimationExists = estimations.find((estimation) => {
        return estimation.name === estimationName;
      });

      if (estimationExists) {
        return onError(
          res,
          409,
          "Estimation already exists, please add equipment, material, labour and subcontractor to it."
        );
      }

      if (userEstimation) {
        // create new estimation with project id
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
          subContractors,
        } = userEstimation;

        const newEstimation = await UserEstimations.create({
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
          projectId,
          userId: managerId ? managerId : userId,
        }, { transaction: t });

        // LOOP THROUGH Equipment
        for (let i = 0; i < equipments.length; i++) {
          const {
            name,
            unit,
            caveragePerUnit,
            hireRatePrice,
            number,
            supplierId,
            UserEstimationLibrary: library,
          } = equipments[i];
          const userEquipment = await UserEquipments.findOne({
            where: { name, projectId },
          });
          if (!userEquipment) {
            // create new equipment
            const newEquipment = await UserEquipments.create({
              name,
              unit,
              caveragePerUnit: caveragePerUnit ? caveragePerUnit : 0,
              hireRatePrice,
              number,
              supplierId,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: newEquipment.id,
              equipmentPerformance: library?.equipmentPerformance ? library?.equipmentPerformance : 0,
              equipmentTotalAmount: library?.equipmentTotalAmount ? library?.equipmentTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: userEquipment.id,
              equipmentPerformance: library?.equipmentPerformance ? library?.equipmentPerformance : 0,
              equipmentTotalAmount: library?.equipmentTotalAmount ? library?.equipmentTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
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

          const userMaterial = await UserMaterials.findOne({
            where: { name, projectId },
          });

          if (!userMaterial) {
            // create new material
            const newMaterial = await UserMaterials.create({
              name,
              quantity,
              unit,
              caveragePerUnit: caveragePerUnit ? caveragePerUnit : 0,
              price,
              supplierId,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: newMaterial.id,
              materialFactorQuantity: library?.materialFactorQuantity ? library?.materialFactorQuantity : 0,
              materialTotalAmount: library?.materialTotalAmount ? library?.materialTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: userMaterial.id,
              materialFactorQuantity: library?.materialFactorQuantity ? library?.materialFactorQuantity : 0,
              materialTotalAmount: library?.materialTotalAmount ? library?.materialTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
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

          const userLabour = await UserLabours.findOne({
            where: { name, projectId },
          });

          if (!userLabour) {
            const newLabour = await UserLabours.create({
              name,
              number,
              unit,
              wages,
              caveragePerUnit: caveragePerUnit ? caveragePerUnit : 0,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });

            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: newLabour.id,
              labourFactorQuantity: library?.labourFactorQuantity ? library?.labourFactorQuantity : 0,
              labourTotalAmount: library?.labourTotalAmount ? library?.labourTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: userLabour.id,
              labourFactorQuantity: library?.labourFactorQuantity ? library?.labourFactorQuantity : 0,
              labourTotalAmount: library?.labourTotalAmount ? library?.labourTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
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

          const userSubContractor = await UserSubContractors.findOne({
            where: { name, projectId },
          });

          if (!userSubContractor) {
            const newSubContractor = await UserSubContractors.create({
              name,
              unit,
              quantity,
              price,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });

            await await UserEstimationLibrary.create({
              subContractorId: newSubContractor.id,
              subContractorTotalAmount: library?.subContractorTotalAmount ? library?.subContractorTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              subContractorId: userSubContractor.id,
              subContractorTotalAmount: library?.subContractorTotalAmount ? library?.subContractorTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
        }
        await t.commit();

        return onSuccess(
          res,
          200,
          "Estimation Added Successfully",
          newEstimation
        );
      } else {
        // create new estimation with project id
        const {
          name: activityName,
          category: {name: categoryName},
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
          equipments,
          materials,
          labours,
          subContractors,
        } = defaultEstimation;

        // estimation category exist
        const estimationExistCategory = await UserEstimationCategory.findOne({
           where: {
              name: activityName,
              userId: managerId ? managerId : userId,
              projectId
           }
        })

        let categoryId;
        if(!estimationExistCategory) {
         const created = await UserEstimationCategory.create({
            name: categoryName,
            userId: managerId ? managerId : userId,
            projectId
          })
          categoryId = created.id
        }

        const newEstimation = await UserEstimations.create({
          name: activityName,
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
          userEstimationCategoryId: categoryId ? categoryId : estimationExistCategory.id,
          equipmentCostPerWorkItem,
          equipmentRatePerUnit,
          materialCostPerWorkItem,
          materialRatePerUnit,
          indirectCostPerWorkItem,
          indirectRatePerUnit,
          labourCostperWorkItem,
          labourRatePerUnit,
          subcontractorCostPerWorkItem,
          projectId,
          userId: managerId ? managerId : userId,
        }, { transaction: t });

        // LOOP THROUGH Equipment
        for (let i = 0; i < equipments.length; i++) {
          const {
            name,
            unit,
            caveragePerUnit,
            hireRatePrice,
            number,
            supplierId,
            UserEstimationLibrary: library,
          } = equipments[i];
          const userEquipment = await UserEquipments.findOne({
            where: { name, projectId },
          });
          if (!userEquipment) {
            // create new equipment
            const newEquipment = await UserEquipments.create({
              name,
              unit,
              caveragePerUnit: caveragePerUnit ? caveragePerUnit : 0,
              hireRatePrice,
              number,
              supplierId,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: newEquipment.id,
              equipmentPerformance: library?.equipmentPerformance ? library?.equipmentPerformance : 0,
              equipmentTotalAmount: library?.equipmentTotalAmount ? library?.equipmentTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: userEquipment.id,
              equipmentPerformance: library?.equipmentPerformance ? library?.equipmentPerformance : 0,
              equipmentTotalAmount: library?.equipmentTotalAmount ? library?.equipmentTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
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
            UserEstimationLibrary: library,
          } = materials[i];

          const userMaterial = await UserMaterials.findOne({
            where: { name, projectId },
          });

          if (!userMaterial) {
            // create new material
            const newMaterial = await UserMaterials.create({
              name,
              quantity,
              unit,
              caveragePerUnit: caveragePerUnit ? caveragePerUnit : 0,
              price,
              supplierId,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: newMaterial.id,
              materialFactorQuantity: library?.materialFactorQuantity ? library?.materialFactorQuantity : 0,
              materialTotalAmount: library?.materialTotalAmount ? library?.materialTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: userMaterial.id,
              materialFactorQuantity: library?.materialFactorQuantity ? library?.materialFactorQuantity : 0,
              materialTotalAmount: library?.materialTotalAmount ? library?.materialTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
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

          const userLabour = await UserLabours.findOne({
            where: { name, projectId },
          });

          if (!userLabour) {
            const newLabour = await UserLabours.create({
              name,
              number,
              unit,
              wages,
              caveragePerUnit: caveragePerUnit ? caveragePerUnit : 0,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });

            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: newLabour.id,
              labourFactorQuantity: library?.labourFactorQuantity ? library?.labourFactorQuantity : 0,
              labourTotalAmount: library?.labourTotalAmount ? library?.labourTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: userLabour.id,
              labourFactorQuantity: library?.labourFactorQuantity ? library?.labourFactorQuantity : 0,
              labourTotalAmount: library?.labourTotalAmount ? library?.labourTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
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

          const userSubContractor = await UserSubContractors.findOne({
            where: { name, projectId },
          });

          if (!userSubContractor) {
            const newSubContractor = await UserSubContractors.create({
              name,
              unit,
              quantity,
              price,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });

            await await UserEstimationLibrary.create({
              subContractorId: newSubContractor.id,
              subContractorTotalAmount: library?.subContractorTotalAmount ? library?.subContractorTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          } else {
            // CREATE UserEstimationLibary
            await UserEstimationLibrary.create({
              subContractorId: userSubContractor.id,
              subContractorTotalAmount: library?.subContractorTotalAmount ? library?.subContractorTotalAmount : 0,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId,
            }, { transaction: t });
          }
        }
        await t.commit();
        return onSuccess(
          res,
          200,
          "Estimation Added Successfully",
          newEstimation
        );
      }
    } catch (error) {
      console.log("error: ", error);
      await t.rollback();
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // remove estimation from project

  static async removeEstimationFromProject(req, res) {
    try {
      const { estimationName } = req.body;
      const { id: userId, managerId } = req.user;
      const { projectId } = req.params;

      // default estimation
      const project = await Projects.findOne({
        where: { id: projectId, userId: managerId ? managerId : userId },
      });

      if (!project) {
        return onError(res, 404, "Project not found");
      }

      const estimations = await UserEstimations.findAll({
        where: { userId: managerId ? managerId : userId, projectId },
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

      // estimation already exist with project estimation

      const estimationExists = estimations.find((estimation) => {
        return estimation.name === estimationName;
      });

      if (!estimationExists) {
        return onError(
          res,
          409,
          "Estimation Doesn't Exist within this project"
        );
      }

      // remove estimation from project

      await UserEstimations.destroy({
        where: { id: estimationExists.id },
      });

      // remove UserEstimationLibrary with estimationId
      await UserEstimationLibrary.destroy({
        where: {estimationId: estimationExists.id}
      })

      return onSuccess(res, 200, "Estimation Removed Successfully");
      

    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // copy the existing project and create new one

  static async copyProjectData(req, res){
    const t = await sequelize.transaction();
    try{
      const { id: userId, managerId } = req.user;
      const { id } = req.params;
      
      const project = await Projects.findOne({ where: { id, userId: managerId ? managerId : userId } });

      const estimations = await UserEstimations.findAll({
        where: { userId: managerId ? managerId : userId, projectId: req.params.id },
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
       
      let projectName = project.name;
      const projectExists = await Projects.findOne({
        where: { name: project.name },
      });

      if (projectExists) {
        projectName = `${project.name} copy`
      }

      const newProject = await Projects.create({
        name: projectName,
        description: project?.description,
        client: project?.client,
        contractor: project?.contractor,
        consultant: project?.consultant,
        startDate: project?.startDate,
        endData: project?.endDate,
        status: project?.status,
        outputAndPrice: project?.outputAndPrice,
        userId: project?.userId,
        adminId: project?.adminId
      }, { transaction: t })

      for (let estimation of estimations) {

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
          subContractors,
          category: {name: categoryName}
        } = estimation
        const created = await UserEstimationCategory.create({
            name: categoryName,
            userId: newProject.userId,
            projectId: newProject.id
          })
      const categoryId = created.id
        const newEstimation = await UserEstimations.create({
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
          userEstimationCategoryId: categoryId,
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
          projectId: newProject.id,
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
              UserEstimationLibrary: {
                equipmentPerformance,
                equipmentTotalAmount,
              },
            } = equipments[i];

           const newEquipment = await UserEquipments.create({
              name,
              unit,
              caveragePerUnit,
              hireRatePrice,
              number,
              supplierId,
              userId: managerId ? managerId : userId,
              projectId: newProject.id,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              equipmentId: newEquipment.id,
              equipmentPerformance,
              equipmentTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId: newProject.id,
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
            UserEstimationLibrary: {
              materialFactorQuantity,
              materialTotalAmount,
            },
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
              projectId: newProject.id,
            }, { transaction: t });
            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              materialId: newMaterial.id,
              materialFactorQuantity,
              materialTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId: newProject.id,
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
            UserEstimationLibrary: { labourFactorQuantity, labourTotalAmount },
          } = labours[i];

            const newLabour = await UserLabours.create({
              name,
              number,
              unit,
              wages,
              caveragePerUnit,
              userId: managerId ? managerId : userId,
              projectId: newProject.id,
            }, { transaction: t });

            // create new UserEstimationLibary
            await UserEstimationLibrary.create({
              labourId: newLabour.id,
              labourFactorQuantity,
              labourTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId: newProject.id,
            }, { transaction: t });
          
        }

        // LOOP THROUGH subContractors
        for (let i = 0; i < subContractors.length; i++) {
          const {
            name,
            unit,
            quantity,
            price,
            UserEstimationLibrary: { subContractorTotalAmount },
          } = subContractors[i];

            const newSubContractor = await UserSubContractors.create({
              name,
              unit,
              quantity,
              price,
              userId: managerId ? managerId : userId,
              projectId: newProject.id,
            }, { transaction: t });

            await await UserEstimationLibrary.create({
              subContractorId: newSubContractor.id,
              subContractorTotalAmount,
              estimationId: newEstimation.id,
              userId: managerId ? managerId : userId,
              projectId: newProject.id,
            }, { transaction: t }); 
       
      }
    }

    await t.commit();

    return onSuccess(res, 200, 'Project copied successfully', newProject)

    }catch(error){
      console.log('error: ', error)
      await t.rollback();
      return onError(res, 500, 'Internal Server Error', error.message)
    }
  }

  // copy estimation of the given project and paste it to another project

  static async copyProjectEstimation(req, res){}

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
      const { id: userId, managerId } = req.user;
      const { projectId, id } = req.params;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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

        const calculatedPrice = +equipment?.number * +equipment.hireRatePrice * equipmentPerformance;
        const equipmentTotalAmount = calculatedPrice;

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
          +material.caveragePerUnit * estimationQty;

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
        const labourFactorQuantity = +labor.caveragePerUnit * estimationQty;

        const calculatedWages = +labor.number * +labor.wages * labourFactorQuantity;
        const labourTotalAmount = calculatedWages;

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

      const updatedEst = await estimation.reload()

      return onSuccess(
        res,
        200,
        "Estimation updated successfully",
        updatedEst
      );
    } catch (error) {
      console.log("error", error);
      return onError(res, 500, "Internal Server Error");
    }
  }

  // delete project
  static async deleteProject(req, res) {
    try {
      const { id: userId, managerId } = req.user;
      const {id} = req.params
      const project = await Projects.findOne({
        where: { id, userId: managerId ? managerId : userId },
      });
      const estimations = await UserEstimations.findAll({
        where: { userId: managerId ? managerId : userId, projectId: req.params.id },
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

      const projectData = { ...project.dataValues, activities: estimations };
      const { activities } = projectData;

      // loop through workSpecification and delete UserEstimation, UserEstimationLibrary
      // loop through activities and delete UserEstimationCategory, UserEstimation, UserEstimationLibrary

      for (let j = 0; j < activities.length; j++) {
        const { id: activityId, userEstimationCategoryId } = activities[j];

        await UserEstimationLibrary.destroy({
          where: { estimationId: activityId },
        });
        await UserEstimations.destroy({
          where: { id: activityId },
        });
        await UserEstimationCategory.destroy({
          where: { id: userEstimationCategoryId },
        });
      }

      // delete all equipments, materials, labours and subcontractor that has project id

      await UserEquipments.destroy({
        where: {projectId: id}
      })
      await UserMaterials.destroy({
        where: {projectId: id}
      })
      await UserLabours.destroy({
        where: {projectId: id}
      })
      await UserSubContractors.destroy({
        where: {projectId: id}
      })

      await project.destroy();

      return onSuccess(res, 200, "Project Deleted Successfully", project);
    } catch (error) {
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // add equipment to estimation
  static async addEquipmentToProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
          const createdEquipment = await UserEquipments.create({
            name: defaultEquipment.name,
            unit: defaultEquipment.unit,
            caveragePerUnit: defaultEquipment.caveragePerUnit,
            hireRatePrice: defaultEquipment.hireRatePrice,
            number: defaultEquipment.number,
            supplierId: defaultEquipment?.supplierId,
            userId: managerId ? managerId : userId,
            projectId
          });

          // formaulas material and equipment

          const equipmentPerformance =
            +createdEquipment.caveragePerUnit * +estimation.estimationQuantity;

          const calculatedPrice = createdEquipment?.number * +createdEquipment.hireRatePrice * equipmentPerformance
          const equipmentTotalAmount = calculatedPrice;

          // add equipment and mataerial to estimationLibary
          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            equipmentId: createdEquipment.id,
            equipmentPerformance: equipmentPerformance.toFixed(2),
            equipmentTotalAmount: equipmentTotalAmount.toFixed(2),
            userId: managerId ? managerId : userId,
            projectId,
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
                  attributes: ["subContractorTotalAmount"],
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
            equipmentRatePerUnit + materialRatePerUnit + labourRatePerUnit + indirectRatePerUnit

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
            subcontractorCostPerWorkItem:
              +subcontractorCostPerWorkItem.toFixed(2),
          });

          return onSuccess(
            res,
            200,
            "Equipment added successfully",
            updateEstimation
          );
        
      } 
        // formaulas material and equipment

        const createdEquipment = await UserEquipments.create({
            name: equipment.name,
            unit: equipment.unit,
            caveragePerUnit: equipment.caveragePerUnit,
            hireRatePrice: equipment.hireRatePrice,
            number: equipment.number,
            supplierId: equipment?.supplierId,
            userId:  managerId ? managerId : userId,
            projectId
          });

        const equipmentPerformance =
          +createdEquipment.caveragePerUnit * +estimation.estimationQuantity;

        const calculatedPrice = +createdEquipment?.number * +createdEquipment.hireRatePrice * equipmentPerformance
        const equipmentTotalAmount = calculatedPrice;

        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          equipmentId: createdEquipment.id,
          equipmentPerformance: equipmentPerformance,
          equipmentTotalAmount: equipmentTotalAmount,
          userId: managerId ? managerId : userId,
          projectId,
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
                attributes: ["subContractorTotalAmount"],
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
          subcontractorCostPerWorkItem:
            +subcontractorCostPerWorkItem.toFixed(2),
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
  static async removeEquipmentFromProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
              attributes: ["subContractorTotalAmount"],
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
        "Equipment Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // edit estimation equipment
  static async editProjectEstimationEquipment(req, res) {
    try {
      const { caveragePerUnit, equipmentName, equipmentPrice, editName, editUnit, number } = req.body;
      const {id, projectId} = req.params
      // estimation
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
      const equipmentNumber = number ? number : +equipmentExist?.number

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
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

      let equipmentTotal = 0;

      // ============Loop for equipment calculation===============
      for (let i = 0; i < equipments.length; i++) {
        const equipment = equipments[i];
        // equipment Performance
        const equipmentPerformance = +equipment.caveragePerUnit * +updateEstimation.estimationQuantity;

        const calculatedPrice = +equipment?.number * +equipment.hireRatePrice * equipmentPerformance
        const equipmentTotalAmount = calculatedPrice;

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
    
      const updateed = await updateEstimation.reload();
      return onSuccess(
        res,
        200,
        "Equipment Updated successfully",
        updateed
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add material to estimation
  static async addMaterialToProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
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
              attributes: ["subContractorTotalAmount"],
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
          const createdMaterial = await UserMaterials.create({
            name: defaultmaterial.name,
            unit: defaultmaterial.unit,
            caveragePerUnit: defaultmaterial.caveragePerUnit,
            quantity: defaultmaterial.quantity,
            price: defaultmaterial.price,
            supplierId: defaultmaterial?.supplierId,
            userId: managerId ? managerId : userId,
            projectId
          });

          // formaulas material and equipment

          const materialFactorQuantity =
            +createdMaterial.caveragePerUnit * +estimation.estimationQuantity;

          const materialTotalAmount =
            materialFactorQuantity * +createdMaterial.price;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            materialId: createdMaterial.id,
            materialFactorQuantity: materialFactorQuantity,
            materialTotalAmount: materialTotalAmount,
            userId: managerId ? managerId : userId,
            projectId
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
                  attributes: ["subContractorTotalAmount"],
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
            subcontractorCostPerWorkItem:
              +subcontractorCostPerWorkItem.toFixed(2),
          });

          return onSuccess(
            res,
            200,
            "Material added successfully",
            updateEstimation
          );
        
      }
        // formaulas material
        const createdMaterial = await UserMaterials.create({
            name: defaultmaterial.name,
            unit: defaultmaterial.unit,
            caveragePerUnit: defaultmaterial.caveragePerUnit,
            quantity: defaultmaterial.quantity,
            price: defaultmaterial.price,
            supplierId: defaultmaterial?.supplierId,
            userId: managerId ? managerId : userId,
            projectId
          });

        const materialFactorQuantity =
          +createdMaterial.caveragePerUnit * +estimation.estimationQuantity;

        const materialTotalAmount = materialFactorQuantity * +createdMaterial.price;

        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          materialId: createdMaterial.id,
          materialFactorQuantity: materialFactorQuantity,
          materialTotalAmount: materialTotalAmount,
          userId: managerId ? managerId : userId,
          projectId
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
                attributes: ["subContractorTotalAmount"],
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
          subcontractorCostPerWorkItem:
            +subcontractorCostPerWorkItem.toFixed(2),
        });

        return onSuccess(
          res,
          200,
          "Material added successfully",
          updateEstimation
        );
      
    } catch (error) {
      console.log(error);
      return onError(res, 500, "Internal Server Error");
    }
  }

  // remove material from estimation
  static async removeMaterialFromProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
              attributes: ["subContractorTotalAmount"],
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
        "Material Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // edit estimation materials
  static async editProjectEstimationMaterials(req, res) {
    try {
      const { caveragePerUnit, materialName, materialPrice, editName, editUnit } =
        req.body;

      // estimation
      const {id, projectId} = req.params
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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

      const editMaterialName = editName ? editName : materialExist.name;
      const editMaterialUnit = editUnit ? editUnit : materialExist.unit;

      // find equipment
      const material = await UserMaterials.findOne({
        where: { name: materialName, id: materialId },
      });

      // update equipment
      await material.update({
        caveragePerUnit: caverage,
        price: matPrice,
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
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

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
      const updated = await updateEstimation.reload();

      return onSuccess(
        res,
        200,
        "Material Updated successfully",
        updated
      );
    } catch (error) {
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add labour to estimation
  static async addLabourToProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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

        
          const createdLabour = await UserLabours.create({
            name: defaultLabour.name,
            unit: defaultLabour.unit,
            caveragePerUnit: defaultLabour?.caveragePerUnit,
            number: defaultLabour?.number,
            wages: defaultLabour.wages,
            userId: managerId ? managerId : userId,
            projectId
          });

          // formaulas material and equipment

          const labourFactorQuantity =
            +createdLabour?.caveragePerUnit * +estimation.estimationQuantity;
          const calculatedWages = +createdLabour.number * +createdLabour.wages * labourFactorQuantity;
          const labourTotalAmount = calculatedWages;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            labourId: createdLabour.id,
            labourFactorQuantity,
            labourTotalAmount,
            userId: managerId ? managerId : userId,
            projectId
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
                  attributes: ["subContractorTotalAmount"],
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
            subcontractorCostPerWorkItem:
              +subcontractorCostPerWorkItem.toFixed(2),
          });

          return onSuccess(
            res,
            200,
            "Labour added successfully",
            updateEstimation
          );
        
      }
        // formaulas material and equipment
        const createdLabour = await UserLabours.create({
            name: labour.name,
            unit: labour.unit,
            caveragePerUnit: labour?.caveragePerUnit,
            number: labour?.number,
            wages: labour.wages,
            userId: managerId ? managerId : userId,
            projectId
          });

        const labourFactorQuantity =
          +createdLabour?.caveragePerUnit * +estimation.estimationQuantity;
        const calculatedWages = +createdLabour.number * +createdLabour.wages * labourFactorQuantity
        const labourTotalAmount = calculatedWages;

        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          labourId: labour.id,
          labourFactorQuantity,
          labourTotalAmount,
          userId: managerId ? managerId : userId,
          projectId
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
                attributes: ["subContractorTotalAmount"],
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
          subcontractorCostPerWorkItem:
            +subcontractorCostPerWorkItem.toFixed(2),
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
  static async removeLabourFromProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
              attributes: ["subContractorTotalAmount"],
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
        "Labour Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }

  // edit estimation labour
  static async editLabourProjectEstimation(req, res) {
    try {
      const { caveragePerUnit, labourName, wages, number, editName, editUnit } = req.body;

      // estimation
      const {id, projectId} = req.params
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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

      // labour price

      const labWages = wages ? wages : +labourExist.wages;
      // labour id
      const labourId = labourExist.id;
      const labourNumber = number ? number : +labourExist.number;

      const editLabourName = editName ? editName : labourExist.name;
      const editLabourUnit = editUnit ? editUnit : labourExist.unit;

      // find equipment
      const labour = await UserLabours.findOne({
        where: { name: labourName, id: labourId },
      });

      // update equipment
      await labour.update({
        caveragePerUnit: caverage,
        wages: labWages,
        number: labourNumber,
        name: editLabourName,
        unit: editLabourUnit,
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
              attributes: ["subContractorTotalAmount"],
            },
          },
        ],
      });
      const { equipments, materials, labours, subContractors } =
        updateEstimation;

      let labourTotal = 0;

      // ============Loop for equipment calculation===============
      for (let i = 0; i < labours.length; i++) {
        const labour = labours[i];
        // labour Performance
        const labourFactorQuantity = +labour.caveragePerUnit * estimationQty;

        const calculatedWages = labour?.number * +labour.wages * labourFactorQuantity;
        const labourTotalAmount = calculatedWages;

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

      const updated = await updateEstimation.reload();
      return onSuccess(
        res,
        200,
        "Labour Updated successfully",
        updated
      );
    } catch (error) {
      console.log(error)
      return onError(res, 500, "Internal Server Error");
    }
  }

  // add subcontractor to estimation
  static async addSubcontractorToProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
          const created_subcontractor = await UserSubContractors.create({
            name: default_subcontractor.name,
            unit: default_subcontractor.unit,
            quantity: +estimation.estimationQuantity,
            price: default_subcontractor.price,
            userId: managerId ? managerId : userId,
            projectId,
          });
          // formaulas subcontractor

          const subContractorTotalAmount =
            +created_subcontractor.quantity * +created_subcontractor.price;

          await UserEstimationLibrary.create({
            estimationId: estimation.id,
            subContractorId: created_subcontractor.id,
            subContractorTotalAmount: +subContractorTotalAmount.toFixed(2),
            userId: managerId ? managerId : userId,
            projectId,
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
                  attributes: ["subContractorTotalAmount"],
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
            subcontractorCostPerWorkItem:
              +subcontractorCostPerWorkItem.toFixed(2),
          });

          return onSuccess(
            res,
            200,
            "subcontractor added successfully",
            updateEstimation
          );
        
      } 
        // formaulas material and equipment

         const created_subcontractor = await UserSubContractors.create({
            name: subcontractor.name,
            unit: subcontractor.unit,
            quantity: +estimation.estimationQuantity,
            price: subcontractor.price,
            userId: managerId ? managerId : userId,
            projectId,
          });

        const subContractorTotalAmount =
          +created_subcontractor.quantity * +subcontractor.price;

        // add equipment and mataerial to estimationLibary
        await UserEstimationLibrary.create({
          estimationId: estimation.id,
          subContractorId: created_subcontractor.id,
          subContractorTotalAmount,
          userId: managerId ? managerId : userId,
          projectId,
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
                attributes: ["subContractorTotalAmount"],
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
          subcontractorCostPerWorkItem:
            +subcontractorCostPerWorkItem.toFixed(2),
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
  static async removeSubcontractorFromProjectEstimation(req, res) {
    try {
      const { id, projectId } = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
              attributes: ["subContractorTotalAmount"],
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
        "Subcontractor Removed successfully",
        updateEstimation
      );
    } catch (error) {
      console.log("error: ", error);
      return onError(res, 500, "Internal Server Error", error.message);
    }
  }
  // edit estimation subcontractor
  static async editSubcontractorProjectEstimation(req, res) {
    try {
      const { subcontractorName, price, editName, editUnit } = req.body;

      // estimation
      const {id, projectId} = req.params;
      const { id: userId, managerId } = req.user;
      const estimation = await UserEstimations.findOne({
        where: { id, userId: managerId ? managerId : userId, projectId },
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
              attributes: ["subContractorTotalAmount"],
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
              attributes: ["subContractorTotalAmount"],
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
          subcontractorCostPerWorkItem:
            +subcontractorCostPerWorkItem.toFixed(2),
        });

      const updated = await updateEstimation.reload()
      return onSuccess(
        res,
        200,
        "subcontractor Updated successfully",
        updated
      );
    } catch (error) {
      console.log(error)
      return onError(res, 500, "Internal Server Error");
    }
  }
}
export default UserProjectsController;

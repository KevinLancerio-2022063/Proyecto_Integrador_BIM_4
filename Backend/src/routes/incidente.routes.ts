import { Router } from "express";
import { IncidenteController } from "../controllers/incidente.controller";

const router = Router();

// Define la ruta GET para listar todos los incidentes
router.get("/", IncidenteController.listar);

// Define la ruta GET para buscar un incidente por ID
router.get("/:id", IncidenteController.buscarPorId);

// Define la ruta POST para crear un nuevo incidente
router.post("/", IncidenteController.crear);

// Define la ruta PUT para actualizar un incidente existente
router.put("/:id", IncidenteController.actualizar);

// Define la ruta DELETE para eliminar un incidente
router.delete("/:id", IncidenteController.eliminar);

export default router;
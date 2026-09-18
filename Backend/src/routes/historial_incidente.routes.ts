import { Router } from "express";
import { HistorialIncidenteController } from "../controllers/historial_incidente.controller";

const router = Router();

// Define la ruta GET para listar todos los incidentes
router.get("/", HistorialIncidenteController.listarHistorialIncidente);

// Define la ruta GET para buscar un incidente por ID
router.get("/:id", HistorialIncidenteController.buscarHistorialIncidentePorId);

// Define la ruta POST para crear un nuevo incidente
router.post("/", HistorialIncidenteController.crearHistorialIncidente);

// Define la ruta PUT para actualizar un incidente existente
router.put("/:id", HistorialIncidenteController.actualizarHistorialIncidente);

// Define la ruta DELETE para eliminar un incidente
router.delete("/:id", HistorialIncidenteController.eliminarHistorialIncidente);

export default router;
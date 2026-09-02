import { Router } from "express";
import { HistorialIncidenteController } from "../controllers/historial_incidente.controller";
import { IncidenteController } from "../controllers/incidente.controller";

const router = Router();

// Define la ruta GET para listar todos los incidentes
router.get("/", HistorialIncidenteController.listarHistorial);

// Define la ruta GET para buscar un incidente por ID
router.get("/:id", HistorialIncidenteController.buscarHistorialPorId);

// Define la ruta POST para crear un nuevo incidente
router.post("/", HistorialIncidenteController.crearHistorial);

// Define la ruta PUT para actualizar un incidente existente
router.put("/:id", HistorialIncidenteController.actualizarHistorial);

// Define la ruta DELETE para eliminar un incidente
router.delete("/:id", HistorialIncidenteController.eliminarHistorial);

export default router;
import { Router } from "express";
import { AsignacionRecursoController } from "../controllers/asignacion_recurso.controller";

const router = Router();

// Define la ruta GET para listar todas las asignaciones de recursos
router.get("/", AsignacionRecursoController.listar);

// Define la ruta GET para buscar una asignacion de recurso por ID
router.get("/:id", AsignacionRecursoController.buscarPorId);

// Define la ruta POST para crear una nueva asignacion de recurso
router.post("/", AsignacionRecursoController.crear);

// Define la ruta PUT para actualizar una asignacion de recurso existente
router.put("/:id", AsignacionRecursoController.actualizar);

// Define la ruta DELETE para eliminar una asignacion de recurso
router.delete("/:id", AsignacionRecursoController.eliminar);

export default router;
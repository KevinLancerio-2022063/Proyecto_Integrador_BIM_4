import { Router } from "express";
import { RecursoController } from "../controllers/recurso.controller";

const router = Router();

// Define la ruta GET para listar todos los recursos
router.get("/", RecursoController.listar);

// Define la ruta GET para buscar un recurso por ID
router.get("/:id", RecursoController.buscarPorId);

// Define la ruta POST para crear un nuevo recurso
router.post("/", RecursoController.crear);

// Define la ruta PUT para actualizar un recurso existente
router.put("/:id", RecursoController.actualizar);

// Define la ruta DELETE para eliminar un recurso
router.delete("/:id", RecursoController.eliminar);

export default router;
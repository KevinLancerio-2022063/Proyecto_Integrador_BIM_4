import { Router } from "express";
import { RefugioController } from "../controllers/refugio.controller";

const router = Router();

// Define la ruta GET para listar todos los refugios
router.get("/", RefugioController.listar);

// Define la ruta GET para buscar un refugio por ID
router.get("/:id", RefugioController.buscarPorId);

// Define la ruta POST para crear un nuevo refugio
router.post("/", RefugioController.crear);

// Define la ruta PUT para actualizar un refugio existente
router.put("/:id", RefugioController.actualizar);

// Define la ruta DELETE para eliminar un refugio
router.delete("/:id", RefugioController.eliminar);

export default router;
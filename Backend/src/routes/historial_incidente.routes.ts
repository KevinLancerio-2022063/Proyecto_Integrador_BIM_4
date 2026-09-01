import { Router } from "express";
import { HistorialIncidenteController } from "../controllers/historial_incidente.controller";

const router = Router();

router.get("/incidente/:incidenteId", HistorialIncidenteController.obtenerPorIncidente);

router.post("/", HistorialIncidenteController.crear);

export default router;
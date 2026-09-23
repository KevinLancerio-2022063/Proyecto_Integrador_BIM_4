// src/app/features/incidentes/components/incidentes/incidente-form/incidente-form.component.ts

import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { IncidenteService } from "../../../services/incidente.service";
import { Incidente, CrearIncidenteDTO, ActualizarIncidenteDTO } from "../../../models/incidente.model";

@Component({
  selector: "app-incidente-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./incidente-form.component.html",
  styleUrls: ["./incidente-form.component.css"]
})
export class IncidenteFormComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  isEdit: boolean = false;
  mensajeErrorInline: string = "";
  
  tiposIncidente = [
    { valor: "INUNDACION", texto: "Inundación", icono: "flood", color: "#0ea5e9" },
    { valor: "TERREMOTO", texto: "Terremoto", icono: "landslide", color: "#8338ec" },
    { valor: "INCENDIO", texto: "Incendio", icono: "local_fire_department", color: "#ef4444" },
    { valor: "DESLIZAMIENTO", texto: "Deslizamiento", icono: "landscape", color: "#10b981" },
    { valor: "ACTIVIDAD_VOLCANICA", texto: "Actividad Volcánica", icono: "volcano", color: "#f59e0b" },
    { valor: "OTRO", texto: "Otro", icono: "warning", color: "#6b7280" }
  ];

  nivelesEmergencia = [
    { valor: "BAJA", texto: "Baja", icono: "check_circle", color: "#10b981" },
    { valor: "MEDIA", texto: "Media", icono: "info", color: "#f59e0b" },
    { valor: "ALTA", texto: "Alta", icono: "warning", color: "#ef4444" },
    { valor: "CRITICA", texto: "Crítica", icono: "dangerous", color: "#dc2626" }
  ];

  estadosIncidente = [
    { valor: "REPORTADO", texto: "Reportado", icono: "report_problem", color: "#ef4444" },
    { valor: "EN_ATENCION", texto: "En Atención", icono: "engineering", color: "#f59e0b" },
    { valor: "MITIGADO", texto: "Mitigado", icono: "healing", color: "#10b981" },
    { valor: "CERRADO", texto: "Cerrado", icono: "check_circle", color: "#6b7280" }
  ];

  constructor(
    private fb: FormBuilder,
    private incidenteService: IncidenteService,
    public dialogRef: MatDialogRef<IncidenteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modo: string; incidente?: Incidente }
  ) {
    this.form = this.fb.group({
      titulo: ["", [Validators.required, Validators.maxLength(200)]],
      descripcion: ["", Validators.required],
      tipo: ["INUNDACION", Validators.required],
      nivel_emergencia: ["MEDIA", Validators.required],
      estado: ["REPORTADO", Validators.required],
      cantidad_personas_afectadas: [0, [Validators.required, Validators.min(0)]],
      observaciones: [""],
      zona_id: [null, [Validators.required, Validators.min(1)]],
      reportado_por: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.isEdit = this.data.modo === "editar";
    if (this.isEdit && this.data.incidente) {
      this.form.patchValue(this.data.incidente);
    }
  }

  onSubmit(): void {
    this.mensajeErrorInline = "";

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeErrorInline = "Por favor completa todos los campos obligatorios correctamente";
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    // CORRECCIÓN: Se eliminó fecha_reporte porque no existe en CrearIncidenteDTO
    const payloadBase: CrearIncidenteDTO = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      tipo: formData.tipo,
      nivel_emergencia: formData.nivel_emergencia,
      cantidad_personas_afectadas: Number(formData.cantidad_personas_afectadas),
      observaciones: formData.observaciones || null,
      zona_id: Number(formData.zona_id),
      reportado_por: Number(formData.reportado_por)
    };

    if (this.isEdit && this.data.incidente) {
      const incidenteId = Number(this.data.incidente.id);
      
      const payloadActualizacion: ActualizarIncidenteDTO = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        nivel_emergencia: formData.nivel_emergencia,
        estado: formData.estado,
        cantidad_personas_afectadas: Number(formData.cantidad_personas_afectadas),
        observaciones: formData.observaciones || null
      };
      
      this.incidenteService.update(incidenteId, payloadActualizacion).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error al actualizar:", error);
          this.loading = false;
          this.mensajeErrorInline = error.error?.message || "Error al actualizar el incidente";
        }
      });
    } else {
      this.incidenteService.create(payloadBase).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error al crear:", error);
          this.loading = false;
          this.mensajeErrorInline = error.error?.message || "Error al crear el incidente";
        }
      });
    }
  }

  getTipoIcono(valor: string): string {
    return this.tiposIncidente.find(t => t.valor === valor)?.icono || "warning";
  }

  getTipoColor(valor: string): string {
    return this.tiposIncidente.find(t => t.valor === valor)?.color || "#6b7280";
  }

  getNivelIcono(valor: string): string {
    return this.nivelesEmergencia.find(n => n.valor === valor)?.icono || "help";
  }

  getNivelColor(valor: string): string {
    return this.nivelesEmergencia.find(n => n.valor === valor)?.color || "#6b7280";
  }

  getEstadoIcono(valor: string): string {
    return this.estadosIncidente.find(e => e.valor === valor)?.icono || "help";
  }

  getEstadoColor(valor: string): string {
    return this.estadosIncidente.find(e => e.valor === valor)?.color || "#6b7280";
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
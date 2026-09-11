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
import { AsignacionRecursoService } from "../../../services/asignacion-recurso.service";
import { AsignacionRecurso } from "../../../models/asignacion-recurso.model";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-asignacion-recurso-form",
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
  templateUrl: "./asignacion-recurso-form.component.html",
  styleUrls: ["./asignacion-recurso-form.component.css"]
})
export class AsignacionRecursoFormComponent implements OnInit {
  // Define el grupo de formularios reactivo
  form: FormGroup;
  
  // Indica si el formulario está cargando
  loading: boolean = false;
  
  // Indica si el formulario está en modo edición
  isEdit: boolean = false;
  
  // Lista de estados válidos para el select
  estadosAsignacion: string[] = ["SOLICITADO", "ASIGNADO", "ENVIADO", "ENTREGADO", "CANCELADO"];
  
  // Tipo de destino seleccionado
  tipoDestino: "incidente" | "refugio" = "incidente";

  // Inyecta los servicios necesarios
  constructor(
    private fb: FormBuilder,
    private asignacionService: AsignacionRecursoService,
    public dialogRef: MatDialogRef<AsignacionRecursoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modo: string; asignacion?: AsignacionRecurso }
  ) {
    // Crea la estructura del formulario con sus validaciones
    this.form = this.fb.group({
      recurso_id: [null, Validators.required],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      estado: ["SOLICITADO", Validators.required],
      incidente_id: [null],
      refugio_id: [null],
      usuario_asigna_id: [null],
      observaciones: [""]
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.isEdit = this.data.modo === "editar";
    if (this.isEdit && this.data.asignacion) {
      this.form.patchValue(this.data.asignacion);
      if (this.data.asignacion.refugio_id) {
        this.tipoDestino = "refugio";
      }
    }
  }

  // Cambia el tipo de destino y limpia los campos
  onTipoDestinoChange(tipo: "incidente" | "refugio"): void {
    this.tipoDestino = tipo;
    this.form.patchValue({
      incidente_id: tipo === "incidente" ? null : this.form.value.incidente_id,
      refugio_id: tipo === "refugio" ? null : this.form.value.refugio_id
    });
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Valida que tenga al menos un destino
    if (!this.form.value.incidente_id && !this.form.value.refugio_id) {
      alert("Debes especificar un destino: incidente o refugio");
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    // Limpia el destino no seleccionado
    if (this.tipoDestino === "incidente") {
      formData.refugio_id = null;
    } else {
      formData.incidente_id = null;
    }

    if (this.isEdit && this.data.asignacion) {
      this.asignacionService.update(this.data.asignacion.id, formData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error al actualizar:", error);
          this.loading = false;
        }
      });
    } else {
      this.asignacionService.create(formData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error al crear:", error);
          this.loading = false;
        }
      });
    }
  }

  // Cierra el modal sin guardar
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
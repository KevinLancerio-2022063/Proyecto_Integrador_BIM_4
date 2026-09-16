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
import { AlertaService } from "../../../services/alerta.service";
import { Alerta } from "../../../models/alerta.model";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-alerta-form",
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
  templateUrl: "./alerta-form.component.html",
  styleUrls: ["./alerta-form.component.css"]
})
export class AlertaFormComponent implements OnInit {
  // Define el grupo de formularios reactivo
  form: FormGroup;

  // Indica si el formulario está cargando
  loading: boolean = false;

  // Indica si el formulario está en modo edición
  isEdit: boolean = false;

  // Lista de tipos válidos para el select
  tiposAlerta: string[] = [
    "Emergencia",
    "Recurso",
    "Refugio",
    "Seguimiento",
    "Otro"
  ];

  // Lista de niveles válidos para el select
  nivelesAlerta: string[] = [
    "Informacion",
    "Advertencia",
    "Critico"
  ];

  // Inyecta los servicios necesarios
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<AlertaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modo: string; alerta?: Alerta }
  ) {
    // Crea la estructura del formulario con sus validaciones
    this.form = this.fb.group({
      incidente_id: [null],
      zona_id: [null],
      refugio_id: [null],
      tipo: ["", Validators.required],
      nivel: ["", Validators.required],
      mensaje: ["", [Validators.required, Validators.maxLength(500)]]
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.isEdit = this.data.modo === "editar";

    if (this.isEdit && this.data.alerta) {
      this.form.patchValue(this.data.alerta);
    }
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    if (this.isEdit && this.data.alerta) {
      this.alertaService.update(this.data.alerta.id, formData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error al actualizar la alerta:", error);
          this.loading = false;
        }
      });
    } else {
      this.alertaService.create(formData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error al crear la alerta:", error);
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
import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AsignacionPersonalService } from "../../../services/asignacion-personal.service";
import { AsignacionPersonal } from "../../../models/asignacion-personal.model";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-asignacion-personal-form",
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
  templateUrl: "./asignacion-personal-form.component.html",
  styleUrls: ["./asignacion-personal-form.component.css"]
})
export class AsignacionPersonalFormComponent implements OnInit {
  // Define el grupo de formularios reactivo
  form: FormGroup;

  // Indica si el formulario está cargando
  loading: boolean = false;

  // Indica si el formulario está en modo edición
  isEdit: boolean = false;

  // Lista de estados válidos para la asignación
  estadosAsignacion: string[] = [
    "Asignada",
    "En curso",
    "Completada",
    "Cancelada"
  ];

  // Inyecta los servicios necesarios
  constructor(
    private fb: FormBuilder,
    private asignacionPersonalService: AsignacionPersonalService,
    public dialogRef: MatDialogRef<AsignacionPersonalFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      modo: string;
      asignacionPersonal?: AsignacionPersonal;
    }
  ) {
    // Crea la estructura del formulario con sus validaciones
    this.form = this.fb.group({
      personal_id: [null, Validators.required],
      incidente_id: [null],
      zona_id: [null],
      estado: ["", Validators.required],
      fecha_asignacion: [null, Validators.required],
      observaciones: ["", Validators.maxLength(500)]
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.isEdit = this.data.modo === "editar";

    if (this.isEdit && this.data.asignacionPersonal) {
      this.form.patchValue(this.data.asignacionPersonal);
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

    if (this.isEdit && this.data.asignacionPersonal) {
      this.asignacionPersonalService
        .update(this.data.asignacionPersonal.id, formData)
        .subscribe({
          next: () => {
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error(
              "Error al actualizar la asignación de personal:",
              error
            );
            this.loading = false;
          }
        });
    } else {
      this.asignacionPersonalService.create(formData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error(
            "Error al crear la asignación de personal:",
            error
          );
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
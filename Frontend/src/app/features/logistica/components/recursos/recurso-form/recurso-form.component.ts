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
import { RecursoService } from "../../../services/recurso.service";
import { Recurso } from "../../../models/recurso.model";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-recurso-form",
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
  templateUrl: "./recurso-form.component.html",
  styleUrls: ["./recurso-form.component.css"]
})
export class RecursoFormComponent implements OnInit {
  // Define el grupo de formularios reactivo
  form: FormGroup;
  
  // Indica si el formulario está cargando
  loading: boolean = false;
  
  // Indica si el formulario está en modo edición
  isEdit: boolean = false;
  
  // Lista de tipos válidos para el select
  tiposRecurso: string[] = ["AGUA", "ALIMENTO", "MEDICAMENTO", "EQUIPO", "VEHICULO", "OTRO"];
  
  // Lista de unidades de medida válidas
  unidadesMedida: string[] = ["UNIDAD", "CAJA", "KILOGRAMO", "LITRO", "PERSONA", "OTRO"];

  // Inyecta los servicios necesarios
  constructor(
    private fb: FormBuilder,
    private recursoService: RecursoService,
    public dialogRef: MatDialogRef<RecursoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modo: string; recurso?: Recurso }
  ) {
    // Crea la estructura del formulario con sus validaciones
    this.form = this.fb.group({
      nombre: ["", [Validators.required, Validators.maxLength(120)]],
      tipo: ["", Validators.required],
      unidad_medida: ["UNIDAD", Validators.required],
      cantidad_total: [0, [Validators.required, Validators.min(0)]],
      descripcion: [""]
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.isEdit = this.data.modo === "editar";
    if (this.isEdit && this.data.recurso) {
      this.form.patchValue(this.data.recurso);
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

    if (this.isEdit && this.data.recurso) {
      this.recursoService.update(this.data.recurso.id, formData).subscribe({
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
      this.recursoService.create(formData).subscribe({
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
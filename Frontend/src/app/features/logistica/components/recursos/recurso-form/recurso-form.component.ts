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
  
  // Lista de tipos de recurso con iconos y colores
  tiposRecurso = [
    { valor: "AGUA", texto: "Agua", icono: "water_drop", color: "#1fa882" },
    { valor: "ALIMENTO", texto: "Alimento", icono: "restaurant", color: "#e68529" },
    { valor: "MEDICAMENTO", texto: "Medicamento", icono: "medical_services", color: "#d94141" },
    { valor: "EQUIPO", texto: "Equipo", icono: "build", color: "#2da160" },
    { valor: "VEHICULO", texto: "Vehículo", icono: "local_shipping", color: "#e69a2e" },
    { valor: "OTRO", texto: "Otro", icono: "category", color: "#6b7280" }
  ];
  
  // Lista de unidades de medida con iconos y colores
  unidadesMedida = [
    { valor: "UNIDAD", texto: "Unidad", icono: "inventory_2", color: "#00f0ff" },
    { valor: "CAJA", texto: "Caja", icono: "inventory", color: "#a0522d" },
    { valor: "KILOGRAMO", texto: "Kilogramo", icono: "scale", color: "#10b981" },
    { valor: "LITRO", texto: "Litro", icono: "water_drop", color: "#0ea5e9" },
    { valor: "PERSONA", texto: "Persona", icono: "person", color: "#8338ec" },
    { valor: "OTRO", texto: "Otro", icono: "category", color: "#6b7280" }
  ];
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
      unidad_medida: ["", Validators.required], // ← Cambiado de "UNIDAD" a ""
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

// Obtiene el icono correspondiente al tipo seleccionado
getTipoIcono(valor: string): string {
  const tipo = this.tiposRecurso.find(t => t.valor === valor);
  return tipo ? tipo.icono : "category";
}

// Obtiene el color correspondiente al tipo seleccionado
getTipoColor(valor: string): string {
  const tipo = this.tiposRecurso.find(t => t.valor === valor);
  return tipo ? tipo.color : "#00f0ff";
}

// Obtiene el icono correspondiente a la unidad seleccionada
getUnidadIcono(valor: string): string {
  const unidad = this.unidadesMedida.find(u => u.valor === valor);
  return unidad ? unidad.icono : "straighten";
}

// Obtiene el color correspondiente a la unidad seleccionada
getUnidadColor(valor: string): string {
  const unidad = this.unidadesMedida.find(u => u.valor === valor);
  return unidad ? unidad.color : "#00f0ff";
}

  // Cierra el modal sin guardar
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
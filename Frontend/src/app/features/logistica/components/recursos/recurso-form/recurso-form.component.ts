import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { RecursoService } from "../../../services/recurso.service";

@Component({
  selector: "app-recurso-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: "./recurso-form.component.html",
  styleUrls: ["./recurso-form.component.css"]
})
export class RecursoFormComponent implements OnInit {
  // Define el grupo de formularios reactivo
  recursoForm!: FormGroup;
  
  // Indica si el formulario está en modo edición
  isEditMode: boolean = false;
  
  // Almacena el ID del recurso si está en modo edición
  recursoId?: number;

  // Lista de tipos válidos para el select
  tiposRecurso: string[] = ["AGUA", "ALIMENTO", "MEDICAMENTO", "EQUIPO", "VEHICULO", "OTRO"];
  
  // Lista de unidades de medida válidas
  unidadesMedida: string[] = ["UNIDAD", "CAJA", "KILOGRAMO", "LITRO", "PERSONA", "OTRO"];

  constructor(
    private fb: FormBuilder,
    private recursoService: RecursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Inicializa el formulario y verifica el modo de operación
  ngOnInit(): void {
    this.initForm();
    this.recursoId = Number(this.route.snapshot.paramMap.get("id"));
    
    if (this.recursoId) {
      this.isEditMode = true;
      this.loadRecursoData();
    }
  }

  // Crea la estructura del formulario con sus validaciones
  initForm(): void {
    this.recursoForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.maxLength(120)]],
      tipo: ["", Validators.required],
      unidad_medida: ["UNIDAD", Validators.required],
      cantidad_total: [0, [Validators.required, Validators.min(0)]],
      descripcion: [""]
    });
  }

  // Carga los datos del recurso si estamos editando
  loadRecursoData(): void {
    if (this.recursoId) {
      this.recursoService.getById(this.recursoId).subscribe({
        next: (data) => this.recursoForm.patchValue(data),
        error: (error) => console.error("Error al cargar el recurso:", error)
      });
    }
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    if (this.recursoForm.valid) {
      const formData = this.recursoForm.value;
      
      if (this.isEditMode && this.recursoId) {
        this.recursoService.update(this.recursoId, formData).subscribe({
          next: () => this.router.navigate(["/logistica/recursos"]),
          error: (error) => console.error("Error al actualizar:", error)
        });
      } else {
        this.recursoService.create(formData).subscribe({
          next: () => this.router.navigate(["/logistica/recursos"]),
          error: (error) => console.error("Error al crear:", error)
        });
      }
    } else {
      this.recursoForm.markAllAsTouched();
    }
  }
}
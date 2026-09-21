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

import { RefugioService } from "../../../services/refugio.service";
import { Refugio, CrearRefugioDTO, ActualizarRefugioDTO } from "../../../models/refugio.model";

@Component({
  selector: "app-refugio-form",
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
  templateUrl: "./refugio-form.component.html",
  styleUrls: ["./refugio-form.component.css"]
})
export class RefugioFormComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  isEdit: boolean = false;
  mensajeErrorInline: string = "";
  
  estadosRefugio = [
    { valor: "DISPONIBLE", texto: "Disponible", icono: "check_circle", color: "#10b981" },
    { valor: "PARCIAL", texto: "Parcial", icono: "remove_circle", color: "#f59e0b" },
    { valor: "LLENO", texto: "Lleno", icono: "cancel", color: "#ef4444" },
    { valor: "INACTIVO", texto: "Inactivo", icono: "block", color: "#6b7280" }
  ];

  constructor(
    private fb: FormBuilder,
    private refugioService: RefugioService,
    public dialogRef: MatDialogRef<RefugioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modo: string; refugio?: Refugio }
  ) {
    this.form = this.fb.group({
      nombre: ["", [Validators.required, Validators.maxLength(160)]],
      capacidad_total: [0, [Validators.required, Validators.min(1)]],
      ocupacion_actual: [0, [Validators.required, Validators.min(0)]],
      estado: ["DISPONIBLE", Validators.required],
      direccion: ["", Validators.required],
      zona_id: [null, [Validators.required, Validators.min(1)]],
      latitud: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitud: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      responsable_id: [null, [Validators.required, Validators.min(1)]],
      telefono_contacto: ["", [Validators.required, Validators.maxLength(30), Validators.pattern("^[0-9+\\-]+$")]],
      observaciones: [null]
    });
  }

  ngOnInit(): void {
    this.isEdit = this.data.modo === "editar";
    if (this.isEdit && this.data.refugio) {
      this.form.patchValue(this.data.refugio);
    }
  }

  onSubmit(): void {
    this.mensajeErrorInline = "";

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeErrorInline = "Por favor completa todos los campos obligatorios correctamente";
      return;
    }

    const formData = this.form.value;

    if (formData.ocupacion_actual > formData.capacidad_total) {
      this.mensajeErrorInline = "La ocupación actual no puede exceder la capacidad total";
      return;
    }

    this.loading = true;
    
    const payloadBase: CrearRefugioDTO = {
      nombre: formData.nombre,
      capacidad_total: Number(formData.capacidad_total),
      ocupacion_actual: Number(formData.ocupacion_actual),
      estado: formData.estado,
      direccion: formData.direccion,
      zona_id: Number(formData.zona_id),
      latitud: Number(formData.latitud),
      longitud: Number(formData.longitud),
      responsable_id: Number(formData.responsable_id),
      telefono_contacto: formData.telefono_contacto,
      observaciones: formData.observaciones || null
    };

    if (this.isEdit && this.data.refugio) {
      const refugioId = Number(this.data.refugio.id);
      
      const payloadActualizacion: ActualizarRefugioDTO = {
        id: refugioId,
        ...payloadBase
      };
      
      console.log("Enviando actualizacion para el ID:", refugioId);
      console.log("Datos a enviar:", payloadActualizacion);

      this.refugioService.update(refugioId, payloadActualizacion).subscribe({
        next: (response) => {
          console.log("Refugio actualizado correctamente:", response);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error completo del backend:", error);
          this.loading = false;
          
          // Manejo específico para diferentes tipos de errores
          if (error.status === 404) {
            this.mensajeErrorInline = "El zona id o responsable id ingresado no existe o fue eliminado";
          } else if (error.status === 400 && error.error) {
            // Extraer el mensaje de error del backend
            const backendError = error.error;
            
            // Si el backend devuelve un array de errores
            if (backendError.errores && Array.isArray(backendError.errores)) {
              const errores = backendError.errores;
              
              // Buscar errores específicos de zona_id o responsable_id
              const errorZona = errores.find((e: string) => 
                e.toLowerCase().includes("zona") || e.toLowerCase().includes("zona_id")
              );
              const errorResponsable = errores.find((e: string) => 
                e.toLowerCase().includes("responsable") || e.toLowerCase().includes("responsable_id")
              );
              
              if (errorZona) {
                this.mensajeErrorInline = "El Zona ID ingresado no existe en el sistema";
              } else if (errorResponsable) {
                this.mensajeErrorInline = "El Responsable ID ingresado no existe en el sistema";
              } else {
                // Mostrar el primer error o unirlos todos
                this.mensajeErrorInline = errores[0] || "Datos inválidos";
              }
            } else if (backendError.message) {
              // Si el backend devuelve un mensaje directo
              this.mensajeErrorInline = backendError.message;
            } else {
              this.mensajeErrorInline = "Error al actualizar: Verifica los datos ingresados";
            }
          } else {
            this.mensajeErrorInline = "Error al actualizar: No se pudo conectar con el servidor";
          }
        }
      });
    } else {
      console.log("Creando nuevo refugio con datos:", payloadBase);
      
      this.refugioService.create(payloadBase).subscribe({
        next: (response) => {
          console.log("Refugio creado correctamente:", response);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error completo del backend:", error);
          this.loading = false;
          
          // Manejo específico para diferentes tipos de errores
          if (error.status === 400 && error.error) {
            const backendError = error.error;
            
            // Si el backend devuelve un array de errores
            if (backendError.errores && Array.isArray(backendError.errores)) {
              const errores = backendError.errores;
              console.log("Errores del backend:", errores);
              
              // Buscar errores específicos
              const errorZona = errores.find((e: string) => 
                e.toLowerCase().includes("zona") || e.toLowerCase().includes("zona_id")
              );
              const errorResponsable = errores.find((e: string) => 
                e.toLowerCase().includes("responsable") || e.toLowerCase().includes("responsable_id")
              );
              
              if (errorZona) {
                this.mensajeErrorInline = "El Zona ID ingresado no existe en el sistema";
              } else if (errorResponsable) {
                this.mensajeErrorInline = "El Responsable ID ingresado no existe en el sistema";
              } else {
                // Mostrar el primer error relevante
                this.mensajeErrorInline = errores[0] || "Datos inválidos";
              }
            } else if (backendError.message) {
              this.mensajeErrorInline = backendError.message;
            } else {
              this.mensajeErrorInline = "Error al crear: Verifica los datos ingresados";
            }
          } else if (error.status === 404) {
            this.mensajeErrorInline = "Error: Recurso no encontrado en el servidor";
          } else {
            this.mensajeErrorInline = "Error al crear: No se pudo conectar con el servidor";
          }
        }
      });
    }
  }

  getEstadoIcono(valor: string): string {
    const estado = this.estadosRefugio.find(e => e.valor === valor);
    return estado ? estado.icono : "help";
  }

  getEstadoColor(valor: string): string {
    const estado = this.estadosRefugio.find(e => e.valor === valor);
    return estado ? estado.color : "#6b7280";
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
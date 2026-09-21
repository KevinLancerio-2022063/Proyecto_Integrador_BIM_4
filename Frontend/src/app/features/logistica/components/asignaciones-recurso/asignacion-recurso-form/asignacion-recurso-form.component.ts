import { Component, Inject, OnInit, ChangeDetectorRef } from "@angular/core";
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
import { RecursoService } from "../../../services/recurso.service";
import { IncidenteService } from "../../../../incidentes/services/incidente.service";
import { RefugioService } from "../../../services/refugio.service";

import { AsignacionRecurso, CrearAsignacionDTO } from "../../../models/asignacion-recurso.model";
import { Recurso } from "../../../models/recurso.model";
import { Incidente } from "../../../../incidentes/models/incidente.model";
import { Refugio } from "../../../models/refugio.model";

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
  
  // Mensaje de error inline para mostrar dentro del formulario
  mensajeErrorInline: string = "";
  
  // Lista de estados válidos para el select con iconos y colores
  estadosAsignacion = [
    { valor: "SOLICITADO", texto: "Solicitado", icono: "pending", color: "#3b82f6" },
    { valor: "ASIGNADO", texto: "Asignado", icono: "check_circle", color: "#8b5cf6" },
    { valor: "ENVIADO", texto: "Enviado", icono: "local_shipping", color: "#f59e0b" },
    { valor: "ENTREGADO", texto: "Entregado", icono: "done_all", color: "#10b981" },
    { valor: "CANCELADO", texto: "Cancelado", icono: "cancel", color: "#ef4444" }
  ];
  
  // Lista de recursos disponibles
  recursos: Recurso[] = [];
  
  // Lista de incidentes disponibles
  incidentes: Incidente[] = [];
  
  // Lista de refugios disponibles
  refugios: Refugio[] = [];
  
  // Tipo de destino seleccionado
  tipoDestino: "incidente" | "refugio" = "incidente";

  // Inyecta los servicios necesarios
  constructor(
    private fb: FormBuilder,
    private asignacionService: AsignacionRecursoService,
    private recursoService: RecursoService,
    private incidenteService: IncidenteService,
    private refugioService: RefugioService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AsignacionRecursoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modo: string; asignacion?: AsignacionRecurso }
  ) {
    // Crea la estructura del formulario con sus validaciones
    this.form = this.fb.group({
      recurso_id: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      estado: ["SOLICITADO", Validators.required],
      incidente_id: [null],
      refugio_id: [null],
      usuario_asigna_id: [null],
      observaciones: [""]
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarDatosSelects();
    
    this.isEdit = this.data.modo === "editar";
    if (this.isEdit && this.data.asignacion) {
      this.form.patchValue(this.data.asignacion);
      if (this.data.asignacion.refugio_id) {
        this.tipoDestino = "refugio";
      }
    }
  }

  // Carga los datos para los selects (recursos, incidentes, refugios)
  cargarDatosSelects(): void {
    // Cargar recursos
    this.recursoService.getAll().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar recursos:", error);
      }
    });

    // Cargar incidentes
    this.incidenteService.getAll().subscribe({
      next: (data) => {
        this.incidentes = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar incidentes:", error);
      }
    });

    // Cargar refugios
    this.refugioService.getAll().subscribe({
      next: (data) => {
        this.refugios = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar refugios:", error);
      }
    });
  }

  // Cambia el tipo de destino y limpia los campos
  onTipoDestinoChange(tipo: "incidente" | "refugio"): void {
    this.tipoDestino = tipo;
    this.form.patchValue({
      incidente_id: tipo === "incidente" ? this.form.value.incidente_id : null,
      refugio_id: tipo === "refugio" ? this.form.value.refugio_id : null
    });
    this.cdr.detectChanges();
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    // Limpia cualquier mensaje de error previo
    this.mensajeErrorInline = "";
    this.cdr.detectChanges();

    // Valida que el formulario cumpla con todas las reglas establecidas
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeErrorInline = "Por favor completa todos los campos obligatorios correctamente";
      this.cdr.detectChanges();
      return;
    }

    // Valida que tenga al menos un destino
    if (!this.form.value.incidente_id && !this.form.value.refugio_id) {
      this.mensajeErrorInline = "Debes especificar un destino: incidente o refugio";
      this.cdr.detectChanges();
      return;
    }

    // Activa el indicador de carga
    this.loading = true;
    this.cdr.detectChanges();
    
    const formData = this.form.value;

    // Limpia el destino no seleccionado
    if (this.tipoDestino === "incidente") {
      formData.refugio_id = null;
    } else {
      formData.incidente_id = null;
    }

    // Construye el payload final
    const payload: CrearAsignacionDTO = {
      recurso_id: Number(formData.recurso_id),
      cantidad: Number(formData.cantidad),
      estado: formData.estado,
      incidente_id: formData.incidente_id ? Number(formData.incidente_id) : undefined,
      refugio_id: formData.refugio_id ? Number(formData.refugio_id) : undefined,
      usuario_asigna_id: formData.usuario_asigna_id ? Number(formData.usuario_asigna_id) : undefined,
      observaciones: formData.observaciones || undefined
    };

    // Lógica para actualizar una asignación existente
    if (this.isEdit && this.data.asignacion) {
      console.log("Actualizando asignación ID:", this.data.asignacion.id);
      console.log("Payload:", payload);
      
      this.asignacionService.update(this.data.asignacion.id, payload).subscribe({
        next: (response) => {
          console.log("Asignación actualizada correctamente:", response);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error completo al actualizar:", error);
          console.error("Status:", error.status);
          console.error("Error body:", error.error);
          
          this.loading = false;
          
          // Muestra el error con el mensaje específico
          this.mostrarErrorBackend(error, "actualizar");
          this.cdr.detectChanges();
        }
      });
    } 
    // Lógica para crear una nueva asignación
    else {
      console.log("Creando nueva asignación con payload:", payload);
      
      this.asignacionService.create(payload).subscribe({
        next: (response) => {
          console.log("Asignación creada correctamente:", response);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error completo al crear:", error);
          console.error("Status:", error.status);
          console.error("Error body:", error.error);
          
          this.loading = false;
          
          // Muestra el error con el mensaje específico
          this.mostrarErrorBackend(error, "crear");
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Método para mostrar errores del backend de forma consistente
private mostrarErrorBackend(error: any, accion: string): void {
  console.log("=== PROCESANDO ERROR ===");
  console.log("Acción:", accion);
  console.log("Status:", error.status);
  console.log("Error completo:", error);
  console.log("Error body:", error.error);
  console.log("========================");

  // Maneja error 404 - Asignación no encontrada
  if (error.status === 404) {
    this.mensajeErrorInline = "El ID del usuario que asigna no existe o fue eliminado";
    console.log("Mensaje 404:", this.mensajeErrorInline);
    return;
  }

  // Maneja errores de validación del backend (status 400)
  if (error.status === 400 && error.error) {
    const backendData = error.error;
    
    // Si el backend devuelve un array de errores en "errores"
    if (backendData.errores && Array.isArray(backendData.errores)) {
      const errores = backendData.errores;
      console.log("Array de errores recibidos:", errores);
      
      // Busca errores específicos de usuario_asigna_id
      const errorUsuario = errores.find((e: string) => 
        e.toLowerCase().includes("usuario") || 
        e.toLowerCase().includes("usuario_asigna") ||
        e.toLowerCase().includes("usuario_asigna_id")
      );
      
      // Muestra mensaje específico para errores de usuario
      if (errorUsuario) {
        if (errorUsuario.toLowerCase().includes("no existe") || 
            errorUsuario.toLowerCase().includes("not found") ||
            errorUsuario.toLowerCase().includes("no está activo")) {
          this.mensajeErrorInline = "El ID del usuario que asigna no existe o fue eliminado";
        } else if (errorUsuario.toLowerCase().includes("obligatorio")) {
          this.mensajeErrorInline = "El usuario que asigna es obligatorio";
        } else {
          this.mensajeErrorInline = "El ID del usuario que asigna no es válido";
        }
        console.log("Mensaje error usuario:", this.mensajeErrorInline);
        return;
      }
      
      // Si no es error específico, muestra el primer error
      this.mensajeErrorInline = errores[0] || "Error al " + accion + ": Datos inválidos";
      console.log("Mensaje error genérico:", this.mensajeErrorInline);
      return;
    }
    
    // Si el backend devuelve un mensaje directo
    if (backendData.message) {
      // Detecta si es error de usuario
      if (backendData.message.toLowerCase().includes("usuario")) {
        this.mensajeErrorInline = "El ID del usuario que asigna no existe o fue eliminado";
      } else {
        this.mensajeErrorInline = backendData.message;
      }
      console.log("Mensaje directo del backend:", this.mensajeErrorInline);
      return;
    }
  }
  
  // Caso por defecto - error genérico
  this.mensajeErrorInline = "Error al " + accion + ": No se pudo conectar con el servidor";
  console.log("Mensaje error por defecto:", this.mensajeErrorInline);
}
  // Cierra el modal sin guardar
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Obtiene el icono correspondiente al estado seleccionado
  getEstadoIcono(valor: string): string {
    const estado = this.estadosAsignacion.find(e => e.valor === valor);
    return estado ? estado.icono : "info";
  }

  // Obtiene el color correspondiente al estado seleccionado
  getEstadoColor(valor: string): string {
    const estado = this.estadosAsignacion.find(e => e.valor === valor);
    return estado ? estado.color : "#6b7280";
  }

  // Obtiene el nombre del recurso por su ID
  getNombreRecurso(id: number): string {
    const recurso = this.recursos.find(r => r.id === id);
    return recurso ? recurso.nombre : "Recurso #" + id;
  }

  // Obtiene el nombre del incidente por su ID
  getNombreIncidente(id: number): string {
    const incidente = this.incidentes.find(i => i.id === id);
    return incidente ? incidente.titulo : "Incidente #" + id;
  }

  // Obtiene el nombre del refugio por su ID
  getNombreRefugio(id: number): string {
    const refugio = this.refugios.find(r => r.id === id);
    return refugio ? refugio.nombre : "Refugio #" + id;
  }

  // Obtiene el color del icono según el tipo de recurso
  getColorIconoRecurso(tipo: string): string {
    const colores: { [key: string]: string } = {
      AGUA: "#00f0ff",
      ALIMENTO: "#f59e0b",
      MEDICAMENTO: "#ef4444",
      EQUIPO: "#10b981",
      VEHICULO: "#fbbf24",
      OTRO: "#6b7280"
    };
    return colores[tipo] || "#6b7280";
  }

  // Obtiene el color del icono según el tipo de incidente
  getColorIconoIncidente(tipo: string): string {
    const colores: { [key: string]: string } = {
      INUNDACION: "#0ea5e9",
      TERREMOTO: "#8b5cf6",
      INCENDIO: "#ef4444",
      DESLIZAMIENTO: "#10b981",
      ACTIVIDAD_VOLCANICA: "#f59e0b",
      OTRO: "#6b7280"
    };
    return colores[tipo] || "#6b7280";
  }

  // Obtiene el color del icono para refugios (color único)
  getColorIconoRefugio(): string {
    return "#00f0ff";
  }

  // Obtiene el tipo de recurso por su ID
  getTipoRecurso(id: number): string {
    const recurso = this.recursos.find(r => r.id === id);
    return recurso ? recurso.tipo : "OTRO";
  }

  // Obtiene el tipo de incidente por su ID
  getTipoIncidente(id: number): string {
    const incidente = this.incidentes.find(i => i.id === id);
    return incidente ? incidente.tipo : "OTRO";
  }

  // Obtiene el icono correspondiente al tipo de recurso
  getIconoRecurso(tipo: string): string {
    const iconos: { [key: string]: string } = {
      AGUA: "water_drop",
      ALIMENTO: "restaurant",
      MEDICAMENTO: "medical_services",
      EQUIPO: "build",
      VEHICULO: "local_shipping",
      OTRO: "category"
    };
    return iconos[tipo] || "category";
  }

  // Obtiene el icono correspondiente al tipo de incidente
  getIconoIncidente(tipo: string): string {
    const iconos: { [key: string]: string } = {
      INUNDACION: "water_drop",
      TERREMOTO: "crisis_alert",
      INCENDIO: "local_fire_department",
      DESLIZAMIENTO: "landscape",
      ACTIVIDAD_VOLCANICA: "volcano",
      OTRO: "category"
    };
    return iconos[tipo] || "category";
  }

}
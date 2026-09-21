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

  form: FormGroup;

  loading: boolean = false;

  isEdit: boolean = false;

  mostrarErrorDestino: boolean = false;

  // Mensajes de error enviados por el backend
  errorUsuario: string = "";
  errorIncidente: string = "";
  errorRefugio: string = "";
  errorGeneral: string = "";

  rolesAsignacion: string[] = [
    "COORDINACION",
    "RESCATE",
    "APOYO",
    "LOGISTICA",
    "GESTION_REFUGIO"
  ];

  estadosAsignacion: string[] = [
    "ASIGNADO",
    "EN_CAMINO",
    "ACTIVO",
    "FINALIZADO"
  ];

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
    this.form = this.fb.group({
      usuario_id: [
        null,
        Validators.required
      ],

      incidente_id: [
        null
      ],

      refugio_id: [
        null
      ],

      rol_asignado: [
        "APOYO",
        Validators.required
      ],

      estado: [
        "ASIGNADO",
        Validators.required
      ],

      fecha_finalizacion: [
        null
      ],

      observaciones: [
        "",
        Validators.maxLength(500)
      ]
    });
  }

  ngOnInit(): void {

    this.isEdit =
      this.data.modo === "editar";

    /*
     * Cuando se escribe un incidente,
     * se deshabilita el refugio.
     */
    this.form
      .get("incidente_id")
      ?.valueChanges
      .subscribe((valor) => {

        // Limpiar error anterior
        this.errorIncidente = "";

        if (
          valor !== null &&
          valor !== ""
        ) {
          this.form
            .get("refugio_id")
            ?.disable({
              emitEvent: false
            });
        } else {

          if (!this.isEdit) {
            this.form
              .get("refugio_id")
              ?.enable({
                emitEvent: false
              });
          }
        }
      });

    /*
     * Cuando se escribe un refugio,
     * se deshabilita el incidente.
     */
    this.form
      .get("refugio_id")
      ?.valueChanges
      .subscribe((valor) => {

        // Limpiar error anterior
        this.errorRefugio = "";

        if (
          valor !== null &&
          valor !== ""
        ) {
          this.form
            .get("incidente_id")
            ?.disable({
              emitEvent: false
            });
        } else {

          if (!this.isEdit) {
            this.form
              .get("incidente_id")
              ?.enable({
                emitEvent: false
              });
          }
        }
      });

    /*
     * Cuando se escribe un usuario,
     * limpiamos el error anterior.
     */
    this.form
      .get("usuario_id")
      ?.valueChanges
      .subscribe(() => {
        this.errorUsuario = "";
      });

    /*
     * Cargar datos cuando se está editando.
     */
    if (
      this.isEdit &&
      this.data.asignacionPersonal
    ) {

      const asignacion =
        this.data.asignacionPersonal;

      this.form.patchValue({

        usuario_id:
          asignacion.usuario_id,

        incidente_id:
          asignacion.incidente_id ?? null,

        refugio_id:
          asignacion.refugio_id ?? null,

        rol_asignado:
          asignacion.rol_asignado,

        estado:
          asignacion.estado,

        fecha_finalizacion:
          asignacion.fecha_finalizacion
            ? this.convertirFechaParaInput(
                asignacion.fecha_finalizacion
              )
            : null,

        observaciones:
          asignacion.observaciones ?? ""
      });

      /*
       * En edición estos campos
       * no se pueden modificar.
       */
      this.form
        .get("usuario_id")
        ?.disable();

      this.form
        .get("incidente_id")
        ?.disable();

      this.form
        .get("refugio_id")
        ?.disable();
    }
  }

  /*
   * Convierte una fecha ISO a un formato
   * compatible con datetime-local.
   */
  convertirFechaParaInput(
    fecha: Date | string
  ): string {

    const date =
      new Date(fecha);

    const año =
      date.getFullYear();

    const mes =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const dia =
      String(
        date.getDate()
      ).padStart(2, "0");

    const horas =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutos =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    return `${año}-${mes}-${dia}T${horas}:${minutos}`;
  }

  /*
   * Verifica que exista exactamente uno:
   * incidente_id O refugio_id.
   */
  validarDestino(): boolean {

    const incidente =
      this.form
        .get("incidente_id")
        ?.value;

    const refugio =
      this.form
        .get("refugio_id")
        ?.value;

    const tieneIncidente =
      incidente !== null &&
      incidente !== undefined &&
      incidente !== "";

    const tieneRefugio =
      refugio !== null &&
      refugio !== undefined &&
      refugio !== "";

    return tieneIncidente !== tieneRefugio;
  }

  /*
   * Procesar error enviado por el backend.
   */
  procesarError(error: any): void {

    this.errorUsuario = "";
    this.errorIncidente = "";
    this.errorRefugio = "";
    this.errorGeneral = "";

    const mensaje =
      error?.error?.message ||
      error?.message ||
      "Ocurrió un error al procesar la solicitud.";

    const mensajeLower =
      mensaje.toLowerCase();

    if (
      mensajeLower.includes("usuario") &&
      mensajeLower.includes("no existe")
    ) {

      this.errorUsuario = mensaje;

      this.form
        .get("usuario_id")
        ?.setErrors({
          ...this.form.get("usuario_id")?.errors,
          idNoExiste: true
        });

      return;
    }

    if (
      mensajeLower.includes("incidente") &&
      mensajeLower.includes("no existe")
    ) {

      this.errorIncidente = mensaje;

      this.form
        .get("incidente_id")
        ?.setErrors({
          ...this.form.get("incidente_id")?.errors,
          idNoExiste: true
        });

      return;
    }

    if (
      mensajeLower.includes("refugio") &&
      mensajeLower.includes("no existe")
    ) {

      this.errorRefugio = mensaje;

      this.form
        .get("refugio_id")
        ?.setErrors({
          ...this.form.get("refugio_id")?.errors,
          idNoExiste: true
        });

      return;
    }

    this.errorGeneral = mensaje;
  }

  onSubmit(): void {

    // Limpiar mensajes anteriores
    this.errorUsuario = "";
    this.errorIncidente = "";
    this.errorRefugio = "";
    this.errorGeneral = "";

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    /*
     * Al crear debe existir exactamente
     * un incidente o un refugio.
     */
    if (
      !this.isEdit &&
      !this.validarDestino()
    ) {

      this.mostrarErrorDestino = true;

      return;
    }

    this.mostrarErrorDestino = false;

    this.loading = true;

    const formData =
      this.form.getRawValue();

    /*
     * ACTUALIZAR
     */
    if (
      this.isEdit &&
      this.data.asignacionPersonal
    ) {

      const datosActualizacion = {

        rol_asignado:
          formData.rol_asignado,

        estado:
          formData.estado,

        fecha_finalizacion:
          formData.fecha_finalizacion
            ? new Date(
                formData.fecha_finalizacion
              )
            : null,

        observaciones:
          formData.observaciones || null
      };

      console.log(
        "Datos enviados al actualizar:",
        datosActualizacion
      );

      this.asignacionPersonalService
        .update(
          this.data.asignacionPersonal.id,
          datosActualizacion
        )
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

            console.error(
              "Respuesta del servidor:",
              error.error
            );

            this.procesarError(error);

            this.loading = false;
          }
        });

      return;
    }

    /*
     * CREAR
     */
    const datosCreacion: any = {

      usuario_id:
        Number(formData.usuario_id),

      rol_asignado:
        formData.rol_asignado,

      estado:
        formData.estado,

      observaciones:
        formData.observaciones ||
        undefined
    };

    /*
     * Si se indicó un incidente,
     * se envía incidente_id.
     */
    if (
      formData.incidente_id !== null &&
      formData.incidente_id !== undefined &&
      formData.incidente_id !== ""
    ) {

      datosCreacion.incidente_id =
        Number(formData.incidente_id);
    }

    /*
     * Si se indicó un refugio,
     * se envía refugio_id.
     */
    if (
      formData.refugio_id !== null &&
      formData.refugio_id !== undefined &&
      formData.refugio_id !== ""
    ) {

      datosCreacion.refugio_id =
        Number(formData.refugio_id);
    }

    console.log(
      "Datos enviados al crear:",
      datosCreacion
    );

    this.asignacionPersonalService
      .create(datosCreacion)
      .subscribe({

        next: () => {

          this.loading = false;

          this.dialogRef.close(true);
        },

        error: (error) => {

          console.error(
            "Error al crear la asignación de personal:",
            error
          );

          console.error(
            "Respuesta del servidor:",
            error.error
          );

          this.procesarError(error);

          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
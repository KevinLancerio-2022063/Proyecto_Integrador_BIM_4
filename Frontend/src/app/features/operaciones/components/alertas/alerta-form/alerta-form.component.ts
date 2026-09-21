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

import { AlertaService } from "../../../services/alerta.service";
import { Alerta } from "../../../models/alerta.model";

@Component({
selector: "app-alerta-forDm",
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

form: FormGroup;

loading: boolean = false;

isEdit: boolean = false;

// *Controla el mensaje de error de destino*
mostrarErrorDestino: boolean = false;

// *Errores específicos de IDs*
errorIncidente: string = "";
errorZona: string = "";
errorRefugio: string = "";
errorGeneral: string = "";

tiposAlerta: string[] = [
"Emergencia",
"Recurso",
"Refugio",
"Seguimiento",
"Otro"
];

nivelesAlerta: string[] = [
"Informacion",
"Advertencia",
"Critico"
];

estadosAlerta: string[] = [
  "Activa",
  "Leida"
];

constructor(
private fb: FormBuilder,
private alertaService: AlertaService,
public dialogRef: MatDialogRef<AlertaFormComponent>,
@Inject(MAT_DIALOG_DATA)
public data: {
modo: string;
alerta?: Alerta;
}
) {

this.form = this.fb.group({

  incidente_id: [
    null,
    Validators.min(1)
  ],

  zona_id: [
    null,
    Validators.min(1)
  ],

  refugio_id: [
    null,
    Validators.min(1)
  ],

  tipo: [
    "",
    Validators.required
  ],

  nivel: [
    "",
    Validators.required
  ],

  estado: [
    "Activa",
    Validators.required
  ],

  mensaje: [
    "",
    [
      Validators.required,
      Validators.maxLength(500)
    ]
  ]

});

}

ngOnInit(): void {

this.isEdit = this.data.modo === "editar";

/*
 * ============================================
 * LIMPIAR ERRORES DE IDs AL MODIFICARLOS
 * ============================================
 */

this.form.get("incidente_id")?.valueChanges.subscribe(() => {

  this.errorIncidente = "";

  this.eliminarErrorId(
    "incidente_id"
  );

});

this.form.get("zona_id")?.valueChanges.subscribe(() => {

  this.errorZona = "";

  this.eliminarErrorId(
    "zona_id"
  );

});

this.form.get("refugio_id")?.valueChanges.subscribe(() => {

  this.errorRefugio = "";

  this.eliminarErrorId(
    "refugio_id"
  );

});


/*
 * ============================================
 * MODO EDITAR
 * ============================================
 */

if (this.isEdit && this.data.alerta) {

  const estadoFrontend: { [key: string]: string } = {

    ACTIVA: "Activa",
    LEIDA: "Leida",
    RESUELTA: "Resuelta"
    
  };

  const tipoFrontend: { [key: string]: string } = {

    EMERGENCIA: "Emergencia",
    RECURSO: "Recurso",
    REFUGIO: "Refugio",
    SEGUIMIENTO: "Seguimiento",
    OTRO: "Otro"

  };

  const nivelFrontend: { [key: string]: string } = {

    INFO: "Informacion",
    ADVERTENCIA: "Advertencia",
    CRITICA: "Critico"

  };

  this.form.patchValue({

    ...this.data.alerta,

    tipo:
      tipoFrontend[this.data.alerta.tipo] ||
      this.data.alerta.tipo,

    nivel:
      nivelFrontend[this.data.alerta.nivel] ||
      this.data.alerta.nivel,

    estado:
      estadoFrontend[this.data.alerta.estado] ||
      this.data.alerta.estado

  });

  /*
   * En edición solamente Estado
   * puede modificarse.
   */

  this.form.get("incidente_id")?.disable();
  this.form.get("zona_id")?.disable();
  this.form.get("refugio_id")?.disable();

  this.form.get("tipo")?.disable();
  this.form.get("nivel")?.disable();
  this.form.get("mensaje")?.disable();

  // Estado permanece habilitado

}

/*
 * ============================================
 * MODO CREAR
 * ============================================
 */

else {

  /*
   * Toda alerta nueva comienza como Activa.
   */

  this.form.get("estado")?.setValue("Activa");

  /*
   * El estado no aparece ni puede modificarse
   * al crear.
   */

  this.form.get("estado")?.disable();

}

}

/*

* ============================================
* VALIDAR DESTINO
* ============================================
*
* Debe existir al menos uno:
*
* * incidente_id
* * zona_id
* * refugio_id
    */

validarDestino(): boolean {

const incidente =
  this.form.get("incidente_id")?.value;

const zona =
  this.form.get("zona_id")?.value;

const refugio =
  this.form.get("refugio_id")?.value;

return (

  incidente != null &&
  incidente !== ""

) ||

(

  zona != null &&
  zona !== ""

) ||

(

  refugio != null &&
  refugio !== ""

);

}

/*

* ============================================
* ELIMINAR ERROR PERSONALIZADO DE ID
* ============================================
  */

private eliminarErrorId(
controlName: string
): void {

const control =
  this.form.get(controlName);

if (!control) {
  return;
}

const errores =
  { ...(control.errors || {}) };

if (!errores["idNoExiste"]) {
  return;
}

delete errores["idNoExiste"];

control.setErrors(
  Object.keys(errores).length
    ? errores
    : null
);

}

/*

* ============================================
* PROCESAR ERROR DEL BACKEND
* ============================================
  */

private procesarError(error: any): void {

const mensaje =
  error?.error?.message ||
  error?.message ||
  "";

const mensajeMinuscula =
  mensaje.toString().toLowerCase();


/*
 * Limpiar errores anteriores
 */

this.errorIncidente = "";
this.errorZona = "";
this.errorRefugio = "";
this.errorGeneral = "";


/*
 * ERROR DE INCIDENTE
 */

if (
  mensajeMinuscula.includes("incidente") &&
  mensajeMinuscula.includes("no existe")
) {

  this.errorIncidente = mensaje;

  this.marcarIdNoExiste(
    "incidente_id"
  );

  return;
}


/*
 * ERROR DE ZONA
 */

if (
  mensajeMinuscula.includes("zona") &&
  mensajeMinuscula.includes("no existe")
) {

  this.errorZona = mensaje;

  this.marcarIdNoExiste(
    "zona_id"
  );

  return;
}


/*
 * ERROR DE REFUGIO
 */

if (
  mensajeMinuscula.includes("refugio") &&
  mensajeMinuscula.includes("no existe")
) {

  this.errorRefugio = mensaje;

  this.marcarIdNoExiste(
    "refugio_id"
  );

  return;
}


/*
 * ERROR GENERAL
 */

this.errorGeneral =
  mensaje ||
  "No se pudo registrar la alerta.";

}

/*

* ============================================
* MARCAR ID COMO INVÁLIDO
* ============================================
  */

private marcarIdNoExiste(
controlName: string
): void {

const control =
  this.form.get(controlName);

if (!control) {
  return;
}

control.setErrors({

  ...(control.errors || {}),

  idNoExiste: true

});

}

/*

* ============================================
* ENVIAR FORMULARIO
* ============================================
  */

onSubmit(): void {

/*
 * Limpiar mensajes anteriores
 */

this.errorIncidente = "";
this.errorZona = "";
this.errorRefugio = "";
this.errorGeneral = "";


/*
 * Validaciones normales
 */

if (this.form.invalid) {

  this.form.markAllAsTouched();

  return;
}


/*
 * Validar destino solamente al crear
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


/*
 * ============================================
 * MODO EDITAR
 * ============================================
 */

if (
  this.isEdit &&
  this.data.alerta
) {

  const estadoBackend: {
    [key: string]: string
  } = {

    Activa: "ACTIVA",
    Leida: "LEIDA",
    Resuelta: "RESUELTA"

  };


  /*
   * Al editar solamente enviamos Estado.
   */

  const datosActualizar = {

    estado:
      estadoBackend[
        this.form.get("estado")?.value
      ]

  };

  console.log(
    "Datos enviados al actualizar:",
    datosActualizar
  );


  this.alertaService
    .update(
      this.data.alerta.id,
      datosActualizar
    )
    .subscribe({

      next: () => {

        this.loading = false;

        this.dialogRef.close(true);

      },

      error: (error) => {

        console.error(
          "Error al actualizar la alerta:",
          error
        );

        this.loading = false;

        this.procesarError(
          error
        );

      }

    });

  return;
}


/*
 * ============================================
 * MODO CREAR
 * ============================================
 */

const tipoBackend: {
  [key: string]: string
} = {

  Emergencia: "EMERGENCIA",
  Recurso: "RECURSO",
  Refugio: "REFUGIO",
  Seguimiento: "SEGUIMIENTO",
  Otro: "OTRO"

};


const nivelBackend: {
  [key: string]: string
} = {

  Informacion: "INFO",
  Advertencia: "ADVERTENCIA",
  Critico: "CRITICA"

};


/*
 * Estado está deshabilitado.
 *
 * PostgreSQL colocará ACTIVA mediante
 * el DEFAULT de la columna.
 */

const formData = {

  ...this.form.value,

  tipo:
    tipoBackend[
      this.form.get("tipo")?.value
    ],

  nivel:
    nivelBackend[
      this.form.get("nivel")?.value
    ]

};


console.log(
  "Datos enviados al crear:",
  formData
);


this.alertaService
  .create(formData)
  .subscribe({

    next: () => {

      this.loading = false;

      this.dialogRef.close(true);

    },

    error: (error) => {

      console.error(
        "Error al crear la alerta:",
        error
      );

      this.loading = false;

      this.procesarError(
        error
      );

    }

  });

}

/*

* ============================================
* CANCELAR
* ============================================
  */

onCancel(): void {

this.dialogRef.close(false);

}

}
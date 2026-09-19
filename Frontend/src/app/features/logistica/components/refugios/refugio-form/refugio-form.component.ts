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
import { Refugio } from "../../../models/refugio.model";

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
      direccion: [""],
      zona_id: [null],
      latitud: [null, [Validators.min(-90), Validators.max(90)]],
      longitud: [null, [Validators.min(-180), Validators.max(180)]],
      estado: ["DISPONIBLE", Validators.required],
      responsable_id: [null],
      telefono_contacto: ["", [Validators.maxLength(30)]],
      observaciones: [""]
    });
  }

  ngOnInit(): void {
    this.isEdit = this.data.modo === "editar";
    if (this.isEdit && this.data.refugio) {
      this.form.patchValue(this.data.refugio);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.ocupacion_actual > this.form.value.capacidad_total) {
      alert("La ocupación actual no puede exceder la capacidad total");
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    if (this.isEdit && this.data.refugio) {
      this.refugioService.update(this.data.refugio.id, formData).subscribe({
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
      this.refugioService.create(formData).subscribe({
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
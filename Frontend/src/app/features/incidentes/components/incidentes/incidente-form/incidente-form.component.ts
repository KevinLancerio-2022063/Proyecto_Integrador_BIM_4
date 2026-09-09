import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { IncidenteService } from "../../../services/incidente.service";
import { Incidente } from "../../../models/incidente.model";

@Component({
  selector: "app-incidente-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: "./incidente-form.component.html",
  styleUrls: ["./incidente-form.component.css"]
})
export class IncidenteFormComponent implements OnInit { // <-- La palabra 'export' es obligatoria
  form: FormGroup;
  modo: "crear" | "editar" = "crear";
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private incidenteService: IncidenteService,
    private dialogRef: MatDialogRef<IncidenteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modo: "crear" | "editar"; incidente?: Incidente }
  ) {
    this.modo = data.modo || "crear";

    this.form = this.fb.group({
      tipo: ["INUNDACION", Validators.required],
      titulo: ["", [Validators.required, Validators.minLength(3)]],
      descripcion: [""],
      nivel_emergencia: ["MEDIA", Validators.required],
      estado: ["REPORTADO", Validators.required],
      zona_id: [1, [Validators.required, Validators.min(1)]],
      reportado_por: [1, Validators.required],
      latitud: [null],
      longitud: [null],
      cantidad_personas_afectadas: [0, Validators.min(0)],
      observaciones: [""]
    });
  }

  ngOnInit(): void {
    if (this.modo === "editar" && this.data.incidente) {
      this.form.patchValue(this.data.incidente);
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const datos = this.form.value;

    if (this.modo === "crear") {
      this.incidenteService.create(datos).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error("Error al crear incidente:", err);
          this.loading = false;
        }
      });
    } else if (this.data.incidente?.id) {
      this.incidenteService.update(this.data.incidente.id, datos).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error("Error al actualizar incidente:", err);
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
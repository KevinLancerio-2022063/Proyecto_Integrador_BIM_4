import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { IncidenteService } from '../../../services/incidente.service';
import { Incidente } from '../../../models/incidente.model';

@Component({
  selector: 'app-incidente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './incidente-form.component.html',
  styleUrls: ['./incidente-form.component.css']
})
export class IncidenteFormComponent implements OnInit {
  form!: FormGroup;
  modo: 'crear' | 'editar' = 'crear';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private incidenteService: IncidenteService,
    public dialogRef: MatDialogRef<IncidenteFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { modo?: 'crear' | 'editar'; incidente?: Incidente }
  ) {}

  ngOnInit(): void {
    this.modo = this.data?.modo || 'crear';
    this.inicializarFormulario();

    if (this.modo === 'editar' && this.data?.incidente) {
      const inc: any = this.data.incidente;

      this.form.patchValue({
        titulo: inc.titulo,
        tipo: inc.tipo,
        nivelEmergencia: inc.nivelEmergencia || inc.nivel_emergencia || 'MEDIA',
        estado: inc.estado || 'REPORTADO',
        personasAfectadas: inc.personasAfectadas ?? inc.cantidad_personas_afectadas ?? 0,
        descripcion: inc.descripcion || '',
        observaciones: inc.observaciones || ''
      });
    }
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['INUNDACION', [Validators.required]],
      nivelEmergencia: ['MEDIA', [Validators.required]],
      estado: ['REPORTADO', [Validators.required]],
      personasAfectadas: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      observaciones: ['']
    });
  }

  guardar(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;
  const formVal = this.form.value;

  if (this.modo === 'editar' && this.data?.incidente) {
    const idReal = this.data.incidente.id || (this.data.incidente as any)._id || (this.data.incidente as any).id_incidente;
    
    // Objeto para actualización
    const datosActualizar = {
      titulo: formVal.titulo,
      descripcion: formVal.descripcion || '',
      tipo: formVal.tipo,
      nivelEmergencia: formVal.nivelEmergencia,
      nivel_emergencia: formVal.nivelEmergencia,
      estado: formVal.estado,
      personasAfectadas: Number(formVal.personasAfectadas || 0),
      cantidad_personas_afectadas: Number(formVal.personasAfectadas || 0),
      observaciones: formVal.observaciones || ''
    };

    this.incidenteService.update(idReal, datosActualizar).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al actualizar incidente:', err);
        this.loading = false;
      }
    });
  } else {
    // Objeto ajustado para cumplir con la interfaz CrearIncidenteDTO
    const datosCrear = {
      titulo: formVal.titulo,
      descripcion: formVal.descripcion || '',
      tipo: formVal.tipo,
      nivelEmergencia: formVal.nivelEmergencia,
      nivel_emergencia: formVal.nivelEmergencia,
      estado: formVal.estado,
      personasAfectadas: Number(formVal.personasAfectadas || 0),
      cantidad_personas_afectadas: Number(formVal.personasAfectadas || 0),
      observaciones: formVal.observaciones || '',
      
      // Propiedades requeridas por CrearIncidenteDTO
      zona_id: formVal.zona_id || 1,
      reportado_por: formVal.reportado_por || 1
    };

    this.incidenteService.create(datosCrear as any).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al crear incidente:', err);
        this.loading = false;
      }
    });
  }
}

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
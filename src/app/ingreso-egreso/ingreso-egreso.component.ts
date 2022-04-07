import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from './../app.reducer';
import { IngresoEgreso } from './../models/ingres-egreso.model';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import * as ui from './../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  public ingresoForm: FormGroup;
  public tipo: string = 'ingreso';
  public cargando: boolean = false;
  private loadingSubs: Subscription;

  constructor(private fb: FormBuilder, private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });

    this.loadingSubs = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  public guardar(): void {
    this.store.dispatch(ui.isLoading());
    if (this.ingresoForm.invalid) return;
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then(() => {
      this.ingresoForm.reset();
      Swal.fire('Registro creado', descripcion, 'success');
    }).catch((err) => {
      Swal.fire('Error', err.message, 'error');
    }).finally(() => {
      this.store.dispatch(ui.stopLoading());
    });
  }

}

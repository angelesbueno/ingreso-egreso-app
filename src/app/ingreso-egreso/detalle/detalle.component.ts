import { IngresoEgresoService } from './../../services/ingreso-egreso.service';
import { IngresoEgreso } from './../../models/ingres-egreso.model';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  public ingresosEgresos: IngresoEgreso[] = [];
  private ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private inresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosSubs = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => (this.ingresosEgresos = [...items]));
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  public borrar(uid: string): void {
    this.inresoEgresoService
      .borrarIngresoEgreso(uid)
      .then(() => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  }
}

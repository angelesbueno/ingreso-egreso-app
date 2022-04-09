import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MultiDataSet } from 'ng2-charts';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
import { IngresoEgreso } from './../../models/ingres-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit {
  public ingresos: number = 0;
  public egresos: number = 0;
  public totalIngresos: number = 0;
  public totalEgresos: number = 0;

  public doughnutChartLabels: string[] = [
    'Ingresos',
    'Egresos',
  ];
  public doughnutChartData: MultiDataSet = [
    []
  ];

  constructor(private store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => this.generarEstadistica(items));
  }

  private generarEstadistica(items: IngresoEgreso[]): void {
    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
  }
}

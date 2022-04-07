import * as ingresoEgresoActions from './../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { AppState } from './../app.reducer';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private userSubs: Subscription;
  private ingresosEgresosSubs: Subscription;

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user').pipe(filter(auth => auth.user != null)).subscribe(({user}) => {
      console.log('user ---> ', user);
      this.ingresosEgresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid).subscribe(ingresosEgresosFB => {
        this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB}));
      }
      );
    })
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.ingresosEgresosSubs.unsubscribe();
  }

}

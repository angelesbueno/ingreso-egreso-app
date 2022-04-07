import { AppState } from './../../app.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {

  public userName: string;
  private userSubs: Subscription;


  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.userSubs = this.store.select('user').subscribe(({user}) => {
     this.userName = user?.nombre;
    })
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}

import * as ingresoEgresoActions from './../ingreso-egreso/ingreso-egreso.actions';
import * as authActions from './../auth/auth.actions';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return {...this._user};
  }

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  public initAuthListener(): void {
    this.auth.authState.subscribe((firebaseUser) => {
      if (firebaseUser) {
        // existe
        this.userSubscription = this.firestore
          .doc(`${firebaseUser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromfirebase(firestoreUser);
            this._user = user;
            this.store.dispatch(authActions.setUser({ user }));
          });
        } else {
          // no existe
          this._user = null;
          this.userSubscription?.unsubscribe();
          this.store.dispatch(authActions.unSetUser());
          this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    });
  }

  public crearUsuario(
    nombre: string,
    email: string,
    password: string
  ): Promise<any> {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, email);
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }

  public loginUsuario(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public logout(): Promise<any> {
    return this.auth.signOut();
  }

  public isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(
      map((firebaseUser) => firebaseUser != null)
    );
  }
}

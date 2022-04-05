import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public auth: AngularFireAuth, public firestore: AngularFirestore) {}

  public initAuthListener(): void {
    this.auth.authState.subscribe(firebaseUser => {
      console.log('firebaseUser ---> ', firebaseUser);
      console.log('firebaseUser.id ---> ', firebaseUser?.uid);
      console.log('firebaseUser.email ---> ', firebaseUser?.email);
    })
  }

  public crearUsuario(nombre: string, email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password).then(({user}) => {
      const newUser = new Usuario(user.uid, nombre, email);
      return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
    });
  }

  public loginUsuario(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public logout(): Promise<any> {
   return this.auth.signOut();
  }

  public isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(map(firebaseUser => firebaseUser != null ));
  }
}

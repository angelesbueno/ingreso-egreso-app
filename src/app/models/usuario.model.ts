export class Usuario {
  static fromfirebase({ uid, nombre, email }) {
    return new Usuario(uid, nombre, email);
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}
}

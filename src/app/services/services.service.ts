import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  constructor(private http: HttpClient) { }

  enviar(datosForm: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/users', datosForm);
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/users');
  }

  mostrarUsuario(id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/users/' + id);
  }

  editar(id: number, datosForm: any): Observable<any> {
    return this.http.put('http://localhost:8000/api/users/' + id, datosForm);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete('http://localhost:8000/api/users/' + id);
  }
}
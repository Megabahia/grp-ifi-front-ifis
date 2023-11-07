import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

/*
* IFIS
* Personsas
* */

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  constructor(private _httpClient: HttpClient) {
  }

  /**
   * Esta ruta sirve para obtener informacion de la persona
   */
  obtenerInformacion(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/personas/personas/listOne/${id}`,);
  }

  /**
   * Este metodo sirve para actualizar la informacion de la persona
   */
  guardarInformacion(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/${datos.user_id}`, datos);
  }

  /**
   * Este metodo sirve para actualizar la imagen de la persona
   */
  guardarImagen(datos, id) {
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/imagen/${id}`, datos);
  }
}

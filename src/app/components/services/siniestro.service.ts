import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class SiniestroService {
  [x: string]: any;

  public url;
  public identity;
  public token;
  constructor(private _http: HttpClient) {

  }


  getSiniestro(): Observable<any> {

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Permite solicitudes de cualquier origen
      });

    return this._http
      .get( 'http://localhost:3000' + '/siniestro/getsiniestro')
      .pipe(map((res) => res));
  }

  addSiniestro(data): Observable<any> {
    var params = {
      body: data,
 
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http
      .post( 'http://localhost:3000' + '/siniestro/addSiniestro', JSON.stringify(params),{headers})
      .pipe(map((res) => res));
  }
  updateSiniestro(body): Observable<any> {
    var params = {
      body: body,
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http
      .post( 'http://localhost:3000' + '/siniestro/updateSiniestro',JSON.stringify(params),{headers})
      .pipe(map((res) => res));
  }
  deleteSiniestro(body): Observable<any> {

    var params = {
      id: body,
    };
    console.log('valor paramas',params)

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http
      .post( 'http://localhost:3000' + '/siniestro/deleteSiniestro', JSON.stringify(params),{headers})
      .pipe(map((res) => res));
  }


}
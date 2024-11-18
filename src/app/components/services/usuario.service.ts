import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class UsuarioService {
  [x: string]: any;

  public url;
  public identity;
  public token;
  constructor(private _http: HttpClient) {

  }

  login(data): Observable<any> {
    var params = {
      body: data,
    };
    console.log('valor paramas',params)

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http
      .post( 'http://localhost:3000' + '/usuario/login', JSON.stringify(params),{headers})
      .pipe(map((res) => res));
  }

}
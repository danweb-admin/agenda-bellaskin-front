import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL_MODEL_CONFIG = '/api/v1/model-configuration';

@Injectable({
  providedIn: 'root'
})
export class ModelConfigurationService {
  
  constructor(private http: HttpClient){

  }

  getTechnicalAttributes(): any{
    return this.http.get(`${environment.URL_API}${URL_MODEL_CONFIG}/techinical-attributes`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  getAttributeTypes(): any{
    return this.http.get(`${environment.URL_API}${URL_MODEL_CONFIG}/attribute-type`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }
}

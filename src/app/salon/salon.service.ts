import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SalonResponse } from './salon.interface';
import { environment } from '../../environments/environment.development'


@Injectable({
  providedIn: 'root'
})
export class SalonService {
 private baseUrl = environment.apiUrl;//'http://localhost:4000';

  constructor(private httpClient: HttpClient,private router: Router) { }

  findAll():Observable<SalonResponse>{
    const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
  	      return this.httpClient.get<SalonResponse>(`${ this.baseUrl }/salon/`,{ headers });
      }
      return new Observable<SalonResponse>();
  }

}

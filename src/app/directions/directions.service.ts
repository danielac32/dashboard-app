import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {DirectionResponse} from "./directions.interface"
import { environment } from '../../environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class DirectionsService {
  private baseUrl = environment.apiUrl;//'http://localhost:4000';
  constructor(private httpClient: HttpClient,private router: Router) { }

  findAll():Observable<DirectionResponse>{
    const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
  	      return this.httpClient.get<DirectionResponse>(`${ this.baseUrl }/directions/`,{ headers });
      }
      return new Observable<DirectionResponse>();
  }
}

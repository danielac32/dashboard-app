
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportBySalonResponse,ExcelReportByUser,ReportByUser,ReportByUserResponse,GetReportByUser,Reservation, ReservationResponse,ReservationResponse2,ReservationResponse3 } from '../interface/reservation.interface';
import { CreateReservation } from '../interface/create-reservation.interface';
import { StatusReserveTypes } from '../interface/status-reserve.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../../../environments/environment.development"
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private baseUrl = environment.apiUrl;//'http://localhost:4000';

  constructor(private httpClient: HttpClient) { }
  

  generarExcel(data: any[], nombreArchivo: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
  }


  deleteReservation(id:number):Observable<Reservation>{
     const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });

          return this.httpClient.delete<Reservation>(`${ this.baseUrl }/reservations/${id}`,{ headers });
      }
      return new Observable<Reservation>();
  }

 

  reportByUser(userId: number, startDate: string, endDate: string):Observable<ReportByUserResponse> {
    const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.httpClient.get<ReportByUserResponse>(`${this.baseUrl}/users/reservations/${userId}/${startDate}/${endDate}`,{ headers })
      }
    return new Observable<ReportByUserResponse>();
  }

  reportBySalon(salonId: number, startDate: string, endDate: string):Observable<ReportBySalonResponse> {
    const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.httpClient.get<ReportBySalonResponse>(`${this.baseUrl}/salon/reservations/${salonId}/${startDate}/${endDate}`,{ headers })
      }
    return new Observable<ReportBySalonResponse>();
  }


  createReservation(createReservation: CreateReservation): Observable<Reservation> {
    const token = localStorage.getItem('accessToken');
    if (token) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.httpClient.post<Reservation>(`${ this.baseUrl }/reservations`, {
          ...createReservation
        },{ headers });
    }
    return new Observable<Reservation>();
  }

  allReservationByUser(term: string, state?: string, limit: number = 10, page: number = 1 ): Observable<ReservationResponse3> {
    const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });

          return this.httpClient.get<ReservationResponse3>
            (`${ this.baseUrl }/users/${ term }/reservations?state=${state}&limit=${ limit }&page=${page}`,{ headers })
      }
      return new Observable<ReservationResponse3>();
  }


  allReservations(status?: string, limit = 10, page = 1): Observable<ReservationResponse> {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.httpClient
        .get<ReservationResponse>
          (`${ this.baseUrl}/reservations?state=${ status }&limit=${ limit }&page=${ page }`,{ headers });
    } 
    return new Observable<ReservationResponse>();
  }

  reservationById(id: string): Observable<ReservationResponse2> {
    const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.httpClient.get<ReservationResponse2>(`${ this.baseUrl }/reservations/${ id }`,{ headers })
      }
      return new Observable<ReservationResponse2>();
  }

  changeStatusInReservation(id: number, newStatus: string): Observable<Reservation> {
    const token = localStorage.getItem('accessToken');
      if (token) {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return this.httpClient.patch<Reservation>(`${ this.baseUrl }/reservations/${ id }/change-status`, {
            status: newStatus
          },{ headers });
      }
      return new Observable<Reservation>();
  }
}

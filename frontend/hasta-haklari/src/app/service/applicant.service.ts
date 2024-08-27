import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Applicant } from '../model/applicant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public saveApplication(applicant: Applicant): Observable<Applicant>{
    return this.http.post<Applicant>(`${this.apiServerUrl}/application/save`, applicant);
  }

  public getApplications(): Observable<Applicant[]>{
    return this.http.get<Applicant[]>(`${this.apiServerUrl}/application/applications`);
  }

  public updateApplications(applicant: Applicant): Observable<Applicant>{
    return this.http.put<Applicant>(`${this.apiServerUrl}/application/update`, applicant);
  }

  public deleteApplications(applicationsId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/application/delete/${applicationsId}`);
  }

  public findById(applicationsId: number): Observable<Applicant>{
    return this.http.get<Applicant>(`${this.apiServerUrl}/application/findById/${applicationsId}`)
  }
}

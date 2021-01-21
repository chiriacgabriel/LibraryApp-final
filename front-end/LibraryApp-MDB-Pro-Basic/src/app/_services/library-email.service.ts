import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LibraryEmail} from '../model/LibraryEmail';

const API_URL = 'http://localhost:8080/api/email/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class LibraryEmailService {

  constructor(private http: HttpClient) {
  }

  saveAndSendEmail(libraryEmail: LibraryEmail): Observable<LibraryEmail>{
    return this.http.post<LibraryEmail>(API_URL, {
      email: libraryEmail.email,
      subject: libraryEmail.subject,
      emailBody: libraryEmail.emailBody
    }, httpOptions);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Publisher, Domain} from "./types";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient) {
    }

    getPublishers(): Observable<Publisher[]> {
        return this.http.get<Publisher[]>('http://localhost:4300/api/publishers');
      }

    addPublisher(publisher: Publisher): Observable<Publisher> {
        return this.http.post<Publisher>('http://localhost:4300/api/publishers', publisher);
      }
      
    getDomainsByPublisher(publisherName: string): Observable<Domain[]> {
        return this.http.get<Domain[]>(`http://localhost:4300/api/domains/${publisherName}`);
    }
    
}

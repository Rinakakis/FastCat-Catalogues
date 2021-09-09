import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { List } from './Lits'
import { LIST } from  './mock_list';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private url = 'http://localhost:3000/docs';
  
  constructor(private http:HttpClient) { }

  getList(): Observable<List[]>{
    const list = of(LIST);
    return list;
  }
  
  getRecord(title: string): Observable<List | undefined>{
    
    const list = LIST.find(record => record.title == title);
    
    return of(list);
  }
  
  getRecordData(title: string): Observable<any>{
    // const mod: String = '('+title+')'+'.json';

    return this.http.get<any>(this.url);
  }


}

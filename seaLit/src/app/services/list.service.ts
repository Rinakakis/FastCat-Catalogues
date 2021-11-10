import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  Titles: any[] = [];
  Ip: string = '192.168.1.14';

  constructor(private http:HttpClient) {
  }

  getNamesOfSources(): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/numberOfrecords/all');
  }

  getNameOfSource(title: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/numberOfrecords/'+title);
  }

  getSourceList(record: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/sourceRecordList/'+record);
  }

  getTitlesofSourceRecords(title: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/sourceRecordTitles/'+title);
  }

  getTableFromSource(source: string,tableName: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/tableData?'+'source='+source+'&tableName='+tableName);
  }

  getTablesFromSource(source: string, tableName: string, query: any): Observable<any>{
    console.log(query)
    var httpParams = new HttpParams();
    Object.keys(query).forEach((key: string) => {
      httpParams = httpParams.append(key, query[key]);
    });
    httpParams = httpParams.append('source',source);
    httpParams = httpParams.append('tableName',tableName);

    return this.http.get('http://'+this.Ip+':8081/tableData', { params: httpParams });
  }

  getrecordFromSource(source: string,id: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/tableData?'+'source='+source+'&id='+id);
  }

}

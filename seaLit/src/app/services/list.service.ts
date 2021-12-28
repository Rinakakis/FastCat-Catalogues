import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isObject } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  Titles: any[] = [];
  Ip: string = '192.168.1.10';

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

  ConvertToCSV(table: any){
    var data = table.map((elem: object) =>{
      return Object.values(elem)
      .filter(col => typeof col == 'string' && col != 'list')
      .map(elem2=>  '"'+elem2+'"')
      .join(',');
    })
    var titles = this.getTitles(table[0]).map(elem2=>  '"'+elem2+'"').join(',');
    data.unshift(titles);

    return data.join('\n');
  }
  
    getTitles(temp: any): string[]{
      var titles: string[] = [];
      console.log(temp)
      for (const [key, value] of Object.entries(temp)) {
        if(!isObject(value) && key!='value-type' && key!='listLength' &&key!='listIds')
          titles.push(key);
      }
      return titles;
    }

    arrayRemove(arr: string[], value: string): string[] { 
      return arr.filter(function(ele){ 
          return ele != value; 
      });
    }
    
}

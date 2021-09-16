import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { List } from '../Lits'
import { LIST } from  '../mock_list';
import { INSTANCES } from '../instances';
import { PARSER } from '../parser';
import { crewIT } from '../dummy-crew-lis-IT';
import * as _ from 'lodash';

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

  getCreListIT2(): object{
    const mapp = this.mapping();
    const parser = PARSER;
    const crewList: any[] = crewIT;
    var objArray: any = {};
    
    for (const key in mapp) { // for every source type 
      if(key == crewList[0].docs[0].template){ // for now only for crew list IT
        var temp = parser[mapp[key]];

        for (let i = 0; i < crewList.length; i++) {
          var fake = JSON.parse(JSON.stringify(temp));
          // we dublicate the structure of the parser so we can 
          // change the path to actual data

          for(const entitie in temp){ // entitie --> array name
              
              var table = temp[entitie];
              for(const column in table){
                var item = table[column]; // path from parser 
                var data = _.get(crewList[i],item);
                // if( typeof data == 'string')
                //   fake[entitie][column] = data;
                // else
                //   fake[entitie][column] = this.formatObject(data,column);
                
                fake[entitie][column] = data;

              }
          }
          objArray[crewList[i].docs[0]._id] = fake;
        }
      }
    }
    console.log(objArray);

    return objArray;
  }

  formatObject(data: any, column: string): any {
    console.log(column);  
    console.log(data);
    for (const i in data) {
        console.log(i,data[i]);
      
    }  
    
  }


  getSourceTypeLength(): number{
    return crewIT.length;
  }
  

  mapping(): any{
    return INSTANCES.templates_mapping;
  }

}

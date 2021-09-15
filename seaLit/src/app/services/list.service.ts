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

  getCreListIT(){
    const mapp = this.mapping();
    const instances = INSTANCES;
    const crewList: any[] = crewIT;
    var result: any[] = [];
    Object.keys(mapp).forEach(key=> {
      if(key == crewList[0].docs[0].template){
        console.log('for:',key)
        Object.keys(instances).forEach((entities: any)=>{

          if(entities !="templates_mapping"){
            var name = entities;
            // console.log(name);
            let res =  Object.keys(instances[entities]).filter((sType: any) => sType == mapp[key]).map(skey => instances[entities][skey]);
            if(res.length != 0){
              res[0][0].title = name;
              // console.log(res[0])
              result.push((res[0][0]));
            }
          }

        })
        console.log(result);
        result = [];
      }
    });
    // return crewList
  }

  getCreListIT2(){
    const mapp = this.mapping();
    const parser = PARSER;
    const crewList: any[] = crewIT;

    console.log(crewList)
    // console.log(parser)
    
    for (const key in mapp) { // for every source type 
      if(key == crewList[0].docs[0].template){ // for now only for crew list IT
        
        var temp = parser[mapp[key]];
        // console.log(temp)
        for(const entitie in temp){
            console.log(entitie+': ');
            // console.log(temp[entitie]);
            var table = temp[entitie];
            for(const column in table){
              var item = table[column];
              // console.log(crewList[0].item); doesn't work
              console.log(" "+column+":")
              console.log( _.get(crewList[0],item));
            }

        }

      }
      
    }
  }


  mapping(): any{
    return INSTANCES.templates_mapping;

  }

}

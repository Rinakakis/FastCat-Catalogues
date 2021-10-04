import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


import { List } from '../Lits'
import { LIST } from  '../mock_list';
import { INSTANCES } from '../instances';
import { PARSER } from '../parser2';
import { crewIT } from '../dummy-crew-lis-IT';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private url = 'http://localhost:3000/docs';
  temp: any = [];
  constructor(private http:HttpClient) {

  }

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

  getCreListIT2(a:any): object{
    const mapp = this.mapping();
    const parser = PARSER;
    // const crewList: any[] = crewIT;
    const crewList: any[] = a;
    var objArray: any = {};

    for (const key in mapp) { // for every source type
      if(key == crewList[0].docs[0].template){ // for now only for crew list IT
        var temp = parser[mapp[key]];
        // console.log(temp)
        console.log(crewList.length)
        for (let i = 0; i < crewList.length; i++){
          var fake = JSON.parse(JSON.stringify(temp));
          // we dublicate the structure of the parser so we can
          // change the path to actual data

          for(const entity in temp){ // entity --> array name e.g. Ship owners

              var table = temp[entity]; // the table object with columns
              // console.log(table['value-type'])
              if(table['value-type'] == undefined){
                for(const column in table){
                    var item = table[column]; // path from parser
                    if(item.path != undefined){ // undefined -> links
                      var data = _.get(crewList[i], item.path);
                      fake[entity][column] = data;

                    }else if(item.link != undefined){
                      var data = item.link;
                      fake[entity][column].link = data;
                    }
                }
              }else{

                for(const column in table){
                  var item = table[column]; // path from parser
                  if(item != 'list'){
                    if(item.path != undefined){ // undefined -> links

                      var data = _.get(crewList[i], item.path.split(".#.")[0]);

                      var index = 0;
                      var ar = [];
                      while(data[index]!= undefined && !_.isEmpty(data[index])){

                        ar.push(data[index++][item.path.split(".#.")[1]])
                      }
                      fake[entity][column] = ar;
                      fake[entity]['lenght'] = index;

                    }else if(item.link != undefined){
                      var data = item.link;
                      fake[entity][column].link = data;
                    }
                  }
                }
              }

          }
          objArray[crewList[i].docs[0]._id] = fake;
        }
      }
    }
    console.log(objArray);

    return objArray;
  }

  getEverything(){
    return this.http.get('http://192.168.1.20:8081/crew').toPromise()
        .then(res => this.getCreListIT2(res));
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

  getTypes(CrewLitsIT: any): any{
    var titles: any[] = [];
    var count : number[] = [];
    var temp = CrewLitsIT[Object.keys(CrewLitsIT)[0]];

    titles = Object.keys(temp);
    count = Array(titles.length).fill(0);

    for (const key in CrewLitsIT) {
        const element = CrewLitsIT[key];
        for (const record in element) {
          const entity = element[record];

            var index: number = titles.indexOf(record);
            if (entity['value-type'] != undefined){
              count[index] = count[index] + entity['lenght'];
            }else{
              count[index] = count[index] + 1;
            }
        }
        // break;
    }
    return {'count':count, 'titles':titles};
  }

}

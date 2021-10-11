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
  List: any;
  Ids: string[] = [];
  Titles: any[] = [];
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
      if(key == crewList[0].docs[0].template){ // for now, only for crew list IT
        var temp = parser[mapp[key]];
        // console.log(temp)
        console.log(crewList.length)
        for (let i = 0; i < crewList.length; i++){
          var fake = JSON.parse(JSON.stringify(temp));
          // we dublicate the structure of the parser so we can
          // change the path to actual data

          for(const entity in temp){ // entity --> array name e.g. Ship owners
              var table = temp[entity]; // the table object with columns

              if(table['value-type'] == undefined){
                for(const column in table){
                    var item = table[column]; // path from parser
                    if(item.path != undefined){ // undefined -> links
                      var data = _.get(crewList[i], item.path);
                      fake[entity][column] = data;

                    }else if(item.link != undefined){
                      var data = item.link;
                      fake[entity][column].link = data;
                      fake[entity][column].Id = _.get(crewList[i], item.Id);
                    }
                }
              }else{
                // if(entity == "Embarkation/Discharge ports"){
                for(const column in table){
                  var item = table[column]; // path from parser
                  if(item != 'list'){
                    if(item.path != undefined){ // undefined -> links
                      var ret: string[] = this.addListData(entity, item, crewList[i]);
                      fake[entity][column] = ret;
                      fake[entity]['lenght'] = ret.length;

                    }else if(item.link != undefined){
                      var data = item.link;
                      fake[entity][column].link = data;
                      fake[entity][column].Id = _.get(crewList[i], item.Id);
                    }
                  }
                }
                // console.log(fake[entity])
                // }
              }

          }
          this.mapTitle(crewList[i]);

          objArray[crewList[i].docs[0]._id] = fake;

        }
      }
    }
    this.List = objArray;
    console.log(objArray);

    return objArray;
  }

  addListData(entity: any, item: any, crew: any): string[] {
    var index = 0;
    var ar: string[] = [];

    if(Array.isArray(item.path)){ // condition for Embarkation/Discharge ports
      var data0 = _.get(crew, item.path[0].split(".#.")[0]);
      var data1 = _.get(crew, item.path[1].split(".#.")[0]);
      while(data0[index]!= undefined && !_.isEmpty(data0[index])){
          ar.push(data0[index][item.path[0].split(".#.")[1]] +', '+ data1[index++][item.path[1].split(".#.")[1]]);
      }
    }else{
      var data = _.get(crew, item.path.split(".#.")[0]);
      while(data[index]!= undefined && !_.isEmpty(data[index])){
        ar.push(data[index++][item.path.split(".#.")[1]]);
      }
    }
    // if(entity =!'Crew members'){

    //   ar = ar.filter(function(item, pos) {
    //     return ar.indexOf(item) == pos;
    //   })
    // }
    return ar;
  }

  getEverything(){
    return this.http.get('http://192.168.1.18:8081/crew').toPromise()
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

  mapTitle(record: any): void{
    var obj = record.docs[0].data;

    var title =  obj.ship_records.ship_name + ', ' + obj.source_identity.date_of_document + ', '
    + obj.record_information.name + ' ' + obj.record_information.surname + ' #' + obj.record_information.catalogue_id;


    // this.Ids.push(record.docs[0]._id);
    this.Titles.push([title,record.docs[0]._id]);
  }

  getIdfromTitle(title: string): string{
    console.log(title)

    var res = this.Titles.filter(data => data[0] == title);
    return res[0][1];
  }

}

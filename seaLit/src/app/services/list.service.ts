import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { INSTANCES } from '../templates';
import { PARSER } from '../crewListRuoli_conf';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  temp: any = [];
  List: any = [];
  Records: any[] = [];
  Ids: string[] = [];
  Titles: any[] = [];
  EntityData: any = {};

  constructor(private http:HttpClient) {
  }

  getNamesOfSources(): Observable<any>{
    const res = this.http.get('http://192.168.1.10:8081/numberOfrecords/all');
    res.subscribe(list => this.Records = <any[]> list);
    return res;
  }

  getNameOfSource(title: string): Observable<any>{
    return this.http.get('http://192.168.1.10:8081/numberOfrecords/'+title);
  }

  getSourceList(record: string): Observable<any>{
    return this.http.get('http://192.168.1.10:8081/sourceRecordList/'+record);
  }

  getTitlesofSourceRecords(title: string): Observable<any>{
    return this.http.get('http://192.168.1.10:8081/sourceRecordTitles/'+title);
  }

  getTableFromSource(source: string,tableName: string): Observable<any>{
    return this.http.get('http://192.168.1.10:8081/tableData?'+'source='+source+'&tableName='+tableName);
  }

  getTablesFromSource(source: string, tableName: string, query: any): Observable<any>{
    var httpParams = new HttpParams();
    Object.keys(query).forEach((key: string) => {
      httpParams = httpParams.append(key, query[key]);
    });
    httpParams = httpParams.append('source',source);
    httpParams = httpParams.append('tableName',tableName);

    return this.http.get('http://192.168.1.10:8081/tableData', { params: httpParams });
  }

  getrecordFromSource(source: string,id: string): Observable<any>{
    return this.http.get('http://192.168.1.10:8081/tableData?'+'source='+source+'&id='+id);
  }

  getCreListIT2(a:any): object{
    console.log(a);
    const mapp = this.mapping();
    console.log(mapp);
    const parser = PARSER;
    const crewList: any[] = a;
    var objArray: any = {};

    mapp.forEach((element: any) => {
       // for every source type
      if(element.id == crewList[0].docs[0].template){ // for now, only for crew list IT
        var temp = parser[element.name];
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
              }

          }
          this.mapTitle(crewList[i]);

          objArray[crewList[i].docs[0]._id] = fake;

        }
      }
    })
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
    // if(entity == 'Departure ports' || entity == 'Discharge ports' ){
    //   ar = ar.filter(function(item, pos) {
    //     return ar.indexOf(item) == pos;
    //   })
    //   // console.log(ar)
    // }

    return ar;
  }


  formatObject(data: any, column: string): any {
    console.log(column);
    console.log(data);
    for (const i in data) {
        console.log(i,data[i]);
    }
  }

  mapping(): any[]{
    return INSTANCES.templates.map((obj: any) =>{
      return {'name':obj.name, 'id': obj.id}
    })

  }

  getTypes(CrewLitsIT: any): any{
    var titles: any[] = [];
    var count : number[] = [];
    var temp = CrewLitsIT[Object.keys(CrewLitsIT)[0]];

    titles = Object.keys(temp);
    count = Array(titles.length).fill(0);

    for (const key in CrewLitsIT) {
        const element = CrewLitsIT[key]; // record obj without the id
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

    var title = obj.ship_records.ship_name + ', ' + obj.source_identity.date_of_document + ', '
    + obj.record_information.name + ' ' + obj.record_information.surname + ' #' + obj.record_information.catalogue_id;

    this.Titles.push([title,record.docs[0]._id]);
  }

  getIdfromTitle(title: string): string{
    var res = this.Titles.filter(data => data[0] == title);
    return res[0][1];
  }
  getTitlefromId(id: string): string{
    var res = this.Titles.filter(data => data[1] == id);
    return res[0][0];
  }

  formatList(temp: any): any[] {
    var array: any[] = [];
    var totalCount = 0;
    console.log(temp)
    if(Array.isArray(temp)){
      temp.forEach((element: any) => {
        var count = 0;
        while(count<element.lenght){
          var obj: any = {};
          for (const key in element){
            if(!Array.isArray(element[key])){
              obj[key] = element[key];
            }
            else{
              obj[key] = element[key][count];
            }
          }
          array[totalCount++]= obj;
          count++;
        }
      });
      console.log(array);
    }else{
      var element = temp;
      var count = 0;
      while(count<element.lenght){
        var obj: any = {};
        for (const key in element){
          if(!Array.isArray(element[key])){
            obj[key] = element[key];
          }
          else{
            obj[key] = element[key][count];
          }
        }
        array[totalCount++]= obj;
        count++;
      }
    }
    return this.removeDuplicates(array);
  }

  replaceEmptyValues(array: any[]):any[] {
    return array.map(obj => {
      Object.keys(obj).map(function(key) {
        if(obj[key] === '' || obj[key] == undefined) {
            obj[key] = 'Unknown';
        }
    });
    });
  }

  removeDuplicates(data: any[]): any[] {
    console.log(data)
    if(Object.values(data[0]).filter(val => typeof val == 'string' && val !='list').length == 1){ //if table has only one value

      var newarray: any[] = [];

      var temp: any[] = data.map(val =>{
        return Object.values(val).filter(val => typeof val == 'string' && val !='list').join();
      })
      // var temp:any[] = data.map(val =>{
      //   return Object.values(val).join(',').slice(0, -15);
      // })

      // console.log(temp)

      const count: boolean[] = temp.map(function (item, pos) {
        return temp.indexOf(item) == pos;
      })

      // const count: boolean[] = temp.filter(Boolean).length;
      // console.log(temp)
      // var lala = temp.reduce(function (acc, curr) {
      //   return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      // }, {});
      // console.log(lala)
      // console.log(count)
      console.log(count.filter(Boolean).length)
      for (let i = 0; i < data.length; i++){
        var element = data[i];
        if(count[i] == true){
          newarray.push(element)
        }else{
          var name = temp[i];
          var index = this.findIndexOfName(name,newarray);
          newarray[index] = this.merge(newarray[index], element);
        }
      }
      console.log(newarray)
      return newarray;
    }

    return data;
  }

  merge(father: any, element: any): any {
    // console.log(father)
    // console.log(element)
    for (const key in father) {
      if(_.isObject(father[key])){
        if(_.isArray(father[key])){
          father[key].push(element[key]);
        }else{
          var temp = [];
          temp.push(father[key],element[key]);
          // console.log('first')
          father[key] = temp;
        }
      }
    }
    return father;
    // console.log(father)
  }

  findIndexOfName(name: string, newarray: any[]) {
    return newarray.findIndex(data => Object.values(data).filter(val => typeof val == 'string' && val !='list').join() == name )
  }

  getRecordWithId(id: string): any{
    var source: any = this.List;
    return source[id];
  }

  getTableFromRecordWithId(id: string, name:string): any{
    var source: any = this.List;
    return _.get(source[id],name);
  }
}

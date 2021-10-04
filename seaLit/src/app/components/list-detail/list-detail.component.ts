import { Component, OnInit } from '@angular/core';

import { List } from '../../Lits'
import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject } from 'lodash';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };

  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
      if(isObject(event.value)){
        console.log('Cell was clicked')
        console.log(event)
      }
    })
  }

  rowData = [];
  records = new FormControl();
  recordList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  totalCount : number[] = [];
  record: List | undefined;
  recordDataTitles!: string[];
  showData: boolean = false;
  tableClicked: boolean = false;
  entityClicked: boolean = false;
  title!: string;
  sourceType: object = {};

  tables: any[] = [];
  tablesTitles: any[] = [];
  tablesCount: number = 0;
  selectedTable: boolean = false;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];;
  keysList: any[] = [];;

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService
  ) { }

  ngOnInit(): void {

    this.listservice.getEverything().then((CrewLitsIT : object)=>{
      this.sourceType = CrewLitsIT;
      this.getRecord(CrewLitsIT);
    });

  }

  getRecord(CrewLitsIT: object): void {

    const name = String(this.route.snapshot.paramMap.get('title'));

    this.listservice.getRecord(name)
      .subscribe(record => this.record = record);

    // console.log(this.record);

    if(this.record != undefined){
      this.title = String(this.record.title) + ' ('+this.getLength(CrewLitsIT) +' records)';
      this.recordList = Object.keys(CrewLitsIT).map((ids) => ids);

    }

     this.getTypes(CrewLitsIT);

    // this.recordList =
    // this.listservise.getRecordData(this.title)
    //   .subscribe((Rdata) => {
    //     // this.recordData = Rdata;
    //     this.recordDataTitles =  Object.keys(Rdata[0].data);
    //     this.showData = true;
    //   });
  }

  getTypes(CrewLitsIT: any): void{

    var res = this.listservice.getTypes(CrewLitsIT);

    this.totalCount = res.count;
    this.recordDataTitles = res.titles;
    this.showData = true;
  }

  getLength(element: any): number{
    return Object.values(element).length;
  }

  isEmpty(obj: Object) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  table(entity:string): void{
    if(this.tableClicked)
      this.tableClicked = !this.tableClicked;
    console.log(entity);
    this.getSelectedType(entity);
  }

  getSelectedType(entity: string): object{

    var source = this.sourceType;

    var temp: any = Object.values(source).map((val) => {
      // console.log(val[entity])
      return val[entity];
    });

    var titles: any =  this.getTitles(temp[0]);

    var titleFormat = titles.map((val: string) => {
        return {'field': val, 'sortable': true, 'filter': true};
    });


    this.columnDefs = titleFormat;
    console.log(titleFormat);

    console.log(temp);
    var res = temp;
    if(temp[0]["value-type"] == 'list')
      res = this.formatList(temp);

    this.rowData = res;
    this.tableClicked = !this.tableClicked;
    return {};
  }

  formatList(temp: any): any {
    var array: any[] = [];
    var totalCount = 0;

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
                  // console.log(element[key][count])
                }
              }
              array[totalCount++]= obj;
              count++;
              // break;
            }
          });
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
        // break;
      }
    }


    return array;
  }

  displaySelected(id:string): void {
    var record = this.getRecordWithId(id);
    var length = Object.keys(record).length;
    this.tablesCount = length;
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    // console.log(this.getTitles(record));

    for (const key in record){
      var table = record[key];
      var titles: any =  this.getTitles(table);

      if(table["value-type"] == 'list'){
        table = this.formatList(table);
        titles = this.getTitles(table[0]);
        // console.log(table)
        this.tables.push(table);
        this.keysList.push(key);

        var titleFormat = titles.map((val: string) => {
          return {'field': val, 'sortable': true, 'filter': true};
        });
        this.tablesTitles.push(titleFormat);

      }else{
        console.log(table)
        this.nonLitsInfo.push(table);
        this.keysNonList.push(key);
      }

    }
    // console.log(this.tables)
    // console.log(this.tablesTitles)
    console.log(this.nonLitsInfo)

    if(this.tableClicked)
      this.tableClicked = !this.tableClicked;

    if(!this.selectedTable)
      this.selectedTable = !this.selectedTable;
    console.log(length)
  }

  getRecordWithId(id: string): any{
    var source: any = this.sourceType;
    return source[id];
  }

  getTitles(temp: any): string[]{

    var titles: string[] =  Object.keys(temp);
    titles = titles.filter((name: string) => name!='value-type' && name!='lenght');
    return titles;
  }

  // isObject(value: any) : boolean {
  //   return typeof value === 'object' && !Array.isArray(value) && value !== null;
  // }
}


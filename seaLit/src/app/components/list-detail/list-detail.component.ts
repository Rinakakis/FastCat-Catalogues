import { Component, OnInit } from '@angular/core';

import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject, isPlainObject } from 'lodash';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {

  rowData = [];
  records = new FormControl();
  recordList: string[] = [];
  totalCount : number[] = [];
  record: any;
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
  keysNonList: any[] = [];
  entity: string = '';
  keysList: any[] = [];;

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const name = String(this.route.snapshot.paramMap.get('title'));

    this.listservice.getEverything(name).then((CrewLitsIT : object)=>{
      this.sourceType = CrewLitsIT;
      this.getRecord(CrewLitsIT);
    });

  }

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };

  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
        // console.log(this.entity)
        // console.log(event.data);
        var data = event.data;
        var entity = this.entity.replace('/','-');
        var name = ''
        Object.keys(data).forEach(k =>{
          if(typeof data[k] == 'string' && k!= 'value-type')
            name =data[k];
        });
        this.listservice.EntityData = data;
        this.router.navigate(['list/'+entity+'/'+name]);
    })
  }

  getRecord(CrewLitsIT: object): void {

    const name = String(this.route.snapshot.paramMap.get('title'));

    // this.listservice.getRecord(name)
    //   .subscribe(record => this.record = record);

    if(this.record != undefined){
      this.title = String(this.record.title) + ' ('+this.getLength(CrewLitsIT) +' records)';
      var tempList = this.listservice.Titles;
      this.recordList = tempList.sort().map(data => data[0]);

    }

     this.getTypes(CrewLitsIT);

  }

  getTypes(CrewLitsIT: any): void{

    var res = this.listservice.getTypes(CrewLitsIT);
    // console.log(res);
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
    if(this.selectedTable)
      this.selectedTable = !this.selectedTable;

    if(this.tableClicked){
      this.tableClicked = !this.tableClicked;
    }

    this.entity = entity;
    this.rowData = this.getSelectedType(entity);
    this.tableClicked = !this.tableClicked;
  }

  getSelectedType(entity: string): any{

    var source = this.sourceType;

    var temp: any = Object.values(source).map((val) => {
      return val[entity];
    });

    var titles: any =  this.getTitles(temp[0]);

    var titleFormat = titles.map((val: string) => {
        return {'field': val, 'sortable': true, 'filter': true};
    });


    this.columnDefs = titleFormat;
    console.log(titleFormat);

    var res = temp;
    if(temp[0]["value-type"] == 'list')
      res = this.listservice.formatList(temp);
    else
      res = this.listservice.removeDuplicates(res);

    return res;
  }



  displaySelected(title:string): void {
    var id = this.listservice.getIdfromTitle(title);

    var record = this.listservice.getRecordWithId(id);
    var length = Object.keys(record).length;
    this.tablesCount = length;
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    for (const key in record){
      var table = record[key];
      var titles: any =  this.getTitles(table);

      if(table["value-type"] == 'list'){
        table = this.listservice.formatList(table);
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
        var lala = JSON.parse(JSON.stringify(table));
        Object.keys(lala).forEach(k => {
          if(typeof lala[k] == 'object')
            delete lala[k];
        })
        console.log(table)
        this.nonLitsInfo.push(lala);
        this.keysNonList.push(key);
      }

    }

    console.log(this.nonLitsInfo)

    if(this.tableClicked)
      this.tableClicked = !this.tableClicked;

    if(!this.selectedTable)
      this.selectedTable = !this.selectedTable;
  }

  getTitles(temp: any): string[]{
    var titles: string[] = [];
    for (const [key, value] of Object.entries(temp)) {
      if(!isPlainObject(value) && key!='value-type' && key!='lenght')
        titles.push(key);
    }
    return titles;

  }

}


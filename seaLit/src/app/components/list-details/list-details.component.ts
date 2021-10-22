import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject } from 'lodash';

import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.css']
})
export class ListDetailsComponent implements OnInit {

  rowData = [];
  records = new FormControl();
  recordList: string[] = [];
  totalCount : number[] = [];
  record: any;
  recordDataTitles: string[] = [];
  showData: boolean = false;
  tableClicked: boolean = false;
  entityClicked: boolean = false;
  state = "closed";
  title: string = '';
  sourceType: object = {};

  tables: any[] = [];
  tablesTitles: any[] = [];
  tablesCount: number = 0;
  selectedTable: boolean = false;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];
  TableName: string = '';
  keysList: any[] = [];selectedTableName: any;
  gridApi: any;
  recordTitlesWithId: any[] = [];
;

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router
  ) { }

  columnDefs: any[] = [
  ];

  defaultColDef = {
    resizable: true,
  };

  ngOnInit(): void {
    const name = String(this.route.snapshot.paramMap.get('source'));
    this.listservice.getSourceList(name).subscribe(list => this.initList(list));
    this.listservice.getNameOfSource(name).subscribe(list => this.initTitle(list));
    this.listservice.getTitlesofSourceRecords(name).subscribe(list =>this.initRecordDropdown(list));
  }
  initTitle(list: any): void {
    console.log(list)
    this.title = String(list[0].name) + ' ('+list[0].count +' records)';
  }

  initRecordDropdown(list: any) {
    this.listservice.Titles = list.map((elem: any) => elem.title);
    this.listservice.Ids = list.map((elem: any)=> elem.id);
    this.recordTitlesWithId = list;
    this.recordList = this.listservice.Titles.sort();
  }

  initList(list: any): void {
    list.map((elem: any) => {
      this.recordDataTitles.push(elem.name);
      this.totalCount.push(elem.count);
    })
    this.showData = true;
  }


  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
        var source = String(this.route.snapshot.paramMap.get('source'));
        var data = event.data;
        var entity = this.TableName.replace('/','-');
        var name = ''
        Object.keys(data).forEach(k =>{
          if(typeof data[k] == 'string' && k!= 'value-type')
            name =data[k];
        });
        this.listservice.EntityData = data;
        console.log(data)
        var query = '';
        for (const key in data) {
          if(!isObject(data[key]) && key!='value-type' && key!='lenght')
              query += '&'+key+'='+data[key];
        }
        console.log(query);
        this.router.navigate(['list/'+source+'?'+'Table='+entity+query]);
    })
  }

  displaytable(entity:string): void{
    const source = String(this.route.snapshot.paramMap.get('source'));

    if(entity !== this.TableName){
      this.listservice.getTableFromSource(source,entity).subscribe((table:any)=>{
        console.log(table);

        this.TableName = entity;
        this.columnDefs = this.formatTableTitles(table);
        this.rowData = table;
        if(!this.tableClicked)
          this.tableClicked = !this.tableClicked;
      })
    }else{
      this.tableClicked = !this.tableClicked;
    }

  }

  formatTableTitles(table: any[]): any[]{

    var titles: any =  this.getTitles(table[0]);
    var titleFormat = titles.map((val: string) => {
        return {'field': val, 'sortable': true, 'filter': true};
    });

    console.log(titleFormat);
    return titleFormat;
  }

  displaySelectedRecord(title:string): void {
    var record = this.recordTitlesWithId.filter(elem => elem.title === title)
    var id = record[0].id
    const name = String(this.route.snapshot.paramMap.get('source'));
    this.router.navigate(['list/'+name+'/'+id]);
  }

  getTitles(temp: any): string[]{
    var titles: string[] = [];
    for (const [key, value] of Object.entries(temp)) {
      if(!isObject(value) && key!='value-type' && key!='lenght')
        titles.push(key);
    }
    return titles;

  }

}


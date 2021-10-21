import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isPlainObject } from 'lodash';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.css']
})
export class RecordDetailsComponent implements OnInit {
  templateId: string ='';
  Id: string ='';
  templateTitle: string ='';

  rowData = [];
  entityClicked: boolean = false;
  title: string = '';

  tables: any[] = [];
  tablesTitles: any[] = [];
  tablesCount: number = 0;
  selectedTable: boolean = false;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];
  entity: string = '';
  keysList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.displaySelected(id);
  }

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };

  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
        console.log(event)
        var source = String(this.route.snapshot.paramMap.get('source'));
        var data = event.data;
        var entity = this.entity.replace('/','-');
        var name = ''
        Object.keys(data).forEach(k =>{
          if(typeof data[k] == 'string' && k!= 'value-type')
            name =data[k];
        });
        this.listservice.EntityData = data;
        this.router.navigate(['list/'+source+'/'+entity+'/'+name]);
    })
  }

  displaySelected(id:string): void {


    var record = this.listservice.getRecordWithId(id);
    var length = Object.keys(record).length;
    this.tablesCount = length;
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    this.title = this.listservice.getTitlefromId(id);

    var source: any = this.listservice.mapping().filter(temp=> temp.name == String(this.route.snapshot.paramMap.get('source')));
    this.Id = id;
    this.templateId = source[0].id;
    this.templateTitle = source[0].name;

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

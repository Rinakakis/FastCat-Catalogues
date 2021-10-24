import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject, isPlainObject } from 'lodash';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.css']
})
export class RecordDetailsComponent implements OnInit {
  sourceId: string ='';
  Id: string ='';
  sourceName: string ='';

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
    const source = String(this.route.snapshot.paramMap.get('source'));
    const id = String(this.route.snapshot.paramMap.get('id'));
    console.log(source,id);
    this.listservice.getrecordFromSource(source,id).subscribe(record=>{
      console.log(record);
      this.displaydata(record);
    })
  }

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };

  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
        var source = String(this.route.snapshot.paramMap.get('source'));
        var data = event.data;
        var entity = event.colDef.colId;
        var name = ''
        Object.keys(data).forEach(k =>{
          if(typeof data[k] == 'string' && k!= 'value-type')
            name =data[k];
        });
        this.listservice.EntityData = data;
        console.log(event)
        var query = '';
        for (const key in data) {
          if(isObject(data[key]) || key=='value-type' || key =='lenght')
              delete data[key];
        }
        console.log(event);

        // console.log('list/'+source+'/Table?'+'Table='+entity+query);
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['list/'+source+'/Table/'+entity], { queryParams:data });
    })
  }

  displaydata(record: any): void {
    var length = Object.keys(record).length;
    this.tablesCount = length;
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    this.title = record.title;

    this.Id = record.id;
    this.sourceId = record.sourceId;
    this.sourceName = record.sourceName;

    record.data.forEach((element: any) => {
      var data: any[] = Object.values(element);
      data = data[0];
      if(data.length == 1){
        this.keysNonList.push(Object.keys(element).join());
        var lala = JSON.parse(JSON.stringify(data[0]));
        Object.keys(lala).forEach(k => {
          if(typeof lala[k] == 'object' || k =='lenght' || k == 'value-type')
            delete lala[k];
        })
        this.nonLitsInfo.push(lala);
      }else{
        this.keysList.push(Object.keys(element).join());
        var titles = this.getTitles(data[0]);
        var titleFormat = titles.map((val: string) => {
          return {'field': val,'colId':Object.keys(element).join(), 'sortable': true, 'filter': true};
        });
        this.tablesTitles.push(titleFormat);
        this.tables.push(data);
      }
    });

    console.log(this.tables)
    if(!this.selectedTable)
      this.selectedTable = !this.selectedTable;
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

import { Component, OnInit, Query } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isArray, isArrayLike, isObject, isObjectLike, isPlainObject, isString, map } from 'lodash';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {
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
    const params = this.route.snapshot.params;
    const query = this.route.snapshot.queryParams;
    this.listservice.getTablesFromSource(params.source,params.name,query).subscribe(list =>{
      if (list) {
        this.hideloader();
      }
      console.log(list);
      this.displaydata(params,list);
    });
  }

  hideloader() {
    (<HTMLInputElement>document.getElementById('loading')).style.display = 'none';
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

  displaydata(params: any,record: any): void {
    var length = Object.keys(record).length;
    this.tablesCount = length;
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    this.title = params.name;
    this.sourceName = params.source;

    // this.Id = record.id;
    // this.sourceId = record.sourceId;

    for (const key in record) {
      var element = record[key];
      if(isObjectLike(element)){
        if(!isPlainObject(element)){
          // element = this.formatLinks(element)
          this.keysList.push(key);
          console.log(element)
          var titles = this.getTitles(element[0]);
          var titleFormat = titles.map((val: string) => {
            return {'field': val,'colId':key, 'sortable': true, 'filter': true};
          });
          this.tablesTitles.push(titleFormat);
          this.tables.push(element);
        }

      }else{
        if(key !== 'value-type' && key !== 'lenght')
          this.nonLitsInfo.push({'key':key, 'value':element});
      }
    }
    if(!this.selectedTable)
      this.selectedTable = !this.selectedTable;
  }

  formatLinks(element: any) {
    // "https://isl.ics.forth.gr/FastCatTeam/templates/{{sourceId}}.html?name={{Id}}&templateTitle={{sourceName}}&mode=teamView"
    var data: string[] = element.data;
    return data.map(id => {
      return 'https://isl.ics.forth.gr/FastCatTeam/templates/'+element.id+'.html?name='+id+'&templateTitle='+element.name+'&mode=teamView'
    })
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

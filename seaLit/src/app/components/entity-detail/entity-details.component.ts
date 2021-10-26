import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject, isObjectLike } from 'lodash';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {

  sourceName: string ='';
  rowData = [];
  title: string = '';

  tables: any[] = [];
  tablesTitles: any[] = [];
  selectedTable: boolean = false;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];
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
      // console.log(list);
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

        if(event.data.FastCat != undefined){
          window.open(event.data.FastCat, "_blank");
          return;
        }
        var source = String(this.route.snapshot.paramMap.get('source'));
        var data = event.data;
        var entity = event.colDef.colId;
        var name = ''
        Object.keys(data).forEach(k =>{
          if(typeof data[k] == 'string' && k!= 'value-type')
            name =data[k];
        });
        // console.log(event)
        for (const key in data) {
          if(isObject(data[key]) || key=='value-type' || key =='lenght')
              delete data[key];
        }
        // console.log(event);

        // console.log('list/'+source+'/Table?'+'Table='+entity+query);
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['list/'+source+'/Table/'+entity], { queryParams:data });
    })
  }

  displaydata(params: any,record: any): void {
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    this.title = params.name;
    this.sourceName = params.source;

    for (const key in record) {
      var element = record[key];
      if(isObjectLike(element)){
          if(key == 'FastCat')
            element = this.formatLinks(element);
          this.keysList.push(key);
          // console.log(element)
          var titles = this.getTitles(element[0]);
          var titleFormat = titles.map((val: string) => {
            if(val == 'FastCat'){
              return {width: 60, resizable: false, tooltipField: val,
                cellRenderer: function() {
                  return '<i class="material-icons" style="vertical-align: middle">info</i>'
                }
              }
            }else{
                return {'field': val,'colId':key, 'sortable': true, 'filter': true, tooltipField: val }
            }
          });
          this.tablesTitles.push(titleFormat);
          this.tables.push(element);
      }else{
        if(key !== 'value-type' && key !== 'lenght')
          this.nonLitsInfo.push({'key':key, 'value':element});
      }
    }
    if(!this.selectedTable)
      this.selectedTable = !this.selectedTable;
  }

  formatLinks(element: any) {
    var data: string[] = element.data;
    return data.map((map: any) => {
      return {'FastCat':'https://isl.ics.forth.gr/FastCatTeam/templates/'+element.id+'.html?name='+map.id+'&templateTitle='+element.name+'&mode=teamView','title':map.title};
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

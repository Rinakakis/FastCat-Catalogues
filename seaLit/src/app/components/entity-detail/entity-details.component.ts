import { Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject, isObjectLike } from 'lodash';
import { ListService } from 'src/app/services/list.service';
import { saveAs } from 'file-saver';

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

  gridApi: any;
  gridColumnApi: any;
  filename: any;
  fileUrl: any;
  visibleId: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private sanitizer: DomSanitizer
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
        var table = String(this.route.snapshot.paramMap.get('name'));
        var data = event.data;
        var entity = event.colDef.colId;
        console.log(source, table);

        for (const key in data) {
          if(key=='value-type' || key =='listLength' || key == 'display' || (key == 'Embarkation date' && (table=='Crew members'|| table== 'Crew members and Embarkation date')) 
            || (key == 'Discharge date' && (table=='Crew members'|| table== 'Crew members and Discharge date')) || key == 'Ship name' )
              delete data[key];
        }
        // console.log(entity);
        // console.log(data);
        // console.log('list/'+source+'/Table?'+'Table='+entity+query);
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['list/'+source+'/Table/'+entity], { queryParams:data });
    }),
    suppressExcelExport: true
  }

  displaydata(params: any,record: any): void {
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    this.sourceName = params.source;

    if(params.name.charAt(params.name.length - 1) == '2')
      this.title = params.name.slice(0, -1);
    else
      this.title = params.name;


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
        if(key !== 'value-type' && key !== 'listLength' && key!=='display')
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
    // console.log(temp)
    for (const [key] of Object.entries(temp)) {
      if(key!='value-type' && key!='listLength' && key!='listIds' && key!='display')
        titles.push(key);
    }
    return titles;
  }

  onBtnExport(tableg: any){
    // console.log(tableg);
    // console.log(this.listservice.ConvertToCSV(tableg))
    var blob = new Blob([this.listservice.ConvertToCSV(tableg)], {type: 'text/csv;charset=utf-8' });
    saveAs(blob, "export.csv");
  }

  show(id: any){
    if(!this.visibleId.includes(id)){
      this.visibleId.push(id);
      (<HTMLInputElement>document.getElementById(id)).style.animation = 'hide 0.4s linear forwards';
    } else{
      this.visibleId = this.listservice.arrayRemove(this.visibleId, id);
      (<HTMLInputElement>document.getElementById(id)).style.animation = 'show 0.4s linear forwards';
    }
  }
  

}

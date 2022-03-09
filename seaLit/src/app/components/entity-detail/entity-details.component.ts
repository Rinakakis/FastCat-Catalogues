import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent, CellContextMenuEvent } from 'ag-grid-community';
import { isObjectLike } from 'lodash';
import { ListService } from 'src/app/services/list.service';
import { Title } from '@angular/platform-browser';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective | undefined;

  sourceName: string ='';
  rowData = [];
  title: string = '';
  recordTitle: string = '';
  sourceId: string = '';
  Id: string = '';
  tables: any[] = [];
  selectedTable: boolean = false;
  idExists: boolean = false;
  isEmploymentWorkers: boolean = false;
  nonLitsInfo: any[] = [];
  tableTitles: any[] = [];
  visibleId: string[] = [];
  titles: any = [];



  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const params = this.route.snapshot.params;
    const query = this.route.snapshot.queryParams;
    if(params.source == 'Employment records, Shipyards of Messageries Maritimes, La Ciotat' && params.name == 'Workers')
      this.isEmploymentWorkers = true;

    this.listservice.getTablesFromSource(params.source,params.name,query).subscribe(list =>{
      if (list) {
        this.hideloader();
        this.isEmploymentWorkers = false;

      }
      // console.log(list);
      this.displaydata(params,list);
    });
  }

  hideloader() {
    (<HTMLInputElement>document.getElementById('loading')).style.display = 'none';
  }

  sendQuery(event: CellContextMenuEvent | CellClickedEvent){
    if(event.data['FastCat Records'] != undefined){
      window.open(event.data['FastCat Records'], "_blank");
      return;
    }
    var source = String(this.route.snapshot.paramMap.get('source'));
    var table = String(this.route.snapshot.paramMap.get('name'));
    var id = String(this.route.snapshot.paramMap.get('id'));
    var data = event.data;
    var entity = event.colDef.colId;

    for (const key in data) {
      if(key=='value-type' || key =='listLength' || key == 'display' || ((key == 'Embarkation Date' || key == 'Ship\'s Name') && (table=='Crew Members'|| table== 'Crew Members and Embarkation Dates'))
        || ((key == 'Discharge Date' || key == 'Ship\'s Name') && (table=='Crew Members'|| table== 'Crew Members and Discharge Dates'))  )
          delete data[key];
    }
    if(id != 'null'){
      data.recordId = id;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';


    if(event.type == 'cellClicked'){
      if(id!='null')
          this.router.navigate(['sources/'+source+'/'+id+'/table/'+entity], { queryParams:data });
        else
          this.router.navigate(['sources/'+source+'/table/'+entity], { queryParams:data });
    }else{
      var url;
      if(id!='null')
        url = this.router.serializeUrl(this.router.createUrlTree(['seaLit/sources/'+source+'/'+id+'/table/'+entity], { queryParams:data }));
      else
        url = this.router.serializeUrl(this.router.createUrlTree(['seaLit/sources/'+source+'/table/'+entity], { queryParams:data }));
      window.open(url, '_blank');
    }
  }

  displaydata(params: any,record: any): void {
    var id = String(this.route.snapshot.paramMap.get('id'));
    this.sourceName = params.source;

    if(params.name.charAt(params.name.length - 1) == '2')
      this.title = params.name.slice(0, -1);
    else
      this.title = params.name;

    if(id!= 'null'){
      this.recordTitle = record["FastCat Records"].data[0].title;
      this.titleService.setTitle('SeaLit - '+this.sourceName+': '+this.recordTitle+ ': ' + this.title);
      this.Id = record["FastCat Records"].data[0].id;
      this.sourceId = record["FastCat Records"].id;
      this.idExists = !this.idExists;
    }else{
      this.recordTitle = this.title;
      this.titleService.setTitle('SeaLit - '+this.sourceName+': '+ this.title);
    }

    for (const key in record) {
      var element = record[key];
      if(isObjectLike(element)){
        if(key == 'FastCat Records')
        element = this.formatLinks(element);
        this.tableTitles.push(key);
        this.titles.push(this.getTitles(element[0]));
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
      return {'FastCat Records':'https://isl.ics.forth.gr/FastCatTeam/templates/'+element.id+'.html?name='+map.id+'&templateTitle='+element.name+'&mode=teamView','title':map.title};
    })
  }

  getTitles(temp: any): string[]{
    var titles: string[] = [];
    for (const [key] of Object.entries(temp)) {
      if(key!='value-type' && key!='listLength' && key!='listIds' && key!='display')
        titles.push(key);
    }
    return titles;
  }

  show(id: any){
    // id = 'grid'+id;
    if(!this.visibleId.includes(id)){
      this.visibleId.push(id);
      (<HTMLInputElement>document.getElementById('grid'+id)).style.animation = 'hide 0.4s linear forwards';
      // (<HTMLInputElement>document.getElementById('chart'+id)).style.animation = 'hide 0.4s linear forwards';
    } else{
      this.visibleId = this.listservice.arrayRemove(this.visibleId, id);
      (<HTMLInputElement>document.getElementById('grid'+id)).style.animation = 'show 0.4s linear forwards';
      // (<HTMLInputElement>document.getElementById('chart'+id)).style.animation = 'show 0.4s linear forwards';
    }
  }

}

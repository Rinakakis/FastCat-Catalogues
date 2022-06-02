import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BeanStub, CellClickedEvent, CellContextMenuEvent } from 'ag-grid-community';
import { isObject } from 'lodash';
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
  recordList: string[] = [];
  totalCount : number[] = [];
  columnTitles : number[] = [];
  tableDataTitles: string[] = [];
  showData: boolean = false;
  tableClicked: boolean = false;
  chartOption: boolean = false;

  state = "closed";
  title: string = '';
  error: boolean = false;
  tables: any[] = [];
  tablesTitles: any[] = [];
  tablesCount: number = 0;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];
  tableName: string = '';
  errorMessage: string = '';
  keysList: any[] = [];
  recordTitlesWithId: any[] = [];


  recordDataTitles: any = [];
  recordData: any = [];
  titles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const source = String(this.route.snapshot.paramMap.get('source'));
    const id = String(this.route.snapshot.paramMap.get('id'));
    // console.log(source,id);
    this.listservice.getrecordFromSource(source,id).subscribe(record=>{
      if (record) {
        this.hideloader('loading');
      }
      this.recordData = record.data;
      this.initList(record);

    })
  }

  initList(record: any): void {
    this.title = record.title;

    this.Id = record.id;
    this.sourceId = record.sourceId;
    this.sourceName = record.sourceName;

    this.titleService.setTitle('SeaLit - '+this.sourceName+': '+ this.title);
    // console.log(record)

    record.data.forEach((elem: any) => {
      if(elem != null){
        var tableTitle = Object.keys(elem).join();
        this.recordDataTitles.push(tableTitle);
        this.totalCount.push(elem[tableTitle].length);
      }
    })
    this.showData = true;
    // console.log(this.recordDataTitles)
    // console.log(this.totalCount)
  }


  sendQuery(event: CellContextMenuEvent | CellClickedEvent){
    var source = String(this.route.snapshot.paramMap.get('source'));
    var id = String(this.route.snapshot.paramMap.get('id'));
    var data = event.data;
    var entity = this.tableName.replace('/','-');
    // var name = ''
    // Object.keys(data).forEach(k =>{
    //   if(typeof data[k] == 'string' && k!= 'value-type')
    //     name =data[k];
    // });
    // console.log(event)
    for (const key in data) {
      if(isObject(data[key]) || key=='value-type' || key =='listLength')
          delete data[key];
    }
    data.recordId = id;

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';

    if(event.type == 'cellClicked'){
      this.router.navigate(['sources/'+source+'/'+id+'/table/'+entity], { queryParams:data });
    }else{
      var baseUrl = window.location.pathname.split('/')[1];
      if(baseUrl == 'sources') baseUrl = '';
      const url = this.router.serializeUrl(this.router.createUrlTree([baseUrl+'/sources/'+source+'/'+id+'/table/'+entity], { queryParams:data }));
      window.open(url, '_blank');
    }
  }


  displaytable(tableName: any): void {

    if(tableName !== this.tableName){
      var table: any = [];
      // this.tableClicked = !this.tableClicked;
      this.tableName = tableName;

      this.recordData.forEach((element: any) =>{
        if(element!= null)
          if(Object.keys(element).join() == tableName)
            table = Object.values(element)[0];
      })

      this.rowData = table;
      this.titles = this.getTitles(table[0]);

      if(!this.tableClicked){
        this.tableClicked = !this.tableClicked;
      }
    }else{
      this.tableClicked = !this.tableClicked;
    }
  }

  showloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'flex';
  }
  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }

  getTitles(temp: any): string[]{
    // console.log(temp)
    var titles: string[] = [];
    for (const [key, value] of Object.entries(temp)) {
      if(!isObject(value) && key!='value-type' && key!='listLength' && key!='listIds' && key!='display')
        titles.push(key);
    }
    return titles;

  }

}


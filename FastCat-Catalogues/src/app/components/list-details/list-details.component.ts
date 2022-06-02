import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CellClickedEvent, CellContextMenuEvent } from 'ag-grid-community';
import { isObject } from 'lodash';
import { Title } from '@angular/platform-browser';
import { ListService } from 'src/app/services/list.service';


@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.css']
})
export class ListDetailsComponent implements OnInit {

  rowData: any[] = [];
  records = new FormControl();
  recordList: string[] = [];
  totalCount : number[] = [];
  tableDataTitles: string[] = [];
  showData: boolean = false;
  tableClicked: boolean = false;
  chartOption: boolean = false;
  title: string = '';
  error: boolean = false;
  tableName: string = '';
  errorMessage: string = '';
  recordTitlesWithId: any[] = [];
  titles: string[] = [];


  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private titleService: Title,
  ) { }


  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const name = String(this.route.snapshot.paramMap.get('source'));
    this.listservice.getSourceList(name).subscribe(list => {
      if (list) {
        this.hideloader('loading');
      }
      // console.log(list)
      this.initList(list);
    },
      err => {
        if (err.status == 404) {
          this.hideloader('loading');
          this.error = true;
          this.title = err.error;
          this.errorMessage = 'The requested page: "/' + String(this.route.snapshot.params.source) + '" could not be found.';
        }
      });

    this.listservice.getNameOfSource(name).subscribe(list => this.initTitle(list));
    this.listservice.getTitlesofSourceRecords(name).subscribe(list => this.initRecordDropdown(list));
  }

  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }

  initTitle(list: any): void {
    this.title = String(list[0].name) + ' ('+list[0].count +' records)';
    this.titleService.setTitle('SeaLit - '+ this.title);
  }

  initRecordDropdown(list: any) {
    this.listservice.Titles = list.map((elem: any) => elem.title);
    this.recordTitlesWithId = list;
    this.recordList = this.listservice.Titles.sort();

  }

  initList(list: any): void {
    list.map((elem: any) => {
      this.tableDataTitles.push(elem.name);
      this.totalCount.push(elem.count);
    })
    this.showData = true;
  }

  sendQuery(event: CellContextMenuEvent | CellClickedEvent){
    var source = String(this.route.snapshot.paramMap.get('source'));
    var data = event.data;
    var entity = this.tableName.replace('/','-');

    for (const key in data) {
      if(isObject(data[key]) || key=='value-type' || key =='listLength')
          delete data[key];
    }

    if(event.type == 'cellClicked'){
      this.router.navigate(['sources/'+source+'/table/'+entity], { queryParams:data });
    }else{
      const url = this.router.serializeUrl(this.router.createUrlTree(['FastCat-Catalogues/sources/'+source+'/table/'+entity], { queryParams:data }));
        window.open(url, '_blank');
    }
  }

  displaytable(tableName:string): void{
    const source = String(this.route.snapshot.paramMap.get('source'));
    if(this.chartOption){
      this.chartOption = !this.chartOption;
    }
    if(tableName !== this.tableName){
      this.showloader('loading-div');
      this.listservice.getTableFromSource(source,tableName).subscribe((table:any)=>{
        // new code
        this.tableName = tableName;
        this.titles = this.getTitles(table[0]);
        this.rowData = table;
        this.hideloader('loading-div');

        if(!this.tableClicked){
          this.tableClicked = !this.tableClicked;
        }
      })
    }else{
      this.tableClicked = !this.tableClicked;
    }
  }

  showloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'flex';
  }

  getTitles(temp: any): string[]{
    var titles: string[] = [];
    for (const [key, value] of Object.entries(temp)) {
      if(!isObject(value) && key!='value-type' && key!='listLength' && key!='listIds')
        titles.push(key);
    }
    return titles;
  }

  displaySelectedRecord(title:string): void {
    var record = this.recordTitlesWithId.filter(elem => elem.title === title);
    var id = record[0].id;
    const name = String(this.route.snapshot.paramMap.get('source'));
    this.router.navigate(['sources/'+name+'/'+id]);
  }

}

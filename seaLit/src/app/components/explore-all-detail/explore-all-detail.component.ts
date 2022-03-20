import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isEqual } from 'lodash';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-explore-all-detail',
  templateUrl: './explore-all-detail.component.html',
  styleUrls: ['./explore-all-detail.component.css']
})
export class ExploreAllDetailComponent implements OnInit {
  list: any[] = [];
  rawlist: any;
  mapList: any[] = [];
  titles: any[] = [];
  clickedTableData:any[] = [];
  clickedTableTitles:any[] = [];
  clickedRow: any = {};
  loaded: boolean = false;
  rowClicked: boolean = false;
  clickedTable: string = '';
  clickedRowkeys: string[] = [];
  clickedRowId: number | null = null;
  count: number = 0;
  error: boolean = false;
  errorMessage: string = '';

   mapp: any = {
    "Civil Register": {
      "Persons": {
         "Surname": "Surname A"
      },
      "Related Persons": {
         "Surname": "Surname A"
      }
    },
    "General Spanish Crew List":{
      "Crew Members": {
         "Surname": "Surname A"
      }
    },
    "Crew and displacement list (Roll)": {
      "Ship Owners (Persons)": {
         "Surname": "Surname A"
      },
      "Crew Members": {
         "Surname": "Surname A"
      }
    },
    "Register of Maritime personel":{
      "Persons": {
         "Surname": "Surname A"
      }
    },
    "Naval Ship Register List":{
      "Owners (Persons)":{
         "Surname": "Surname A"
      }
    }
  }

  constructor(
    private listservice: ListService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void{
    const table = String(this.route.snapshot.paramMap.get('name'));
    this.clickedTable = table;

    this.listservice.getExploreAll(table).subscribe(list =>{
      if (list) {
        this.hideloader('loading');
      }
      // console.log(list);
      this.handleData(list);
      this.titleService.setTitle(`SeaLit - ${this.clickedTable} (${this.count})`);
      this.loaded = !this.loaded;
    },
    err => {
      if (err.status == 404) {
        console.log(err)
        this.hideloader('loading');
        this.errorMessage = 'The requested page: "/' + String(this.route.snapshot.params.name) + '" could not be found.';
        this.clickedTable = err.error;
        this.error = true;
      }
    });
  }

  handleData(list: any) {
    this.count = list.data.length;
    this.titles = list.titles;
    this.list = list.data;
    this.mapList = list.arrayWithSources;
  }

  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }

  handleClickedRow(event: CellClickedEvent){
    this.clickedTableTitles = [];
    this.clickedTableData = [];
    this.clickedRow = event.data;
    this.clickedRowkeys = Object.keys(this.clickedRow);

    var row = this.mapList[Number(event.node.id)];
    this.clickedTableData.push(...row);
    this.clickedTableTitles = ['source', 'table'];

    if(event.rowIndex == this.clickedRowId){
      this.rowClicked = false;
      this.clickedRowId = null;
    }
    else{
      this.rowClicked = true;
      this.clickedRowId = event.rowIndex;
    }

  }

  clickedRowEvent(row: any){
    if(this.mapp[row.source] != undefined && this.mapp[row.source][row.table] != undefined){

      for (const key of Object.keys(this.clickedRow)) {
        var newKey = this.mapp[row.source][row.table][key];
        if(newKey != undefined){
          this.clickedRow[newKey] = this.clickedRow[key];
          delete this.clickedRow[key];
        }
      }
    }
    // console.log(row)
    this.router.navigate(['sources/'+row.source+'/table/'+row.table], { queryParams:this.clickedRow });
  }

  containsObject(arr: any[], obj: any){
    for (const row of arr) {
      if(isEqual(row,obj))
        return true;
    }
    return false;
  }


}

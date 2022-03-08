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
  titles: any[] = [];
  clickedTableData:any[] = [];
  clickedTableTitles:any[] = [];
  clickedRow: any = {};
  loaded: boolean = false;
  rowClicked: boolean = false;
  clickedTable: string = '';
  clickedRowkeys: string[] = [];
  clickedRowId: number | null = null;

  constructor(
    private listservice: ListService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('SeaLit - Explore archival entities of Maritime History');
    this.getList();
  }

  getList(): void{
    const table = String(this.route.snapshot.paramMap.get('name'));
    this.clickedTable = table;

    this.listservice.getExploreAll(table)
      .subscribe(list =>{
        if (list) {
          this.hideloader('loading');
        }
        console.log(list);
        if(list.sub != undefined){
          this.handleSub(list.sub);
        }else{
          // this.handleMaster(list.master);
        }

        // console.log(this.list);
        this.loaded = !this.loaded;
        // this.isDataLoaded = !this.isDataLoaded;
      });
  }

  handleMaster(list: any) {
    for (const key in list) {
        const element = list[key];
        this.handleSub(element);
    }
  }

  handleSub(list: any) {
    this.rawlist = list;

    for (const source of Object.keys(list)) {
      var sourceArrayName = Object.keys(list[source]).join();
      var sourceArray = list[source][sourceArrayName];
      if(sourceArray.length != 0){
        Object.keys(sourceArray[0]).forEach(title=>{
          if(this.titles.indexOf(title) === -1)
            this.titles.push(title);
        })
      }
      // console.log(sourceArray);
      sourceArray.forEach((newRow: any) =>{
        if(this.list.length != 0){
          if(!this.containsObject(this.list, newRow))
            this.list.push(newRow);
        }else{
          this.list.push(newRow);
        }
      })
      // this.list.push(...sourceArray);
    }
  }

  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }

  handleClickedRow(event: CellClickedEvent){
    console.log(event)
    this.clickedTableTitles = [];
    this.clickedTableData = [];
    this.clickedRow = event.data;
    var keysOfRow = Object.keys(this.clickedRow);
    this.clickedRowkeys = keysOfRow;

    for (const source of Object.keys(this.rawlist)) {
      var sourceArrayName = Object.keys(this.rawlist[source]).join();
      var sourceArray = this.rawlist[source][sourceArrayName];

      var sourceArrayKeys = Object.keys(sourceArray[0]);
      // console.log(sourceArrayKeys)
      if(isEqual(sourceArrayKeys.sort(), keysOfRow.sort())){

        let lookup = sourceArray.find((row:any) => {
            return isEqual(this.clickedRow,row);
        });
        if(lookup != undefined){
          this.clickedTableData.push({'sources': source, 'table': sourceArrayName});
        }
      }
    }
    this.clickedTableTitles = ['sources', 'table'];

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
    console.log(row)
    console.log(this.clickedRow)
    this.router.navigate(['sources/'+row.sources+'/table/'+row.table], { queryParams:this.clickedRow });

  }

  containsObject(arr: any[], obj: any){

    for (const row of arr) {
      if(isEqual(row,obj))
        return true;
    }
    return false;
  }


}

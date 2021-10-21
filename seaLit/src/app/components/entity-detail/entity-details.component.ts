import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isPlainObject } from 'lodash';
import { ListService } from 'src/app/services/list.service';
@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {

  title: string = '';
  entity: string = '';
  noTableData: any[] = [];
  tableArray: any[] = [];
  tablesTitles: any[] = [];
  displayTable: boolean = false;
  keysList: any[] = [];

  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
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

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };
  constructor(
    private listservice : ListService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const name = String(this.route.snapshot.paramMap.get('entity'));
    this.initData(name, this.listservice.EntityData);
  }

  initData(name:string, data: any) {
    console.log(name);
    console.log(this.listservice.EntityData);
    this.initTitle(name);
    this.initNotableData(data);
    this.initTableData(data);
  }

  initNotableData(data: any) {
    Object.keys(data).forEach(k =>{
      if(typeof data[k] == 'string' && k != 'value-type')
        this.noTableData.push({'key':k,'name':data[k]});
    })
    console.log(this.noTableData)
  }

  initTableData(data: any) {
    this.tablesTitles = [];
    this.tableArray = [];
    this.keysList = [];
    var temp: any[] = [];

    Object.keys(data).forEach(k =>{
      if(typeof data[k] == 'object')
        temp.push({'key':k,'name':data[k]});
    })
    console.log(temp)
    temp.forEach(table => {
      var lala = table.name.map((elem: any) => {
        var link = elem['link'];
        var id = elem['Id'];
        this.keysList.push(link);
        return this.listservice.getTableFromRecordWithId(id,link);
      })

      if(lala[0]["value-type"] == 'list')
        lala = this.listservice.formatList(lala);
      else
        lala = this.listservice.removeDuplicates(lala);

        var titles = this.getTitles(lala[0]);
        var titleFormat = titles.map((val: string) => {
          return {'field': val, 'sortable': true, 'filter': true};
        });
        this.tablesTitles.push(titleFormat);
        this.tableArray.push(lala);
    })
    console.log(this.tableArray);
    this.keysList = [...new Set(this.keysList)];
    console.log(this.keysList);
    this.displayTable = !this.displayTable;
  }

  initTitle(name: string) {
    this.title = name;
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

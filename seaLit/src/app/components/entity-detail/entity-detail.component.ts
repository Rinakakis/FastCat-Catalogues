import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlainObject } from 'lodash';
import { ListService } from 'src/app/services/list.service';
@Component({
  selector: 'app-entity-detail',
  templateUrl: './entity-detail.component.html',
  styleUrls: ['./entity-detail.component.css']
})
export class EntityDetailComponent implements OnInit {

  title: string = '';
  entity: string = '';
  noTableData: any[] = [];
  tableArray: any[] = [];
  tablesTitles: any[] = [];
  displayTable: boolean = false;
  keysList: any[] = [];

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };
  constructor(
    private listservice : ListService,
    private route: ActivatedRoute
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

import { Component, OnInit } from '@angular/core';

import { List } from '../../Lits'
import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { indexOf } from 'lodash';
import { crewIT } from 'src/app/dummy-crew-lis-IT';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {

  columnDefs = [  
  ];

  rowData = [];
  records = new FormControl();
  recordList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  totalCount : number[] = [];
  record: List | undefined;
  recordDataTitles!: string[];
  showData: boolean = false;
  tableClicked: boolean = false;
  entityClicked: boolean = false;
  title!: string;
  sourceType: object = {}; 

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService
  ) { }

  ngOnInit(): void {

    this.listservice.getEverything().then((CrewLitsIT : object)=>{
      this.sourceType = CrewLitsIT;
      this.getRecord(CrewLitsIT);
    });
  
  }

  getRecord(CrewLitsIT: object): void {
    
    const name = String(this.route.snapshot.paramMap.get('title'));
    
    this.listservice.getRecord(name)
      .subscribe(record => this.record = record);

    // console.log(this.record);

    if(this.record != undefined){
      this.title = String(this.record.title) + ' ('+this.getLength(CrewLitsIT) +' records)';
      this.recordList = Object.keys(CrewLitsIT).map((ids) => ids);

    }
      
     this.getTypes(CrewLitsIT);

    // this.recordList = 
    // this.listservise.getRecordData(this.title)
    //   .subscribe((Rdata) => {
    //     // this.recordData = Rdata;
    //     this.recordDataTitles =  Object.keys(Rdata[0].data);
    //     this.showData = true;
    //   });
  }

  getTypes(CrewLitsIT: any): void {
    var titles: any[] = [];
    var count : number[] = [];
    var temp = CrewLitsIT[Object.keys(CrewLitsIT)[0]];
    
    titles = Object.keys(temp);
    count = Array(titles.length).fill(0);
    
    for (const key in CrewLitsIT) {
        const element = CrewLitsIT[key];
        for (const record in element) {
          const entity = element[record];
          
            var index: number = titles.indexOf(record);
            if (entity['value-type'] != undefined){
              count[index] = count[index] + entity['lenght'];
            }else{ 
              count[index] = count[index] + 1;
            }
        }
        // break;
    }
    this.totalCount = count;
    this.recordDataTitles = titles
    this.showData = true;
  }
  
  getLength(element: any): number{
    return Object.values(element).length;
  }

  isEmpty(obj: Object) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  } 

  table(entity:string): void{
    if(this.tableClicked)
      this.tableClicked = !this.tableClicked; 
    console.log(entity);
    this.getSelectedType(entity);
  }

  getSelectedType(entity: string): object{
    
    var source = this.sourceType;
    
    var temp: any = Object.values(source).map((val) => {
      // console.log(val[entity])
      return val[entity];
    });

    var titles: any =  Object.keys(temp[0]);
    var titleFormat = titles.map((val: string) => {
        return {'field': val, 'sortable': true, 'filter': true};
    });

    this.columnDefs = titleFormat;
    console.log(titleFormat);

    console.log(temp);
    this.rowData = temp;
    this.tableClicked = !this.tableClicked; 
    return {};
  }

  displaySelected(id:string): void {
    var record = this.getRecordWithId(id);
    console.log(record);
    
  }

  getRecordWithId(id: string): object{
    var source: any = this.sourceType;
    return source[id];
  }
}


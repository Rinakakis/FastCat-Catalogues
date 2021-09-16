import { Component, OnInit } from '@angular/core';

import { List } from '../../Lits'
import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { indexOf } from 'lodash';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {

  records = new FormControl();
  recordList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  totalCount : number[] = [];
  record: List | undefined;
  recordDataTitles!: string[];
  showData: boolean = false;
  title!: string;
  
  constructor(
    private route: ActivatedRoute,
    private listservise : ListService
  ) { }

  ngOnInit(): void {
    this.getRecord();
  }

  getRecord(): void {
    var CrewLitsIT = this.listservise.getCreListIT2();

    const name = String(this.route.snapshot.paramMap.get('title'));
    
    this.listservise.getRecord(name)
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
        // console.log(element);
        for (const record in element) {
            console.log(key)
            const lala = element[record];
            var index: number = titles.indexOf(record);
            if (typeof lala[Object.keys(lala)[0]] == 'object'){
              console.log(record +'->');
              console.log(lala);
              var temp2 = Object(lala[Object.keys(lala)[0]]);
              for (const i in temp2) {
                if(!this.isEmpty(temp2[i]))
                count[index] = count[index] + 1;
              }
            }else{ 
              count[index] = count[index] + 1;
            }
        }
        // break;
    }
    console.log(count);
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

table(event:any){
  console.log(event);
}

}


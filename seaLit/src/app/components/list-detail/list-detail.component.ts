import { Component, OnInit } from '@angular/core';

import { List } from '../../Lits'
import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {

  records = new FormControl();
  recordList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

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
    const name = String(this.route.snapshot.paramMap.get('title'));
    
    this.listservise.getRecord(name)
      .subscribe(record => this.record = record);

    console.log(this.record);

    if(this.record != undefined)
      this.title = String(this.record.title);

    this.listservise.getRecordData(this.title)
      .subscribe((Rdata) => {
        // this.recordData = Rdata;
        this.recordDataTitles =  Object.keys(Rdata[0].data);
        this.showData = true;
      });
  }

}

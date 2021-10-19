import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  list: any;
  id = -1;

  constructor(
    private listservice: ListService,
    ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void{
    this.listservice.getList()
      .subscribe(list => this.list = list);
  }

  showInfo(id: number) :void{
    if(id == this.id)
      this.id = -1
    else
      this.id = id;
  }
}

import { Component, OnInit } from '@angular/core';
import { List } from '../../Lits'
import { ListService } from 'src/app/services/list.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  list: List[] = [];
  id = -1;

  constructor(
    private listservice: ListService,
    private http: HttpClient
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

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() arrayData: any[] = [];
  @Input() titles: any[] = [];


  constructor() { }

  ngOnInit(): void {
    console.log(this.titles)
    console.log(this.arrayData)
  }

}

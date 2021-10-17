import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private listservice : ListService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const name = String(this.route.snapshot.paramMap.get('entity'));
    console.log(name);
    console.log(this.listservice.EntityData);

    this.makeTitle(name,this.listservice.EntityData);
    this.initNotableData(this.listservice.EntityData);
  }
  initNotableData(data: any) {
    Object.keys(data).forEach(k =>{
      if(typeof data[k] == 'string' && k != 'value-type')
        this.noTableData.push({'key':k,'name':data[k]});
    })
  }

  makeTitle(name: string, EntityData: any) {
    this.title = name;
  }

}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-explore-all-detail',
  templateUrl: './explore-all-detail.component.html',
  styleUrls: ['./explore-all-detail.component.css']
})
export class ExploreAllDetailComponent implements OnInit {
  list: any[] = [];
  titles: any[] = [];
  loaded: boolean = false;

  constructor(
    private listservice: ListService,
    private titleService: Title,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('SeaLit - Explore archival entities of Maritime History');
    this.getList();
  }

  getList(): void{
    const table = String(this.route.snapshot.paramMap.get('name'));
    console.log(table)
    this.listservice.getExploreAll(table)
      .subscribe(list =>{
        if (list) {
          // this.hideloader();
        }
        const target: any = {};
        // console.log(list);

        for (const source of Object.keys(list)) {
          var sourceArray = list[source];
          if(sourceArray.length != 0){
            Object.keys(sourceArray[0]).forEach(title=>{
              this.titles.push(title);
            })
            // console.log(sourceArray);
          }
          this.list.push(...sourceArray);
        }
        this.loaded = !this.loaded;
        // this.isDataLoaded = !this.isDataLoaded;
      });
  }
}

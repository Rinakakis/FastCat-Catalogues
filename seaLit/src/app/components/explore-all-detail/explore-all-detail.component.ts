import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-explore-all-detail',
  templateUrl: './explore-all-detail.component.html',
  styleUrls: ['./explore-all-detail.component.css']
})
export class ExploreAllDetailComponent implements OnInit {
  list: any[] = [];
  titles: any[] = [];
  loaded: boolean = false;
  clickedTable: string = '';

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
    this.clickedTable = table;

    this.listservice.getExploreAll(table)
      .subscribe(list =>{
        if (list) {
          this.hideloader('loading');
        }
        const target: any = {};
        // console.log(list);

        for (const source of Object.keys(list)) {
          var sourceArray = list[source];
          if(sourceArray.length != 0){
            Object.keys(sourceArray[0]).forEach(title=>{
              if(this.titles.indexOf(title) === -1)
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

  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }
}

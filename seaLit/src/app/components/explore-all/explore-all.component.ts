import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-explore-all',
  templateUrl: './explore-all.component.html',
  styleUrls: ['./explore-all.component.css']
})
export class ExploreAllComponent implements OnInit {

  list: any;
  id = -1;
  isDataLoaded: boolean = false;

  constructor(
    private listservice: ListService,
    private titleService: Title
    ) { }

  ngOnInit(): void {
    this.titleService.setTitle('SeaLit - Explore archival entities of Maritime History');
    this.getList();
  }


  getList(): void{
    this.listservice.getExploreAll('all')
      .subscribe(list =>{
        if (list) {
          this.hideloader();
        }
        const target: any = {};
        // console.log(list);
        // list.forEach((obj: { category: string }) => target[obj.category] = []);

        // list.forEach((obj: { category: string }) => target[obj.category].push(obj));

        this.list = list;
        this.isDataLoaded = !this.isDataLoaded;
      });
  }

  hideloader() {
    (<HTMLInputElement>document.getElementById('loading')).style.display = 'none';
  }

  showInfo(id: number) :void{
    if(id == this.id)
      this.id = -1
    else
      this.id = id;
  }

  getCategories(list: any): string[]{
    if(list!= undefined || list != null){
      let arr=  Object.keys(list);
      arr.push(arr.splice(arr.indexOf('Other Records'), 1)[0]);
      return arr;
    }
    return [];
  }
}

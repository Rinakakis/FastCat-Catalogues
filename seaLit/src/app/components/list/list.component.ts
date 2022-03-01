import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  list: any;
  id = -1;
  isDataLoaded: boolean = false;

  constructor(
    private listservice: ListService,
    private titleService: Title
    ) { }

  ngOnInit(): void {
    this.titleService.setTitle('SeaLit - Explore archival sources of Maritime History');
    this.getList();
  }


  getList(): void{
    this.listservice.getNamesOfSources()
      .subscribe(list =>{
        if (list) {
          this.hideloader();
        }
        const target: any = {};
        list.forEach((obj: { category: string }) => target[obj.category] = []);

        list.forEach((obj: { category: string }) => target[obj.category].push(obj));

        // console.log(target);
        this.list = target;
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
      let arr = Object.keys(list);
      return arr;
    }
    return [];
  }
}

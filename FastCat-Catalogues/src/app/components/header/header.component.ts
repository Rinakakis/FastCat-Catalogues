import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ResolveEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loaded: boolean = false;
  links: string[] = ['Explore by source', 'Explore all'];
  selected: string = this.links[0];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {


   }

  ngOnInit(): void {

    // this.router.events.subscribe(routerData => {
    //   if (routerData instanceof NavigationEnd) {
    //     var start = routerData.url.split('/')[1];
    //     console.log(start)
    //     if (start == 'sources')
    //       this.selected = this.links[0];
    //     else
    //       this.selected = this.links[1];
    //   }
    //   this.loaded = true;
    // })
  }

  home() {
    this.router.navigate(['/sources']);
  }

  clickEvent(item: string) {
    this.selected = item;
  }


}

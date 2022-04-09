import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isEqual } from 'lodash';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-explore-all-detail',
  templateUrl: './explore-all-detail.component.html',
  styleUrls: ['./explore-all-detail.component.css']
})
export class ExploreAllDetailComponent implements OnInit {
  list: any[] = [];
  rawlist: any;
  mapList: any[] = [];
  titles: any[] = [];
  clickedTableData:any[] = [];
  clickedTableTitles:any[] = [];
  clickedRow: any = {};
  loaded: boolean = false;
  rowClicked: boolean = false;
  clickedTable: string = '';
  clickedRowkeys: string[] = [];
  clickedRowId: number | null = null;
  count: number = 0;
  error: boolean = false;
  errorMessage: string = '';

  mapp: any = {
    "Civil Register": {
      "Persons": {
        "Surname": "Surname A"
      },
      "Related Persons": {
        "Surname": "Surname A"
      },
      "Death Locations": {
        "Name": "Death Location"
      }
    },
    "General Spanish Crew List": {
      "Crew Members": {
        "Surname": "Surname A"
      },
      "Embarkation Ports": {
        "Name": "Port"
      },
      "Ships": {
        "Registry Location": "Port of Registry"
      }
    },
    "Crew and displacement list (Roll)": {
      "Ship Owners (Persons)": {
        "Surname": "Surname A"
      },
      "Crew Members": {
        "Surname": "Surname A"
      },
      "Destination Ports": {
        "Name": "Port"
      },
      "Embarkation Ports": {
        "Name": "Port"
      },
      "Ship Construction Locations": {
        "Name": "Construction Location"
      },
      "Discharge Ports": {
        "Name": "Port"
      }
    },
    "Register of Maritime personel": {
      "Persons": {
        "Surname": "Surname A"
      }
    },
    "Naval Ship Register List": {
      "Owners (Persons)": {
        "Surname": "Surname A"
      },
      "Construction Places": {
        "Name": "Construction Location"
      },
      "Ships": {
        "Gross Tonnage (in kg)": "Tonnage"
      }
    },
    "List of ships": {
      "Engine Manufacturers": {
        "Name": "Engine Manufacturer"
      },
      "Registry Ports": {
        "Name": "Port"
      },
      "Ship Construction Places": {
        "Name": "Construction Location"
      },
      "Engine Construction Places": {
        "Name": "Place of Engine Construction"
      },
      "Ships": {
        "Registry Location": "Port of Registry",
        "Tonnage": "Tonnage (Value)"
      }
    },
    "Accounts book": {
      "Departure Ports": {
        "Name": "Port"
      },
      "Destination Ports": {
        "Name": "Port"
      },
      "Ports of Call": {
        "Name": "Port"
      }
    },
    "Crew List (Ruoli di Equipaggio)": {
      "Departure Ports": {
        "Name": "Port"
      },
      "Embarkation Ports": {
        "Name": "Port"
      },
      "Ship Registry Ports": {
        "Name": "Port"
      },
      "Ship Construction Locations": {
        "Name": "Construction Location"
      },
      "Discharge Ports": {
        "Name": "Port"
      },
      "Ships": {
        "Registry Location": "Port of Registry"
      }
    },
    "Logbook": {
      "Registry Ports": {
        "Name": "Port"
      }
    },
    "Inscription Maritime - Maritime Register of the State for La Ciotat": {
      "Birth Places": {
        "Place of Birth": "Name"
      },
      "Residence Locations": {
        "Location of Residence": "Name"
      }
    },
    "Employment records, Shipyards of Messageries Maritimes, La Ciotat": {
      "Birth Places": {
        "Place of Birth": "Name"
      },
      "Residence Locations": {
        "Location of Residence": "Name"
      }
    },
    "Census La Ciotat": {
      "Birth Places": {
        "Name": "Place of Birth"
      },
      "Organisations (Works at)": {
        "Name": "Organisation"
      }
    },
    "First national all-Russian census of the Russian Empire": {
      "Birth Places (Governorates)": {
        "Name": "Governorate"
      },
      "Register of Maritime personel": {
        "Residence Locations": {
          "Name": "Location of Residence"
        }
      },
      "Register of Maritime workers (Matricole della gente di mare)": {
        "Residence Locations": {
          "Name": "Location of Residence"
        }
      }
    },
    "Students Register": {
      "Student Employment Companies": {
        "Name": "Employment Company"
      }
    },
    "Payroll of Russian Steam Navigation and Trading Company": {
      "Ship owners (Companies)": {
        "Name": "Owner (Company)"
      }
    }
  }

  constructor(
    private listservice: ListService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.getList();
  }

  getList(): void{
    const table = String(this.route.snapshot.paramMap.get('name'));
    this.clickedTable = table;

    this.listservice.getExploreAll(table).subscribe(list =>{
      if (list) {
        this.hideloader('loading');
      }
      console.log(list)
      this.handleData(list);
      this.titleService.setTitle(`SeaLit - ${this.clickedTable} (${this.count})`);
      this.loaded = !this.loaded;
    },
    err => {
      if (err.status == 404) {
        // console.log(err)
        this.hideloader('loading');
        this.errorMessage = 'The requested page: "/' + String(this.route.snapshot.params.name) + '" could not be found.';
        this.clickedTable = err.error;
        this.error = true;
      }
    });
  }

  handleData(list: any) {
    this.count = list.data.length;
    this.titles = list.titles;
    this.list = list.data;
    this.mapList = list.arrayWithSources;
  }

  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }

  handleClickedRow(event: CellClickedEvent){
    this.clickedTableTitles = [];
    this.clickedTableData = [];
    this.clickedRow = event.data;
    this.clickedRowkeys = Object.keys(this.clickedRow);

    var row = this.mapList[Number(event.node.id)];
    this.clickedTableData.push(...row);
    this.clickedTableTitles = ['source', 'table'];

    if(event.rowIndex == this.clickedRowId){
      this.rowClicked = false;
      this.clickedRowId = null;
    }
    else{
      this.rowClicked = true;
      this.clickedRowId = event.rowIndex;
    }

  }

  clickedRowEvent(row: any){
    this.router.navigate(['sources/'+row.source+'/table/'+row.table], { queryParams: this.makeMapping(row) });
  }

  RightclickedRowEvent(row: any){
    const url = this.router.serializeUrl(this.router.createUrlTree(['seaLit/sources/'+row.source+'/table/'+row.table], { queryParams:this.makeMapping(row)}));
    window.open(url, '_blank');
  }

  makeMapping(row: any){
    var newClickedRow: any = {};
    if(this.mapp[row.source] != undefined && this.mapp[row.source][row.table] != undefined){
      for (const key of Object.keys(this.clickedRow)) {
        var newKey = this.mapp[row.source][row.table][key];
        if(newKey != undefined){
          newClickedRow[newKey] = this.clickedRow[key];
          // delete this.clickedRow[key];
        }else{
          newClickedRow[key] = this.clickedRow[key];
        }
      }
    }else{
      newClickedRow = this.clickedRow;
    }
    return newClickedRow;
  }

  containsObject(arr: any[], obj: any){
    for (const row of arr) {
      if(isEqual(row,obj))
        return true;
    }
    return false;
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject } from 'lodash';
import { Title } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartType, Chart  } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';

import { ListService } from 'src/app/services/list.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.css']
})
export class ListDetailsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  rowData = [];
  records = new FormControl();
  recordList: string[] = [];
  totalCount : number[] = [];
  columnTitles : number[] = [];
  recordDataTitles: string[] = [];
  showData: boolean = false;
  tableClicked: boolean = false;
  chartOption: boolean = false;
  showform: boolean = false;
  state = "closed";
  title: string = '';
  error: boolean = false;
  tables: any[] = [];
  tablesTitles: any[] = [];
  tablesCount: number = 0;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];
  TableName: string = '';
  errorMessage: string = '';
  keysList: any[] = [];
  recordTitlesWithId: any[] = [];
  
  gridApi: any;
  gridColumnApi: any;
  tableHeight: string = '';
  
  
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        }
      }
    }
  };
  barChartLabels: ChartData[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [],
        label: '',
        backgroundColor:'#5294D0',
        hoverBackgroundColor:'#3B678E',
        borderColor: '#3B678E'
        
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private titleService: Title
  ) { }

  columnDefs: any[] = [
  ];

  defaultColDef = {
    resizable: true,
  };

  ngOnInit(): void {
    Chart.register(zoomPlugin);
    const name = String(this.route.snapshot.paramMap.get('source'));
    this.listservice.getSourceList(name).subscribe(list =>{
      if(list){
        this.hideloader('loading');
      }
      this.initList(list);
    },
    err => {
      if(err.status == 404) {
        this.hideloader('loading');
        this.error = true;
        this.title = err.error;
        this.errorMessage ='The requested page: "/'+ String(this.route.snapshot.params.source) + '" could not be found.';
      }
   });
    this.listservice.getNameOfSource(name).subscribe(list => this.initTitle(list));
    this.listservice.getTitlesofSourceRecords(name).subscribe(list =>this.initRecordDropdown(list));
  }

  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }

  initTitle(list: any): void {
    // console.log(list)
    this.title = String(list[0].name) + ' ('+list[0].count +' records)';
    this.titleService.setTitle('SeaLit - '+ this.title);
    
  }

  initRecordDropdown(list: any) {
    this.listservice.Titles = list.map((elem: any) => elem.title);
    // this.listservice.Ids = list.map((elem: any)=> elem.id);
    this.recordTitlesWithId = list;
    this.recordList = this.listservice.Titles.sort();
    this.showform = true;
  }

  initList(list: any): void {
    list.map((elem: any) => {
      this.recordDataTitles.push(elem.name);
      this.totalCount.push(elem.count);
    })
    this.showData = true;
  }


  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
        var source = String(this.route.snapshot.paramMap.get('source'));
        var data = event.data;
        var entity = this.TableName.replace('/','-');
        
        // console.log(data)

        for (const key in data) {
          if(isObject(data[key]) || key=='value-type' || key =='listLength')
              delete data[key];
        }
        // console.log(data)

        // console.log('list/'+source+'/Table?'+'Table='+entity+query);
        this.router.navigate(['list/'+source+'/Table/'+entity], { queryParams:data });
    })

  }

  displaytable(entity:string): void{
    // console.log(entity);
    
    const source = String(this.route.snapshot.paramMap.get('source'));
    if(this.chartOption){
      this.chartOption = !this.chartOption;
    }
    if(entity !== this.TableName){
      this.showloader('loading-div');
      this.listservice.getTableFromSource(source,entity).subscribe((table:any)=>{
        console.log(table);
        this.hideloader('loading-div');

        this.TableName = entity;
        this.columnDefs = this.formatTableTitles(table);
        this.columnTitles = this.columnDefs.map(column=> column.field);
        this.rowData = table;
        this.tableHeight = this.listservice.calculatetableHeight(table.length);
        if(!this.tableClicked){
          this.tableClicked = !this.tableClicked;
        }
      })
    }else{
      this.tableClicked = !this.tableClicked;
    }
  }
  showloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'flex';
  }

  formatTableTitles(table: any[]): any[]{

    var titles: any =  this.getTitles(table[0]);
    var titleFormat = titles.map((val: string) => {
        if(this.listservice.NumColumns.includes(val))
          return {'field': val, 'sortable': true, filter: 'agNumberColumnFilter', /*filterParams: numberFilter,valueFormatter: numberValueFormatter,*/ tooltipField: val};
        else if(this.listservice.DateColumns.includes(val))
          return {'field': val, 'sortable': true, filter: 'agDateColumnFilter', filterParams: dateFilter, tooltipField: val};
        else
          return {'field': val, 'sortable': true, 'filter': true, tooltipField: val};
        
    });

    // console.log(titleFormat);
    return titleFormat;
  }

  displaySelectedRecord(title:string): void {
    var record = this.recordTitlesWithId.filter(elem => elem.title === title);
    var id = record[0].id;
    const name = String(this.route.snapshot.paramMap.get('source'));
    this.router.navigate(['list/'+name+'/'+id]);
  }

  getTitles(temp: any): string[]{
    var titles: string[] = [];
    for (const [key, value] of Object.entries(temp)) {
      if(!isObject(value) && key!='value-type' && key!='listLength' && key!='listIds')
        titles.push(key);
    }
    return titles;
  }

  onBtnExport(tableg: any){
    var blob = new Blob([this.listservice.ConvertToCSV(tableg)], {type: 'text/csv' });
    saveAs(blob, "export.csv");
  }

  calculateStats(rowdata: any, column: string | number){ 
    if(String(column) != this.barChartData.datasets[0].label){
      // console.log('bmhka')
      var values = rowdata.map((elem: { [x: string]: any; })=> elem[column]);
      var stats = this.listservice.calculateStats(values);
      this.barChartData.labels = Object.keys(stats);
      this.barChartData.datasets[0].data = Object.values(stats);
      this.barChartData.datasets[0].label = String(column);
      if(!this.chartOption)
        this.chartOption = !this.chartOption;
      
        this.chart?.update();
    }else{
      this.chartOption = !this.chartOption;
    }
  }

  
}

var dateFilter = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const dateAsString = cellValue;
    var day;
    var month;
    var year;
    

    // We create a Date object for comparison against the filter date
    // console.log(dateAsString)
    if(typeof dateAsString == 'number'){
      year = dateAsString;
      day = 1;
      month = 0;
    }else{
      const dateParts = dateAsString.split(/[.\-/]/);
      if(dateParts[0].length == 4){ // yyy/mm/dd
        day = Number(dateParts[2]);
        month = Number(dateParts[1]) - 1;
        year = Number(dateParts[0]);
      }else{ //dd/mm/yyyy
        day = Number(dateParts[0]);
        month = Number(dateParts[1]) - 1;
        year = Number(dateParts[2]);
      }
    }  
    const cellDate = new Date(year, month, day);
    // console.log(cellDate)
    // Now that both parameters are Date objects, we can compare
    if (cellDate < filterLocalDateAtMidnight) {
        return -1;
    } else if (cellDate > filterLocalDateAtMidnight) {
        return 1;
    }
    return 0;
  }
};

var numberFilter = {
  allowedCharPattern: '\\d\\-\\,\\$',
  numberParser: function (text: string | number) {
    // console.log(text)
    if(typeof text == 'number') return text;

    return text == null
      ? null
      : parseFloat(text.replace(',', '.'));
  },
};

var numberValueFormatter = function (params: { value: string; }) {
  if (params.value == 'None or Unknown') return params.value
  
  if(typeof params.value == 'string') return parseFloat(params.value.replace(',', '.'));
  else return params.value;
};

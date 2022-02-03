import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { isObject } from 'lodash';
import { ListService } from 'src/app/services/list.service';
import { Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

import { ChartConfiguration, ChartData, ChartType, Chart  } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.css']
})
export class RecordDetailsComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective | undefined;

  sourceId: string ='';
  Id: string ='';
  sourceName: string ='';
  rowData = [];
  recordList: string[] = [];
  totalCount : number[] = [];
  columnTitles : number[] = [];
  tableDataTitles: string[] = [];
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
  barChartDataArray: ChartData<'bar'>[] = []; 
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

  recordDataTitles: any = [];
  recordData: any = [];

  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    Chart.register(zoomPlugin);
    const source = String(this.route.snapshot.paramMap.get('source'));
    const id = String(this.route.snapshot.paramMap.get('id'));
    // console.log(source,id);
    this.listservice.getrecordFromSource(source,id).subscribe(record=>{
      if (record) {
        this.hideloader('loading');
      }
      this.recordData = record.data;
      this.initList(record);
      // this.displaydata(record);
      // console.log(record)
    })
  }

  initList(record: any): void {
    this.title = record.title;

    this.Id = record.id;
    this.sourceId = record.sourceId;
    this.sourceName = record.sourceName;

    this.titleService.setTitle('SeaLit - '+this.sourceName+': '+ this.title);
    // console.log(record)

    record.data.forEach((elem: any) => {
      if(elem != null){
        var tableTitle = Object.keys(elem).join();
        this.recordDataTitles.push(tableTitle);
        this.totalCount.push(elem[tableTitle].length);
      }
    })
    this.showData = true;
    // console.log(this.recordDataTitles)
    // console.log(this.totalCount)
  }

  columnDefs: any[] = [
  ];

  defaultColDef = {
    resizable: true,
  };



  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
        var source = String(this.route.snapshot.paramMap.get('source'));
        var id = String(this.route.snapshot.paramMap.get('id'));
        var data = event.data;
        var entity = this.TableName.replace('/','-');
        var name = ''
        Object.keys(data).forEach(k =>{
          if(typeof data[k] == 'string' && k!= 'value-type')
            name =data[k];
        });
        // console.log(event)
        for (const key in data) {
          if(isObject(data[key]) || key=='value-type' || key =='listLength')
              delete data[key];
        }
        data.recordId = id;

        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['list/'+source+'/'+id+'/Table/'+entity], { queryParams:data });
    })
  }

  formatTableTitles(table: any[]): any[]{
    // console.log(table)
    var titles: any = this.getTitles(table[0]);
    var titleFormat = titles.map((val: string) => {
        if(this.listservice.NumColumns.includes(val))
          return {'field': val, 'sortable': true, filter: 'agNumberColumnFilter', filterParams: numberFilter,/*valueFormatter: numberValueFormatter,*/ tooltipField: val};
        else if(this.listservice.DateColumns.includes(val))
          return {'field': val, 'sortable': true, filter: 'agDateColumnFilter', filterParams: dateFilter,comparator: dateComparator, tooltipField: val};
        else
          return {'field': val, 'sortable': true, 'filter': true, tooltipField: val};
        
    });

    // console.log(titleFormat);
    return titleFormat;
  }

  displaytable(tableName: any): void {
    if(this.chartOption){
      this.chartOption = !this.chartOption;
    }
    if(tableName !== this.TableName){
      var table: any = [];
      // console.log(tableName)
      this.recordData.forEach((element: any) =>{
        if(element!= null)
          if(Object.keys(element).join() == tableName)
            table = Object.values(element)[0];
      })
      // console.log(table)
      // table = Object.values(table)[0];
      // console.log(table)
      this.TableName = tableName;
      this.columnDefs = this.formatTableTitles(table);
      this.columnTitles = this.columnDefs.map(column=> column.field);
      this.rowData = table;
      this.tableHeight = this.listservice.calculatetableHeight(table.length);
      if(!this.tableClicked){
        this.tableClicked = !this.tableClicked;
      }
    }else{
      this.tableClicked = !this.tableClicked;
    }
  }

  showloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'flex';
  }
  hideloader(id: string) {
    (<HTMLInputElement>document.getElementById(id)).style.display = 'none';
  }

  getTitles(temp: any): string[]{
    // console.log(temp)
    var titles: string[] = [];
    for (const [key, value] of Object.entries(temp)) {
      if(!isObject(value) && key!='value-type' && key!='listLength' && key!='listIds' && key!='display')
        titles.push(key);
    }
    return titles;

  }
  
  onBtnExport(tableg: any){
    var blob = new Blob([this.listservice.ConvertToCSV(tableg)], {type: 'text/csv' });
    saveAs(blob, "export.csv");
  }

  // show(id: any){
  //   if(!this.visibleId.includes(id)){
  //     this.visibleId.push(id);
  //     (<HTMLInputElement>document.getElementById(id)).style.animation = 'hide 0.4s linear forwards';
  //   } else{
  //     this.visibleId = this.listservice.arrayRemove(this.visibleId, id);
  //     (<HTMLInputElement>document.getElementById(id)).style.animation = 'show 0.4s linear forwards';
  //   }
  // }

  calculateStats(rowdata: any, column: string | number){ 
    if(String(column) != this.barChartData.datasets[0].label){
      // console.log('bmhka')
      
      this.chart?.chart?.resetZoom();
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
  resetZoom(){
    // console.log('zoom')
    this.chart?.chart?.resetZoom();
  }

}

var dateFilter = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string | number) => {
    const date = cellValue;
    var day;
    var month;
    var year;

    // We create a Date object for comparison against the filter date
    // console.log(dateAsString)
    if(typeof date == 'number'){
      year = date;
      day = 1;
      month = 0;
    }else{
      const dateParts = date.split(/[.\-/]/);
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

function dateComparator(date1: string | number, date2: string | number) {
  var date1Number = _monthToNum(date1);
  var date2Number = _monthToNum(date2);

  if (date1Number === null && date2Number === null) {
    return 0;
  }
  if (date1Number === null) {
    return -1;
  }
  if (date2Number === null) {
    return 1;
  }

  return date1Number - date2Number;
}

// HELPER FOR DATE COMPARISON
function _monthToNum(date: string | number) {
  var day;
  var month;
  var year;

  if (date === undefined || date === null || date == 'None or Unfilled') {
    return null;
  }

  if(typeof date == 'number'){
    year = date;
    day = 1;
    month = 0;
  }else{
    const dateParts = date.split(/[.\-/]/);
    if(dateParts[0].length == 4){ // yyy/mm/dd
      day = Number(dateParts[2]);
      month = Number(dateParts[1]);
      year = Number(dateParts[0]);
    }else{ //dd/mm/yyyy
      day = Number(dateParts[0]);
      month = Number(dateParts[1]);
      year = Number(dateParts[2]);
    }
  }  

  var result = year * 10000 + month * 100 + day;
  // 29/08/2004 => 20040829
  return result;
}

var numberFilter = {
  allowedCharPattern: '\\d\\-\\,',
  numberParser: function (text: string | number) {
    // console.log(text)
    if(typeof text == 'number') return text;

    return text == null
      ? null
      : parseFloat(text.replace(',', '.'));
  },
};

var numberValueFormatter = function (params: { value: string; }) {
  if (params.value == 'None or Unfilled') return params.value
  
  if(typeof params.value == 'string') return parseFloat(params.value.replace(',', '.'));
  else return params.value;
};
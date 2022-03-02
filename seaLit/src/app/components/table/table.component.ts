import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { isObject } from 'lodash';
import { ListService } from 'src/app/services/list.service';
import { CellClickedEvent, CellContextMenuEvent } from 'ag-grid-community';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { saveAs } from 'file-saver';
import zoomPlugin from 'chartjs-plugin-zoom';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective | undefined;


  @Input() rowData: any[] = [];
  @Input() titles: any[] = [];
  @Input() tableName:  string = '';

  columnDefs: any[] = [];
  defaultColDef = { resizable: true};
  tableHeight: string = '';
  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
      this.sendQuery(event, 'leftClick')

    }),
    onCellContextMenu: ((event: CellContextMenuEvent) =>{
      this.sendQuery(event, 'rightClick')
    })
  }


  chartOption: boolean = false;
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
  barChartPlugins = [];
  barChartType: ChartType = 'bar';



  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {

    Chart.register(zoomPlugin);
    this.columnDefs = this.formatTableTitles(this.titles);
    // this.columnTitles = this.columnDefs.map(column=> column.field);
    // this.rowData = table;
    this.tableHeight = this.listservice.calculatetableHeight(this.rowData.length);
  }

  formatTableTitles(table: any[]): any[]{
    // console.log(table)
    var titles: any = this.getTitles(table[0]);
    var titleFormat = titles.map((val: string) => {
        if(this.listservice.NumColumns.includes(val))
          return {'field': val, 'sortable': true, filter: 'agNumberColumnFilter', filterParams: numberFilter,/*valueFormatter: numberValueFormatter,*/ tooltipField: val, cellRenderer: (params: { value: any; }) => params.value === undefined ? "n/a" : params.value};
        else if(this.listservice.DateColumns.includes(val))
          return {'field': val, 'sortable': true, filter: 'agDateColumnFilter', filterParams: dateFilter,comparator: dateComparator, tooltipField: val, cellRenderer: (params: { value: any; }) => params.value === undefined ? "n/a" : params.value};
        else
          return {'field': val, 'sortable': true, 'filter': true, tooltipField: val, cellRenderer: (params: { value: any; }) => params.value === undefined ? "n/a" : params.value};

    });

    // console.log(titleFormat);
    return titleFormat;
  }

  getTitles(temp: any): string[]{
    if(this.titles.length != 0) return this.titles;

    var titles: string[] = [];
    for (const [key, value] of Object.entries(temp)) {
      if(!isObject(value) && key!='value-type' && key!='listLength' && key!='listIds' && key!='display')
        titles.push(key);
    }
    return titles;
  }

  sendQuery(event: CellContextMenuEvent | CellClickedEvent, click: string){
    var source = String(this.route.snapshot.paramMap.get('source'));
    var id = String(this.route.snapshot.paramMap.get('id'));
    var data = event.data;
    var entity = this.tableName.replace('/','-');
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

    if(click == 'leftClick'){
      this.router.navigate(['sources/'+source+'/'+id+'/table/'+entity], { queryParams:data });
    }else{
      const url = this.router.serializeUrl(this.router.createUrlTree(['seaLit/sources/'+source+'/'+id+'/table/'+entity], { queryParams:data }));
      window.open(url, '_blank');
    }
  }

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

  onBtnExport(tableg: any){
    var blob = new Blob([this.listservice.ConvertToCSV(tableg)], {type: 'text/csv' });
    saveAs(blob, "export.csv");
  }

  resetZoom(){
    // console.log('zoom')
    this.chart?.chart?.resetZoom();
  }

  downloadChartData(){
    var chart =  Chart.getChart("chart");
    var title = chart?.data.datasets[0].label;
    var data = chart?.data.labels;
    var count = chart?.data.datasets[0].data;
    var csvData = this.listservice.ConvertChartToCSV(data,count,title);

    var blob = new Blob([csvData], {type: 'text/csv' });
    saveAs(blob, "export.csv");
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

import { Component, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { flatMap, isObject, isObjectLike } from 'lodash';
import { ListService } from 'src/app/services/list.service';
import { saveAs } from 'file-saver';
import { Title } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartType, Chart  } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective | undefined;

  sourceName: string ='';
  rowData = [];
  title: string = '';

  tables: any[] = [];
  tablesTitles: any[] = [];
  selectedTable: boolean = false;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];
  keysList: any[] = [];
  columnTitles: any[] = [];

  gridApi: any;
  gridColumnApi: any;
  filename: any;
  fileUrl: any;
  visibleId: string[] = [];
  tableHeights: string[] = [];
  
  chartOption: boolean[] = [];
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
        label: ''
      }
    ]
  };


  constructor(
    private route: ActivatedRoute,
    private listservice : ListService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    Chart.register(zoomPlugin);

    const params = this.route.snapshot.params;
    const query = this.route.snapshot.queryParams;
    this.listservice.getTablesFromSource(params.source,params.name,query).subscribe(list =>{
      if (list) {
        this.hideloader();
      }
      // console.log(list);
      this.displaydata(params,list);
    });
  }

  hideloader() {
    (<HTMLInputElement>document.getElementById('loading')).style.display = 'none';
  }

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };

  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{

        if(event.data['FastCat Records'] != undefined){
          window.open(event.data['FastCat Records'], "_blank");
          return;
        }
        var source = String(this.route.snapshot.paramMap.get('source'));
        var table = String(this.route.snapshot.paramMap.get('name'));
        var data = event.data;
        var entity = event.colDef.colId;

        for (const key in data) {
          if(key=='value-type' || key =='listLength' || key == 'display' || ((key == 'Embarkation Date' || key == 'Ship\'s Name') && (table=='Crew Members'|| table== 'Crew Members and Embarkation Dates')) 
            || ((key == 'Discharge Date' || key == 'Ship\'s Name') && (table=='Crew Members'|| table== 'Crew Members and Discharge Dates'))  )
              delete data[key];
        }
        // console.log(data);
        // console.log('list/'+source+'/Table?'+'Table='+entity+query);
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['list/'+source+'/Table/'+entity], { queryParams:data });
    }),
    suppressExcelExport: true,
  }

  displaydata(params: any,record: any): void {
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    this.sourceName = params.source;

    if(params.name.charAt(params.name.length - 1) == '2')
      this.title = params.name.slice(0, -1);
    else
      this.title = params.name;
    
    this.titleService.setTitle('SeaLit - '+this.sourceName+': '+ this.title);
    
    for (const key in record) {
      var element = record[key];
      if(isObjectLike(element)){
        if(key == 'FastCat Records')
          element = this.formatLinks(element);
        this.keysList.push(key);
        var titles = this.getTitles(element[0]);
        var titleFormat = titles.map((val: string) => {
          if(val == 'FastCat Records'){
            return {width: 60, resizable: false, tooltipField: val,
              cellRenderer: function() {
                return '<i class="material-icons" style="vertical-align: middle">launch</i>'
              }
            }
          }else{
            if(this.listservice.NumColumns.includes(val))
              return {'field': val,'colId':key, 'sortable': true, filter: 'agNumberColumnFilter', filterParams: numberFilter,/*valueFormatter: numberValueFormatter,*/ tooltipField: val};
            else if(this.listservice.DateColumns.includes(val))
              return {'field': val,'colId':key, 'sortable': true, filter: 'agDateColumnFilter', filterParams: dateFilter,comparator: dateComparator, tooltipField: val};
            else
              return {'field': val,'colId':key, 'sortable': true, filter: 'true', tooltipField: val }
          }
        });
        this.tablesTitles.push(titleFormat);
        this.chartOption.push(false);
        this.columnTitles.push(titleFormat.map(column=> column.field));
        this.tableHeights.push(this.listservice.calculatetableHeight(element.length));
        this.tables.push(element);
        this.barChartDataArray.push(
          {
            labels: [],
            datasets: [
              { data: [],
                label: ''
              }
            ]
          }
        )
      }else{
        if(key !== 'value-type' && key !== 'listLength' && key!=='display')
          this.nonLitsInfo.push({'key':key, 'value':element});
      }
    }
    if(!this.selectedTable)
      this.selectedTable = !this.selectedTable;
  }

  formatLinks(element: any) {
    var data: string[] = element.data;
    return data.map((map: any) => {
      return {'FastCat Records':'https://isl.ics.forth.gr/FastCatTeam/templates/'+element.id+'.html?name='+map.id+'&templateTitle='+element.name+'&mode=teamView','title':map.title};
    })
  }

  getTitles(temp: any): string[]{
    var titles: string[] = [];
    for (const [key] of Object.entries(temp)) {
      if(key!='value-type' && key!='listLength' && key!='listIds' && key!='display')
        titles.push(key);
    }
    return titles;
  }

  onBtnExport(tableg: any){
    // console.log(tableg);
    // console.log(this.listservice.ConvertToCSV(tableg))
    var blob = new Blob([this.listservice.ConvertToCSV(tableg)], {type: 'text/csv;charset=utf-8' });
    saveAs(blob, "export.csv");
  }

  show(id: any){
    if(!this.visibleId.includes(id)){
      this.visibleId.push(id);
      (<HTMLInputElement>document.getElementById(id)).style.animation = 'hide 0.4s linear forwards';
    } else{
      this.visibleId = this.listservice.arrayRemove(this.visibleId, id);
      (<HTMLInputElement>document.getElementById(id)).style.animation = 'show 0.4s linear forwards';
    }
  }

  calculateStats(rowdata: any, column: string | number, index: number){ 
    if(String(column) != this.barChartDataArray[index].datasets[0].label){
      this.chart?.chart?.resetZoom();
      // console.log('bmhka')
      
      var values = rowdata.map((elem: { [x: string]: any; })=> elem[column]);
      var stats = this.listservice.calculateStats(values);

      this.barChartDataArray[index] = {
        labels: Object.keys(stats),
        datasets: [
          { data: Object.values(stats),
            label: String(column)
          }
        ]
      };
      if(!this.chartOption[index])
        this.chartOption[index] = !this.chartOption[index];

        this.chart?.update();
    }else{
        this.chartOption[index] = !this.chartOption[index];
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
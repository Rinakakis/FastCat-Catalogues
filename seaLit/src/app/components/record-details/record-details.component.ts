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
  title: string = '';

  tables: any[] = [];
  tablesTitles: any[] = [];
  tablesCount: number = 0;
  selectedTable: boolean = false;
  nonLitsInfo: any[] = [];
  keysNonList: any[] = [];
  entity: string = '';
  keysList: any[] = [];
  visibleId: string[] = [];
  tableHeights: string[] = [];

  columnTitles: any[] = [];
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
    private titleService: Title
  ) { }

  ngOnInit(): void {
    Chart.register(zoomPlugin);
    const source = String(this.route.snapshot.paramMap.get('source'));
    const id = String(this.route.snapshot.paramMap.get('id'));
    // console.log(source,id);
    this.listservice.getrecordFromSource(source,id).subscribe(record=>{
      // console.log(record);
      if (record) {
        this.hideloader();
      }
      this.displaydata(record);
      // console.log(record)
    })
  }

  columnDefs = [
  ];

  defaultColDef = {
    resizable: true,
  };

  hideloader() {
    (<HTMLInputElement>document.getElementById('loading')).style.display = 'none';
  }

  gridOptions = {
    // Add event handlers
    onCellClicked: ((event: CellClickedEvent) =>{
        var source = String(this.route.snapshot.paramMap.get('source'));
        var data = event.data;
        var entity = event.colDef.colId;
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
        // console.log(event);

        // console.log('list/'+source+'/Table?'+'Table='+entity+query);
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['list/'+source+'/Table/'+entity], { queryParams:data });
    })
  }

  displaydata(record: any): void {
    this.tablesTitles = [];
    this.tables = [];
    this.nonLitsInfo = [];
    this.keysList = [];
    this.keysNonList = [];

    this.title = record.title;

    this.Id = record.id;
    this.sourceId = record.sourceId;
    this.sourceName = record.sourceName;

    this.titleService.setTitle('SeaLit - '+this.sourceName+': '+ this.title);
    record.data.forEach((element: any) => {
      if(element != null){
        var data: any[] = Object.values(element);
        data = data[0];
        if(data.length == 1){
          this.keysNonList.push(Object.keys(element).join());
          var lala = JSON.parse(JSON.stringify(data[0]));
          Object.keys(lala).forEach(k => {
            if(typeof lala[k] == 'object' || k =='listLength' || k == 'value-type')
              delete lala[k];
          })
          this.nonLitsInfo.push(lala);
        }else{
          this.keysList.push(Object.keys(element).join());
          var titles = this.getTitles(data[0]);
          var titleFormat = titles.map((val: string) => {
            // return {'field': val,'colId':Object.keys(element).join(), 'sortable': true, 'filter': true, tooltipField: val};
            if(this.listservice.NumColumns.includes(val))
              return {'field': val,'colId':Object.keys(element).join(), 'sortable': true, filter: 'agNumberColumnFilter', tooltipField: val }
            else  
              return {'field': val,'colId':Object.keys(element).join(), 'sortable': true, filter: 'true', tooltipField: val }
          });
          this.tablesTitles.push(titleFormat);
          this.tableHeights.push(this.listservice.calculatetableHeight(data.length));
          this.tables.push(data);

          this.chartOption.push(false);
          this.columnTitles.push(titleFormat.map(column=> column.field));
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
          
        }
      }
    });

    // console.log(this.tables)
    if(!this.selectedTable)
      this.selectedTable = !this.selectedTable;
  }

  getTitles(temp: any): string[]{
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
      // console.log('bmhka')
      this.chart?.chart?.resetZoom();
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

        this.chart?.chart?.resetZoom();
        this.chart?.update();

        // Chart.register(zoomPlugin);

    }else{
        this.chartOption[index] = !this.chartOption[index];
    }
  }

}

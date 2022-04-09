import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isObject } from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class ListService {


  Titles: any[] = [];
  Ip: string = '192.168.1.4'; // 'catalogues.sealitproject.eu'
  port: string = ':8081';
  apiName: string = '/sealit-api';
  protocol: string = 'http://';

  api = this.protocol + this.Ip + this.port + this.apiName;
  // api = this.protocol+this.Ip+this.apiName;

  NumColumns: string[] = [
    'Age',
    // 'Age (Years)',
    'House Number',
    // 'Year of Birth',
    'Birth Year',
    // 'Construction Date',
    'Registry Folio',
    'Registry List',
    'Registry Number',
    // 'Birth Date (Year)', // Crew List (Ruoli di Equipaggio)
    'Serial Number',
    'Months',
    'Days',
    'Total Crew Number (Captain Included)',
    // 'Date of Birth (Year)', // Employment records, Shipyards of Messageries Maritimes, La Ciotat
    'Tonnage',
    'Tonnage (Value)',
    'Year of Reagistry',
    'Year of Construction',
    'Nominal Power',
    'Indicated Power',
    'Gross Tonnage (In Kg)',
    'Length (In Meter)',
    'Width (In Meter)',
    'Depth (In Meter)',
    'Net Wage (Value)',
    'Year',
    'Refrence Number',
    'Total Days',
    'Days at Sea',
    'Days at Port',
    'Overall Total Wages (Value)',
    'Overall Pension Fund (Value)',
    'Overall Net Wages (Value)',
    'Salary per Month (Value)',
    // 'Registration Number',
    'Semester',
    'From',
    'To',
    'Total Number of Students',
  ];
  DateColumns: string[] = [
    'Date (From)',
    'Embarkation Date',
    'Discharge Date',
    'Date (To)',
    // 'Navigation: From',
    // 'Navigation: To',
    'Date of Death',
    // 'Date of Birth', // Inscription Maritime - Maritime Register of the State for La Ciotat, Payroll of Russian Steam Navigation and Trading Company, Sailors register (Libro de registro de marineros)
    // 'Duration (From)',
    // 'Duration (To)',
    'Creation Date',
    'Person\'s Date of Birth',
    'Recruitment Date',
    'Birth Date', // Register of Maritime personel , Register of Maritime workers (Matricole della gente di mare), Seagoing Personel
    'Military Service Organisation Inscription Date',
    'Military Service Start Date',
    'End of Service Date',
    'End of Service',
    'Start of Service'
  ];


  constructor(private http: HttpClient) {
  }

  getNamesOfSources(): Observable<any> {
    return this.http.get(this.api + '/numberOfrecords/all');
  }

  getNameOfSource(title: string): Observable<any> {
    return this.http.get(this.api + '/numberOfrecords/' + title);
  }

  getSourceList(source: string): Observable<any> {
    return this.http.get(this.api + '/sourceRecordList?' + 'source=' + source)

  }

  getTitlesofSourceRecords(title: string): Observable<any> {
    return this.http.get(this.api + '/sourceRecordTitles/' + title);
  }

  getTableFromSource(source: string, tableName: string): Observable<any> {
    return this.http.get(this.api + '/tableData?' + 'source=' + source + '&tableName=' + tableName);
  }

  getExploreAll(name: string): Observable<any> {
    return this.http.get(this.api + '/exploreAll/' + name);
  }

  getTablesFromSource(source: string, tableName: string, query: any): Observable<any> {
    var httpParams = new HttpParams();
    Object.keys(query).forEach((key: string) => {
      httpParams = httpParams.append(key, query[key]);
    });
    httpParams = httpParams.append('source', source);
    httpParams = httpParams.append('tableName', tableName);

    return this.http.get(this.api + '/tableData', { params: httpParams });
  }

  getrecordFromSource(source: string, id: string): Observable<any> {
    return this.http.get(this.api + '/tableData?' + 'source=' + source + '&id=' + id);
  }

  ConvertToCSV(table: any[], titles: string[]) {
    // console.log(titles)
    var firstLine;
    var data = table.map(elem => {
      elem = titles.map(key =>{
        if(elem[key] == undefined)
          return "n/a";
        return elem[key]
      })
      // console.log(elem)
      return Object.values(elem)
        .filter(col => (typeof col == 'string' || typeof col == 'number') && col != 'list')
        .map(elem2 => '"' + elem2 + '"')
        .join(',');
    })
    firstLine = titles.map(elem2 => '"' + elem2 + '"').join(',');
    data.unshift(firstLine);
    // console.log(data)

    return data.join('\n');
  }

  ConvertChartToCSV(data: any, count: any, title: any) {
    var csvData = [];
    csvData.push('"' + title + '","Count"')
    for (let i = 0; i < data.length; i++) {
      csvData.push('"' + data[i] + '","' + count[i] + '"')
    }
    return csvData.join('\n');
  }

  getTitles(temp: any): string[] {
    var titles: string[] = [];
    // console.log(temp)
    for (const [key, value] of Object.entries(temp)) {
      if (!isObject(value) && key != 'value-type' && key != 'listLength' && key != 'listIds')
        titles.push(key);
    }
    return titles;
  }

  arrayRemove(arr: string[], value: string): string[] {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  calculatetableHeight(length: number): string {
    if (length == 1) {
      var height = 160;
      return 'height:' + height + 'px; width:100%';
    } else if (length < 3) {
      var height = 100 * length;
      return 'height:' + height + 'px; width:100%';
    } else if (length < 4) {
      var height = 80 * length;
      return 'height:' + height + 'px; width:100%';
    } else if (length < 6) {
      var height = 70 * length;
      return 'height:' + height + 'px; width:100%';
    } else if (length < 8) {
      var height = 62 * length;
      return 'height:' + height + 'px; width:100%';
    } else {
      return 'height:500px; width:100%';
    }
  }

  calculateStats(data: string[] | number[]): object {
    // const count: object = countBy(data);
    // return count;
    const counts: { [key: string]: number } = {};
    for (const el of data) {
      var c;
      if (typeof el == 'string')
        c = el.toLowerCase();
      else
        c = el;
      counts[c] = counts[c] ? ++counts[c] : 1;
    }
    const orderedcount = Object.keys(counts).sort().reduce(
      (obj: { [key: string]: number }, key) => {
        obj[key] = counts[key];
        return obj;
      },
      {}
    );

    return orderedcount;
  }
}


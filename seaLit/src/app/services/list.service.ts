import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isObject, countBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  Titles: any[] = [];
  Ip: string = '192.168.1.3';
  NumColumns: string[] = [
    'Age',
    'Age (Years)',
    'House Number',
    'Year of Birth',
    'Construction Date',
    'Registry Folio',
    'Registry List',
    'Registry Number',
    'Birth Date (Year)', // Crew List (Ruoli di Equipaggio)
    'Serial Number',
    'Months',
    'Days',
    'Total Crew Number (Captain Included)',
    'Date of Birth (Year)', // Employment records, Shipyards of Messageries Maritimes, La Ciotat
    'Tonnage', 
    'Tonnage (Value)', 
    'Year of Reagistry',
    'Year of Constraction',
    'Nominal Power',
    'Indicated Power',
    'Gross Tonnage (In Kg)',
    'Length (In Meter)',
    'Width (In Meter)',
    'Depth (In Meter)',
    'Year',
    'Refrence Number',
    'Total Days',
    'Days at Sea',
    'Days at Port',
    'Overall Total Wages (Value)',
    'Overall Pension Fund (Value)',
    'Overall Net Wages (Value)',
    'Salary per Month (Value)',
    'Registration Number',
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
    'Navigation: From',
    'Navigation: To',
    'Date of Death', 
    'Date of Birth', // Inscription Maritime - Maritime Register of the State for La Ciotat, Payroll of Russian Steam Navigation and Trading Company, Sailors register (Libro de registro de marineros)
    'Duration (From)',
    'Duration (To)',
    'Creation Date',
    'Person\'s Date of Birth',
    'Recruitment Date',
    'Birth Date', // Register of Maritime personel , Register of Maritime workers (Matricole della gente di mare), Seagoing Personel
    'Military Service Organisation Inscription Date',
    'Military Service Start Date',
  ];
  constructor(private http:HttpClient) {
  }

  getNamesOfSources(): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/numberOfrecords/all');
  }

  getNameOfSource(title: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/numberOfrecords/'+title);
  }

  getSourceList(record: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/sourceRecordList/'+record);
  }

  getTitlesofSourceRecords(title: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/sourceRecordTitles/'+title);
  }

  getTableFromSource(source: string,tableName: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/tableData?'+'source='+source+'&tableName='+tableName);
  }

  getTablesFromSource(source: string, tableName: string, query: any): Observable<any>{
    var httpParams = new HttpParams();
    Object.keys(query).forEach((key: string) => {
      httpParams = httpParams.append(key, query[key]);
    });
    httpParams = httpParams.append('source',source);
    httpParams = httpParams.append('tableName',tableName);

    return this.http.get('http://'+this.Ip+':8081/tableData', { params: httpParams });
  }

  getrecordFromSource(source: string,id: string): Observable<any>{
    return this.http.get('http://'+this.Ip+':8081/tableData?'+'source='+source+'&id='+id);
  }

  ConvertToCSV(table: any){
    var data = table.map((elem: object) =>{
      return Object.values(elem)
      .filter(col => typeof col == 'string' && col != 'list')
      .map(elem2=>  '"'+elem2+'"')
      .join(',');
    })
    var titles = this.getTitles(table[0]).map(elem2=>  '"'+elem2+'"').join(',');
    data.unshift(titles);

    return data.join('\n');
  }
  
    getTitles(temp: any): string[]{
      var titles: string[] = [];
      console.log(temp)
      for (const [key, value] of Object.entries(temp)) {
        if(!isObject(value) && key!='value-type' && key!='listLength' &&key!='listIds')
          titles.push(key);
      }
      return titles;
    }

    arrayRemove(arr: string[], value: string): string[] { 
      return arr.filter(function(ele){ 
          return ele != value; 
      });
    }

    calculatetableHeight(length: number): string{
      if(length == 1){
        var height = 160;
        return 'height:'+ height+'px; width:100%';
      }else if(length < 3){
        var height = 100*length;
        return 'height:'+ height+'px; width:100%';
      }else if(length < 4){
        var height = 80*length;
        return 'height:'+ height+'px; width:100%';
      }else if(length < 6){
        var height = 70*length;
        return 'height:'+ height+'px; width:100%';
      }else if(length < 8){
        var height = 62*length;
        return 'height:'+ height+'px; width:100%';
      }else{
        return 'height:500px; width:100%';
      }
    }

    calculateStats(data: string[] | number[]): object {
      // const count: object = countBy(data);
      // return count;
      const counts: {[key: string]: number} = {};
      for (const el of data) {
        var c;
        if(typeof el == 'string')
          c = el.toLowerCase();
        else
          c = el;
        counts[c] = counts[c] ? ++counts[c] : 1;
      }
      const orderedcount = Object.keys(counts).sort().reduce(
        (obj:{[key: string]: number}, key) => { 
          obj[key] = counts[key]; 
          return obj;
        }, 
        {}
      );

      return orderedcount;
    }

    dateFilter = {
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
    
    dateComparator(date1: string | number, date2: string | number) {
      var date1Number = this._monthToNum(date1);
      var date2Number = this._monthToNum(date2);
    
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
    _monthToNum(date: string | number) {
      var day;
      var month;
      var year;
    
      if (date === undefined || date === null || date == 'None or Unknown') {
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
    
    numberFilter = {
      allowedCharPattern: '\\d\\-\\,',
      numberParser: function (text: string | number) {
        // console.log(text)
        if(typeof text == 'number') return text;
    
        return text == null
          ? null
          : parseFloat(text.replace(',', '.'));
      },
    };
     
    numberValueFormatter = function (params: { value: string; }) {
      if (params.value == 'None or Unknown') return params.value
      
      if(typeof params.value == 'string') return parseFloat(params.value.replace(',', '.'));
      else return params.value;
    };
    

    
}

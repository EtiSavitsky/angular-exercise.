import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Console } from '@angular/core/src/console';


@Component({
  selector: 'table-overview-example',
  styleUrls: ['table-overview-example.css'],
  templateUrl: 'table-overview-example.html',
})
export class TableOverviewExample implements OnInit {
  displayedColumns = [
    'date',
    'open',
    'high',
    'low',
    'close',
    'adjustedClose',
    'volume',
    'dividendAmount',
    'splitCoefficient',
  ];
  dataSource: MatTableDataSource<IBMData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  url =
    'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo';
  getData() {
    return this.http.get<IBMData[]>(this.url);
  }
  constructor(private http: HttpClient) {
    // Create 100 users
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
  }
  ngOnInit(): void {
    this.getData().subscribe((response) => {
      const ibmArr: Array<IBMData> = new Array<IBMData>();

      const arr = response['Time Series (Daily)'];

      // console.log(arr)
      for (var k in arr) {
        let elemnt: IBMData = {
          date: new Date(k),
          open: arr[k]['1. open'],
          high: arr[k]['2. high'],
          low: arr[k]['3. low'],
          close: arr[k]['4. close'],
          adjustedClose: arr[k]['5. adjusted close'],
          volume: arr[k]['6. volume'],
          dividendAmount: arr[k]['7. dividend amount'],
          splitCoefficient: arr[k]['8. split coefficient'],
        };
        // console.log(elemnt);
        ibmArr.push(elemnt);
      }
      console.log(ibmArr);
      this.dataSource = new MatTableDataSource(ibmArr);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.findMaxSorted(ibmArr);
      this.findMax(ibmArr);
    });
  }
  maxSorted = 0;
  maxNoSorted = 0; 
  findMaxSorted(ibmArr: Array<IBMData>) {
    for (let i = 0; i < ibmArr.length; i++) {
      for (let j = i + 1; j < ibmArr.length; j++) {
        if (ibmArr[i].close - ibmArr[j].close > this.maxSorted) {
          this.maxSorted = ibmArr[i].close - ibmArr[j].close; 
        }
      }
    }
  }

  findMax(ibmArr: Array<IBMData>) {
    for (let i = 0; i < ibmArr.length; i++) {
      for (let j = 0; j < ibmArr.length; j++) {
        if (ibmArr[i].date > ibmArr[j].date) {
          if (ibmArr[i].close - ibmArr[j].close > this.maxNoSorted) {
            this.maxNoSorted = ibmArr[i].close - ibmArr[j].close;

          }
        }
      }
    }
  }
  ngAfterViewInit() {}

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

export interface IBMData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose: number;
  volume: number;
  dividendAmount: number;
  splitCoefficient: number;
}

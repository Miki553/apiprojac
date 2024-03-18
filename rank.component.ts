import { Component } from '@angular/core';
import { HeadComponent } from '../head/head.component';
import { CommonModule, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppdataService } from '../../service/appdata.service';
import { switchMap } from 'rxjs/operators';
import { concatMap } from 'rxjs/operators';
import { interval } from 'rxjs';




@Component({
  selector: 'app-rank',
  standalone: true,
  imports: [
    HeadComponent,
    HttpClientModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './rank.component.html',
  styleUrl: './rank.component.scss'
})
export class RankComponent {
  day:any;
  num:any;

  Top10User : any;
  apiurl ="";
  imgshow = "";
  nameshow = "";

  rank :any;



  constructor(private datePipe: DatePipe,private http : HttpClient,private appdata : AppdataService) {   
    this.apiurl = appdata.getapiurl();
    // http.put(`${this.apiurl}/statistics/updaterank`,{"id":1}).subscribe((data : any) => {console.log("updaterank");});
    // http.put(`${this.apiurl}/statistics/updaterank2`,{"id":1}).subscribe((data : any) => {console.log("updaterank2");});
    // this.Top10();

    http.put(`${this.apiurl}/statistics/updaterank`, {"id": 1}).pipe(
      concatMap(() => {
        return http.put(`${this.apiurl}/statistics/updaterank2`, {"id": 1});
      })
    ).subscribe((data: any) => {
      console.log("updaterank and updaterank2 are done");
      this.Top10();
    });

    // this.reface();

  }

reface(){
  interval(20000).pipe(
    concatMap(() => {
      return this.http.put(`${this.apiurl}/statistics/updaterank`, {"id": 1});
    }),
    concatMap(() => {
      return this.http.put(`${this.apiurl}/statistics/updaterank2`, {"id": 1});
    })
  ).subscribe((data: any) => {
    console.log("updaterank reface");
    this.Top10();
  });
}

  
Top10(){
  this.rank = [];
  this.http.get(`${this.apiurl}/image/top10`).pipe(
    switchMap((data: any) => {
      this.Top10User = data;
      console.log(this.Top10User);
      
      const requests = this.Top10User.map((img : any) => {
        return this.http.get(`${this.apiurl}/statistics/chat/` + img.image_id);
      });
      return forkJoin(requests); 
    })
  ).subscribe((responses: any) => {
    responses.forEach((data2: any) => {
      if(data2 && data2.length >= 2) { 
        // const sum = data2[1].rank - data2[0].rank;
        const sum = data2[1].rank;
        this.rank.push(sum);
      } else {
        this.rank.push(0);
      }
    });
    this.ngAfterViewInit(this.Top10User);
  });
}

// ngAfterViewInit(scorea:any): void {
//   let num=[];
//   if (scorea && scorea.length > 0) {
//     for(let s of scorea){
//       num.push(s.score);
//     }
//   } 


//   const data = [
//     // { day: this.getday(0), count:  num[0]},
//     // { day: this.getday(1), count: num[1] },
//     // { day: this.getday(2), count: num[2] },
//     // { day: this.getday(3), count: num[3] },
//     // { day: this.getday(4), count: num[4] },
//     // { day: this.getday(5), count: num[5] },
//     // { day: this.getday(6), count: num[6] },

//     { day: this.getday(6), count: num[6] },
//     { day: this.getday(5), count: num[5] },
//     { day: this.getday(4), count: num[4] },
//     { day: this.getday(3), count: num[3] },
//     { day: this.getday(2), count: num[2] },
//     { day: this.getday(1), count: num[1] },
//     { day: this.getday(0), count:  num[0]},
//   ];

  

//   const canvas = document.getElementById('acquisitions') as HTMLCanvasElement;
//   if (canvas) {
//     const existingChart = Chart.getChart(canvas);
//     if (existingChart) {
//       existingChart.destroy();
//     }
//     const chart = new Chart(
//       canvas,
//       {
//         type: 'line',
//         options: {
//           animation: false,
//           plugins: {
//             legend: {
//               display: false
//             },
//             tooltip: {
//               enabled: false
//             }
//           }
//         },
//         data: {
//           labels: data.map(row => row.day),
//           datasets: [
//             {
//               label: 'Acquisitions by year',
//               data: data.map(row => row.count)
//             }
//           ]
//         }
//       }
//     );

//   }
// }

ngAfterViewInit(scorea: any[]): void {
  if (scorea && scorea.length > 0) {
      scorea.forEach((s, index) => {
          const canvasId = `acquisitions${index}`;
          const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
          if (canvas) {
              const existingChart = Chart.getChart(canvas);
              if (existingChart) {
                  existingChart.destroy();
              }
             
              this.http.get(`${this.apiurl}/statistics/chat/`+s.image_id).subscribe((data2 : any) => {
                let num =[];
                for(let stt of data2){
                  num.push(stt.score);
                }
                
                // console.log(num);
                
                
              const data = [
                { day: this.getday(6), count: num[6] },
                { day: this.getday(5), count: num[5] },
                { day: this.getday(4), count: num[4] },
                { day: this.getday(3), count: num[3] },
                { day: this.getday(2), count: num[2] },
                { day: this.getday(1), count: num[1] },
                { day: this.getday(0), count:  num[0]},
              ];

                const chart = new Chart(
                  canvas,
                  {
                      type: 'line',
                      options: {
                          animation: false,
                          plugins: {
                              legend: { display: false },
                              tooltip: { enabled: false }
                          }
                      },
                      data: {
                          labels: data.map(row => row.day),
                          datasets: [{ label: 'Acquisitions by year', data: data.map(row => row.count) }]
                      }
                  }
              );
              });
    


          }
      });
  }
}


getday(num : number){
  const currentDate = new Date();
  const pastDate = new Date(currentDate.setDate(currentDate.getDate() - num));
  const formattedDate = this.datePipe.transform(pastDate, 'dd');
  return formattedDate;
}

getCurrentDate() {
  const currentDate = new Date();
  const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  console.log(formattedDate); // แสดงค่าวันที่ปัจจุบันในรูปแบบ 'yyyy-MM-dd' ในคอนโซล
}

}

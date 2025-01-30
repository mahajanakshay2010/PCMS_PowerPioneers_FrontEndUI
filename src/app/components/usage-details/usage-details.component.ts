import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsageDetailsService } from '../../usage-details-service.service';

@Component({
  selector: 'app-usage-details',
  templateUrl: './usage-details.component.html',
  styleUrls: ['./usage-details.component.css']
})
export class UsageDetailsComponent implements OnInit {
  usageDetails: any;
  usageDetailsMonth: any;
  doughnutChartData: any;
  stackedBarChartData: any;
  doughnutChartOptions: any;
  stackedBarChartOptions: any;

  constructor(private usageDetailsService: UsageDetailsService,    private router: Router ) { }

  ngOnInit(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.fetchUsageDetails(userId); // Replace with the actual user ID
    this.fetchUsageDetailsMonth(userId); // Replace with the actual user ID
  }

  fetchUsageDetails(userId: number): void {
    this.usageDetailsService.getUsageDetails(userId).subscribe(data => {
      this.usageDetails = data;
      this.prepareDoughnutChartData();
    });
  }

  fetchUsageDetailsMonth(userId: number): void {
    this.usageDetailsService.getUsageDetailsMonth(userId).subscribe(data => {
      this.usageDetailsMonth = data;
      this.prepareStackedBarChartData();
    });
  }

  prepareDoughnutChartData(): void {
    const doughnutLabels = this.usageDetails.map((item: any) => item.planName);
    const doughnutData = this.usageDetails.map((item: any) => item.units_consumed);
    const colors = this.generateColors(doughnutData.length);

    this.doughnutChartData = {
      labels: doughnutLabels,
      datasets: [
        {
          data: doughnutData,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }
      ]
    };

    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  prepareStackedBarChartData(): void {
    const months = Object.keys(this.usageDetailsMonth);
    const plans = new Set<string>();
    months.forEach(month => {
      Object.keys(this.usageDetailsMonth[month]).forEach(plan => plans.add(plan));
    });

    const stackedBarLabels = months;
    const stackedBarData = Array.from(plans).map(plan => {
      return {
        label: plan,
        backgroundColor: this.getRandomColor(),
        data: months.map(month => this.usageDetailsMonth[month][plan] || 0)
      };
    });

    this.stackedBarChartData = {
      labels: stackedBarLabels,
      datasets: stackedBarData
    };

    this.stackedBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    };
  }

  generateColors(length: number): string[] {
    const colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(this.getRandomColor());
    }
    return colors;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  searchScreen(): void {
    this.router.navigate(['/search-plan']);
  }
}
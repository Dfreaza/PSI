import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-statistics',
  templateUrl: './detail-statistics.component.html',
  styleUrls: ['./detail-statistics.component.css']
})
export class DetailStatisticsComponent {

constructor(private route: ActivatedRoute) {
  const id = this.route.snapshot.paramMap.get('id');

}
}

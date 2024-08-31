import { Component, OnInit } from '@angular/core';
import { Dimension } from '../../../shared/interfaces/dimension';
import { Router } from '@angular/router';
import { DimensionService } from '../../../shared/services/dimension.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dimension-list',
  templateUrl: './dimension-list.component.html',
})
export class DimensionListComponent implements OnInit {
  dimensions$: Observable<Dimension[]>;
  currentPage: number = 1;

  constructor(
    private dimensionService: DimensionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dimensions$ = this.dimensionService.loadDimensions(this.currentPage);
  }

  navigate(name: string): void {
    this.router.navigate(['/dimensions', name.toLowerCase().replace(' ', '-')]);
  }
}

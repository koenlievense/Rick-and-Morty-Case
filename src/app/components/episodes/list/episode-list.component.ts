import { Component, OnInit } from '@angular/core';
import { EpisodeService } from '../../../shared/services/episode.service';
import { Episode } from '../../../shared/interfaces/episode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-episode-list',
  templateUrl: './episode-list.component.html',
})
export class EpisodeListComponent implements OnInit {
  episodes: Episode[] = [];
  itemsPerPage: number = 20;
  currentPage: number = 1;
  paginatedEpisodes: any[] = [];
  totalPages: number = 1;
  loading: boolean;

  constructor(private episodeService: EpisodeService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;

    this.episodeService.loadEpisodes(this.currentPage).subscribe((episodes) => {
      this.episodes = episodes;
      this.totalPages = Math.ceil(this.episodes.length / this.itemsPerPage);
      this.updatePaginatedItems();
      this.loading = false;
    });
  }
  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEpisodes = this.episodes.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  navigate(id: number): void {
    this.router.navigate(['/episodes', id]);
  }
}

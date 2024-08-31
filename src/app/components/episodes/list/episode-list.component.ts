import { Component, Input, OnInit } from '@angular/core';
import { EpisodeService } from '../../../shared/services/episode.service';
import { Episode } from '../../../shared/interfaces/episode';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-episode-list',
  templateUrl: './episode-list.component.html',
})
export class EpisodeListComponent implements OnInit {
  episodes: Episode[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private episodeService: EpisodeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEpisodes();
  }

  loadEpisodes(): void {
    let params = new HttpParams().set('page', this.currentPage.toString());
    this.episodeService.fetchEpisodes(params).subscribe((response) => {
      this.episodes = response.results;
      this.totalPages = response.info.pages;
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadEpisodes();
  }

  navigate(id: number): void {
    this.router.navigate(['/episodes', id]);
  }
}

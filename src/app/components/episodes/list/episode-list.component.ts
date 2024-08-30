import { Component, Input, OnInit } from '@angular/core';
import { EpisodeService } from '../../../shared/services/episode.service';
import { Episode } from '../../../shared/interfaces/episode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-episode-list',
  templateUrl: './episode-list.component.html',
})
export class EpisodeListComponent implements OnInit {
  @Input()
  episodes: Episode[];

  constructor(private episodeService: EpisodeService, private router: Router) {}

  ngOnInit(): void {
    let params = '';
    this.episodeService.fetchEpisodes(params).subscribe((response) => {
      this.episodes = response.results;
    });
  }

  navigate(id: number) {
    this.router.navigate(['/episodes', id]);
  }
}

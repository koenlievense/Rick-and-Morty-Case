import { Component, Input, OnInit } from '@angular/core';
import { EpisodeService } from '../../../shared/services/episode.service';
import { HttpParams } from '@angular/common/http';
import { Episode } from '../../../shared/interfaces/episode';

@Component({
  selector: 'episode-list',
  templateUrl: './episode-list.component.html',
})
export class EpisodeListComponent implements OnInit {
  @Input()
  episodes: Episode[];

  constructor(private episodeService: EpisodeService) {}

  ngOnInit(): void {
    let params = '';
    this.episodeService.fetchEpisodes(params).subscribe((response) => {
      this.episodes = response.results;
    });
  }
}

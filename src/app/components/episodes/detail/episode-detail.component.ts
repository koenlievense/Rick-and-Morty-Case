import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { EpisodeService } from '../../../shared/services/episode.service';
import { Episode } from '../../../shared/interfaces/episode';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-episode-detail',
  templateUrl: './episode-detail.component.html',
})
export class EpisodeDetailComponent {
  characters: CharacterWithDimension[] = [];
  episode: Episode;
  episodeId: number | null = null;

  constructor(
    private episodeService: EpisodeService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeEpisodeId();
  }

  private initializeEpisodeId(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.episodeId = idParam !== null ? Number(idParam) : null;

      if (this.episodeId !== null) {
        this.loadEpisodeData();
      }
    });
  }

  private loadEpisodeData(): void {
    if (this.episodeId === null) return;

    this.episodeService
      .fetchEpisodeById(this.episodeId)
      .subscribe((episode) => {
        this.episode = episode;
        const ids = this.characterService.extractCharacterIds(
          episode.characters
        );

        if (ids.length > 0) {
          this.loadCharacters(ids);
        } else {
          this.characters = [];
        }
      });
  }

  private loadCharacters(ids: number[]): void {
    this.characterService
      .fetchCharactersByIdsWithDimensions(ids)
      .subscribe((characters) => {
        if (Array.isArray(characters)) {
          this.characters = characters;
        } else if (characters && typeof characters === 'object') {
          this.characters = [characters];
        } else {
          this.characters = [];
        }
      });
  }

  goBack() {
    this.router.navigate(['/episodes']);
  }
}

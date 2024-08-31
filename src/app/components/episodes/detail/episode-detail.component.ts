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
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.episodeId = idParam !== null ? Number(idParam) : null;

      if (this.episodeId !== null) {
        this.episodeService
          .fetchEpisodeById(this.episodeId)
          .subscribe((episode) => {
            this.episode = episode;

            const ids = episode.characters.map((c) => {
              const match = c.match(/\d+$/)!;
              return parseInt(match[0], 10);
            });

            if (ids.length > 0) {
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
            } else {
              this.characters = [];
            }
          });
      }
    });
  }

  goBack() {
    this.router.navigate(['/episodes']);
  }
}

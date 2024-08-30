import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { Character } from '../../../shared/interfaces/character';
import { EpisodeService } from '../../../shared/services/episode.service';

@Component({
  selector: 'app-episode-detail',
  templateUrl: './episode-detail.component.html',
})
export class EpisodeDetailComponent {
  characters: Character[] = [];
  episodeId: number | null = null;

  constructor(
    private episodeService: EpisodeService,
    private characterService: CharacterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.episodeId = idParam !== null ? Number(idParam) : null;

      if (this.episodeId !== null) {
        this.episodeService
          .fetchEpisodeById(this.episodeId)
          .subscribe((episode) => {
            const ids = episode.characters.map((c) => {
              const match = c.match(/\d+$/)!;
              return parseInt(match[0], 10);
            });

            this.characterService
              .fetchCharactersByIds(ids)
              .subscribe((characters) => {
                this.characters = characters;
              });
          });
      }
    });
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';
import { Episode } from '../../../shared/interfaces/episode';
import { EpisodeService } from '../../../shared/services/episode.service';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
})
export class CharacterDetailComponent {
  character: CharacterWithDimension;
  currentPage: number = 1;
  paginatedEpisodes: Episode[] = [];
  totalPages: number = 1;

  private characterId: number | null = null;
  private episodes: Episode[];
  private itemsPerPage: number = 15;

  constructor(
    private characterService: CharacterService,
    private episodeService: EpisodeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeCharacterId();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  goBack() {
    this.router.navigate(['/characters']);
  }

  private initializeCharacterId(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.characterId = idParam !== null ? Number(idParam) : null;

      if (this.characterId !== null) {
        this.loadCharacterData();
      }
    });
  }

  private loadCharacterData(): void {
    if (this.characterId === null) return;

    this.characterService
      .fetchCharactersByIdsWithDimensions([this.characterId])
      .subscribe((character) => {
        this.character = character[0];
        const ids = this.characterService.extractCharacterIds(
          this.character.episode
        );

        if (ids.length > 0) {
          this.loadEpisodes(ids);
        } else {
          this.episodes = [];
        }
      });
  }

  private loadEpisodes(ids: number[]) {
    this.episodeService.fetchEpisodesByIds(ids).subscribe((episodes) => {
      if (Array.isArray(episodes)) {
        this.episodes = episodes;
        this.totalPages = Math.ceil(this.episodes.length / this.itemsPerPage);
        this.updatePaginatedItems();
      } else if (episodes && typeof episodes === 'object') {
        this.paginatedEpisodes = [episodes];
      } else {
        this.paginatedEpisodes = [];
      }
    });
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEpisodes = this.episodes.slice(startIndex, endIndex);
  }
}

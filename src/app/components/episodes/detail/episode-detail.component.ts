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
  episode: Episode;
  currentPage: number = 1;
  paginatedCharacters: CharacterWithDimension[] = [];
  totalPages: number = 1;
  loading: boolean;

  private characters: CharacterWithDimension[] = [];
  private episodeId: number | null = null;
  private itemsPerPage: number = 20;

  constructor(
    private episodeService: EpisodeService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeEpisodeId();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  goBack() {
    this.router.navigate(['/episodes']);
  }

  private initializeEpisodeId(): void {
    this.loading = true;

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
          this.totalPages = Math.ceil(
            this.characters.length / this.itemsPerPage
          );
          this.updatePaginatedItems();
          this.loading = false;
        } else if (characters && typeof characters === 'object') {
          this.characters = [characters];
        } else {
          this.characters = [];
        }
      });
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCharacters = this.characters.slice(startIndex, endIndex);
  }
}

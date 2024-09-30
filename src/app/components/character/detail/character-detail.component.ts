import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
})
export class CharacterDetailComponent {
  character: CharacterWithDimension;
  characterId: number | null = null;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeCharacterId();
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
      });
  }

  goBack() {
    this.router.navigate(['/characters']);
  }
}

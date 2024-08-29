import { CharacterLocation } from './character-location';
import { ResourceBase } from './resource-base';

export interface Character extends ResourceBase {
  episode: string[];
  gender: 'unkown' | 'Female' | 'Male' | 'Genderless';
  image: string;
  location: CharacterLocation;
  origin: CharacterLocation;
  species: string;
  status: 'Dead' | 'Alive' | 'unknown';
  type: string;
}

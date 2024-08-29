import { ResourceBase } from './resource-base';

export interface Episode extends ResourceBase {
  air_date: string;
  characters: string[];
  episode: string;
}

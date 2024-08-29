import { ResourceBase } from './resource-base';

export interface Location extends ResourceBase {
  dimension: string;
  residents: string[];
  type: string;
}

export interface Dimension {
  id: number;
  name: string;
  locations: string[];
  characters: Set<number>;
}

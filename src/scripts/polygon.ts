export interface Coord {
  x: number;
  y: number;
}

export default class Polygon {
  constructor(private readonly points: Array<Coord>) {}
}

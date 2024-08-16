interface IPosition {
  xPos: number;
  yPos: number;
}

interface ITilePosition {
  gx: number;
  gy: number;
}

interface IEntitySize {
  height: number;
  width: number;
}

export type { IEntitySize, IPosition, ITilePosition };

import Entity, { type IEntity } from "./entity";

interface ITileEntity extends IEntity {
  isWalkable?: boolean;
}

class TileEntity extends Entity {
  private readonly isWalkable: boolean;

  public constructor({ isWalkable, ...rest }: Readonly<ITileEntity>) {
    super(rest);

    this.isWalkable = isWalkable ?? false;
  }

  public isTileWalkable(): boolean {
    return this.isWalkable;
  }
}

export type { ITileEntity };

export default TileEntity;

import TileEntity, { type ITileEntity } from "../entities/tileEntity";

interface ITile extends ITileEntity {}

class Tile extends TileEntity {
  public constructor(props: Readonly<ITile>) {
    super(props);
  }
}

export type { ITile };

export default Tile;

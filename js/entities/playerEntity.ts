import Entity, { type IEntity } from "./entity";

// eslint-disable-next-line putout/putout
type IPlayerEntity = IEntity;

class PlayerEntity extends Entity {
  public constructor(props: Readonly<IPlayerEntity>) {
    super(props);
  }
}

export type { IPlayerEntity };

export default PlayerEntity;

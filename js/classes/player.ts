import PlayerEntity, { type IPlayerEntity } from "../entities/playerEntity";
import type { IPosition } from "../types";

type IPlayer = Omit<IPlayerEntity, "id" | "position">;

const position: Readonly<IPosition> = {
  xPos: 0,
  yPos: 0,
};

class Player extends PlayerEntity {
  private exp = 0;

  public constructor(props: Readonly<IPlayer>) {
    super({
      ...props,
      id: "player",
      position,
    });
  }

  public getExp(): number {
    return this.exp;
  }

  private setExp(exp: number): void {
    this.exp = exp;
  }

  private addExp(exp: number): void {
    this.setExp(this.exp + exp);
  }
}

export default Player;

import PlayerEntity, { type IPlayerEntity } from "../entities/playerEntity";
import type { ITilePosition } from "../types";
import { TWO } from "../utils/constants";
import { calculateHexagonPosition } from "../utils/positionHelpers";
import type MapClass from "./map";

interface IPlayer extends Omit<IPlayerEntity, "id" | "position"> {
  map?: MapClass;
}

const position: Readonly<ITilePosition> = {
  gx: 0,
  gy: 0,
};

class Player extends PlayerEntity {
  private exp = 0;

  private map?: MapClass;

  public constructor({ ...props }: Readonly<IPlayer>) {
    super({
      ...props,
      id: "player",
      position,
    });
  }

  public draw(): void {
    console.log("draw player");

    if (this.map) {
      const { gx, gy } = this.getPosition();

      console.log(gx, gy);

      const { xPos, yPos } = calculateHexagonPosition(
        gx,
        gy,
        this.map.getCameraPosition(),
      );

      console.log(xPos, yPos);

      const { height, width } = this.getSize();

      this.getCanvas()
        .getContext("2d")
        ?.fillRect(xPos - width / TWO, yPos - height / TWO, width, height);
    }
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

  public setMap(map: MapClass): void {
    this.map = map;
  }

  public getMap(): MapClass | undefined {
    return this.map;
  }
}

export default Player;

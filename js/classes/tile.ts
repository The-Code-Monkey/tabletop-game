import TileEntity, { type ITileEntity } from "../entities/tileEntity";
import {
  HEXAGON_SIDES,
  ONE_POINT_EIGHT,
  THREE,
  TILE_SIZE,
  TWO,
  ZERO,
} from "../utils/constants";
import { calculateHexagonPosition } from "../utils/positionHelpers";
import type MapClass from "./map";

interface ITile extends ITileEntity {
  map: MapClass;
  texture: string;
}

class Tile extends TileEntity {
  private readonly texture: string;

  private pattern?: CanvasPattern | null;

  private readonly map: MapClass;

  public constructor({ map, texture, ...props }: Readonly<ITile>) {
    super(props);

    this.texture = texture;
    this.map = map;

    this.init();
  }

  public init(): void {
    const ctx = this.getCanvas().getContext("2d");

    const { texture } = this;

    const img = new Image();

    img.src = texture;

    img.addEventListener("load", () => {
      if (ctx) {
        this.pattern = ctx.createPattern(img, "repeat");
        this.draw();
      }
    });
  }

  public async draw(): Promise<void> {
    const { gx, gy } = this.getPosition();
    const cameraPosition = this.map.getCameraPosition();
    const { xPos, yPos } = calculateHexagonPosition(gx, gy, cameraPosition);
    const ctx = this.getCanvas().getContext("2d");

    if (ctx) {
      const radius = TILE_SIZE / ONE_POINT_EIGHT;
      const angleStep = Math.PI / THREE;

      // eslint-disable-next-line max-statements
      await new Promise<void>((resolve) => {
        ctx.beginPath();
        ctx.fillStyle = this.pattern ?? "black";
        ctx.fill();

        // Start from the top point
        for (let index = ZERO; index < HEXAGON_SIDES; index += 1) {
          const angle = angleStep * index - Math.PI / TWO; // Offset by 90 degrees to start from the top
          const vertexX = xPos + radius * Math.cos(angle);
          const vertexY = yPos + radius * Math.sin(angle);

          if (index === ZERO) {
            ctx.moveTo(vertexX, vertexY);
          } else {
            ctx.lineTo(vertexX, vertexY);
          }
        }

        ctx.closePath();

        // fill the hexagon with /img/tiles/grass.svg
        ctx.fill();
        ctx.stroke();
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(`gx: ${xPos}, gy: ${yPos}`, xPos, yPos);
        ctx.stroke();

        // set border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();
        resolve();
      });
    }
  }
}

export type { ITile };

export default Tile;

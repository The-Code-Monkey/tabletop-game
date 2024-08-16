import type { IPosition } from "../types";
import {
  CANVAS_BACKGROUND_COLOR,
  CANVAS_PADDING,
  EIGHT,
  MAP_HEIGHT,
  MAP_WIDTH,
  OFFSCREEN_THRESHOLD,
  TILE_SIZE,
  TWO,
  ZERO,
} from "../utils/constants";
import type Player from "./player";
import Tile from "./tile";

interface IMap {
  canvas: HTMLCanvasElement;
  entityCanvas?: HTMLCanvasElement;
  players?: Player[];
  room?: string;
}

class MapClass {
  private readonly canvas: HTMLCanvasElement;

  private readonly entityCanvas?: HTMLCanvasElement;

  private readonly room?: string;

  private readonly players?: Player[];

  private tiles: Tile[] = [];

  private readonly cameraPosition: IPosition = {
    xPos: ZERO,
    yPos: ZERO,
  };

  private isDragging = false;

  private dragStart: IPosition = {
    xPos: ZERO,
    yPos: ZERO,
  };

  private readonly pattern?: CanvasPattern | null;

  private initialCameraPosition: IPosition = {
    xPos: ZERO,
    yPos: ZERO,
  };

  public constructor({ canvas, entityCanvas, players, room }: IMap) {
    this.canvas = canvas;
    this.entityCanvas = entityCanvas;
    this.room = room;
    this.players = players;
    this.addEventListeners();

    document.addEventListener("DOMContentLoaded", () => {
      void this.draw();

      for (const player of this.players ?? []) {
        player.draw();
      }
    });
  }

  private addEventListeners(): void {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvas.addEventListener("mouseleave", this.onMouseUp.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStart = {
      xPos: event.clientX,
      yPos: event.clientY,
    };
    this.initialCameraPosition = { ...this.cameraPosition };
  }

  private onMouseUp(): void {
    this.isDragging = false;
  }

  private setCameraPosition(xPos: number, yPos: number): void {
    this.cameraPosition.xPos = xPos;
    this.cameraPosition.yPos = yPos;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }

    const dx = event.clientX - this.dragStart.xPos;
    const dy = event.clientY - this.dragStart.yPos;

    this.setCameraPosition(
      this.initialCameraPosition.xPos - dx,
      this.initialCameraPosition.yPos - dy,
    );

    void this.draw();

    // Redraw the canvas with the new camera position
    this.entityCanvas
      ?.getContext("2d")
      ?.clearRect(
        ZERO,
        ZERO,
        this.entityCanvas.width,
        this.entityCanvas.height,
      );

    for (const player of this.players ?? []) {
      player.draw();
    }
  }

  private calculateHexagonPosition(gx: number, gy: number): IPosition {
    let xPos =
      gx * TILE_SIZE +
      TILE_SIZE / TWO +
      CANVAS_PADDING -
      this.cameraPosition.xPos;

    let yPos =
      gy * TILE_SIZE +
      TILE_SIZE / TWO +
      CANVAS_PADDING -
      this.cameraPosition.yPos;

    if (ZERO === gy % TWO) {
      xPos += TILE_SIZE / TWO;
    }

    if (gy > ZERO) {
      yPos -= (TILE_SIZE * gy) / EIGHT;
    }

    return {
      xPos,
      yPos,
    };
  }

  private isHexagonOffscreen(
    ctx: CanvasRenderingContext2D,
    xPos: number,
    yPos: number,
  ): boolean {
    const { canvas } = ctx;
    const { height, width } = canvas;

    return (
      xPos < -OFFSCREEN_THRESHOLD ||
      xPos > width + OFFSCREEN_THRESHOLD ||
      yPos < -OFFSCREEN_THRESHOLD ||
      yPos > height + OFFSCREEN_THRESHOLD
    );
  }

  private clearCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = String(CANVAS_BACKGROUND_COLOR);
    ctx.fillRect(ZERO, ZERO, this.canvas.width, this.canvas.height);
  }

  private resizeCanvas(ctx: CanvasRenderingContext2D): void {
    const { innerHeight: height, innerWidth: width } = window;

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.canvas.style.backgroundColor = String(CANVAS_BACKGROUND_COLOR);
  }

  public getCameraPosition(): IPosition {
    return this.cameraPosition;
  }

  private async drawGrid(ctx: CanvasRenderingContext2D): Promise<void> {
    const tiles: Tile[] = [];

    if (this.tiles.length === 0) {
      for (let gy = ZERO; gy < MAP_HEIGHT; gy += 1) {
        for (let gx = ZERO; gx < MAP_WIDTH; gx += 1) {
          const { xPos, yPos } = this.calculateHexagonPosition(gx, gy);

          // Check if the hexagon is more than 300px offscreen
          if (!this.isHexagonOffscreen(ctx, xPos, yPos)) {
            tiles.push(
              new Tile({
                canvas: this.canvas,
                id: `${gx}-${gy}`,
                map: this,

                name: "Grass Tile",

                position: {
                  gx,
                  gy,
                },

                size: {
                  height: TILE_SIZE,
                  width: TILE_SIZE,
                },

                texture: "/img/tiles/grass.png",
              }),
            );
          }
        }
      }

      this.tiles = tiles;
    }

    const promises = this.tiles.map(async (tile) => {
      await tile.draw();
    });

    await Promise.all(promises);
  }

  public async draw(): Promise<void> {
    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context not found");
    }

    this.clearCanvas(ctx);
    this.resizeCanvas(ctx);

    await this.drawGrid(ctx);

    document.querySelector("#root")?.append(this.canvas);
  }
}

export default MapClass;

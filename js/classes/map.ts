import type { IPosition } from "../types";
import {
  CANVAS_BACKGROUND_COLOR,
  CANVAS_PADDING,
  EIGHT,
  HEXAGON_SIDES,
  MAP_HEIGHT,
  MAP_WIDTH,
  OFFSCREEN_THRESHOLD,
  ONE_POINT_EIGHT,
  THREE,
  TILE_SIZE,
  TWO,
  ZERO,
} from "../utils/constants";
import type Player from "./player";

interface IMap {
  canvas: HTMLCanvasElement;
  player?: Player;
  room?: string;
}

class MapClass {
  private readonly canvas: HTMLCanvasElement;

  private readonly room?: string;

  private readonly player?: Player;

  private readonly cameraPosition: IPosition = {
    xPos: ZERO,
    yPos: ZERO,
  };

  private isDragging = false;

  private dragStart: IPosition = {
    xPos: ZERO,
    yPos: ZERO,
  };

  private initialCameraPosition: IPosition = {
    xPos: ZERO,
    yPos: ZERO,
  };

  public constructor({ canvas, player, room }: IMap) {
    this.canvas = canvas;
    this.room = room;
    this.player = player;
    this.addEventListeners();
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

    void this.draw(); // Redraw the canvas with the new camera position
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

  private async drawHexagon(
    ctx: CanvasRenderingContext2D,
    xPos: number,
    yPos: number,
  ): Promise<void> {
    const radius = TILE_SIZE / ONE_POINT_EIGHT;
    const angleStep = Math.PI / THREE;

    // eslint-disable-next-line max-statements
    await new Promise<void>((resolve) => {
      ctx.beginPath();

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
      ctx.fillStyle = "green";
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

  private async drawGrid(ctx: CanvasRenderingContext2D): Promise<void> {
    const promises: Promise<void>[] = [];

    for (let gy = ZERO; gy < MAP_HEIGHT; gy += 1) {
      for (let gx = ZERO; gx < MAP_WIDTH; gx += 1) {
        const { xPos, yPos } = this.calculateHexagonPosition(gx, gy);

        // Check if the hexagon is more than 300px offscreen
        if (!this.isHexagonOffscreen(ctx, xPos, yPos)) {
          promises.push(this.drawHexagon(ctx, xPos, yPos));
        }
      }
    }

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

    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector("#root")?.append(this.canvas);
    });
  }
}

export default MapClass;

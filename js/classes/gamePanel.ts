import {
  CANVAS_BACKGROUND_COLOR,
  TICK_RATE,
  TILE_SIZE,
  TWO,
} from "../utils/constants";
import MapClass from "./map";
import Player from "./player";

interface IGamePanel {
  name: string;
  room?: string;
}

class GamePanel {
  private readonly mapCanvas: HTMLCanvasElement;

  private readonly canvas: HTMLCanvasElement;

  private readonly players: Player[];

  private readonly room?: string;

  private readonly map: MapClass;

  private readonly isTickPaused = false;

  public constructor({ name, room }: Readonly<IGamePanel>) {
    this.mapCanvas = document.createElement("canvas");
    this.mapCanvas.id = "map";
    this.canvas = document.createElement("canvas");
    this.canvas.id = "game";
    this.players = [
      new Player({
        canvas: this.canvas,
        name,

        size: {
          height: TILE_SIZE / TWO,
          width: TILE_SIZE / TWO,
        },
      }),
    ];
    this.room = room;
    this.map = new MapClass({
      canvas: this.mapCanvas,
      entityCanvas: this.canvas,
      players: this.players,
      room,
    });

    const { innerHeight: height, innerWidth: width } = window;
    const ctx = this.canvas.getContext("2d");

    if (ctx) {
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.canvas.style.backgroundColor = String(CANVAS_BACKGROUND_COLOR);
      document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#root")?.append(this.canvas);
      });

      void this.map.draw();

      for (const player of this.players) {
        player.setMap(this.map);
      }

      setInterval(() => {
        if (!this.isTickPaused) {
          this.tick();
        }
      }, TICK_RATE);
    }
  }

  // runs once every 60 seconds
  public tick(): void {
    console.log("tick start");

    console.log("tick end");
  }
}

export default GamePanel;

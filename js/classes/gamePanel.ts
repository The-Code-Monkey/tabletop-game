import { TICK_RATE } from "../utils/constants";
import MapClass from "./map";
import Player from "./player";

interface IGamePanel {
  name: string;
  room?: string;
}

class GamePanel {
  private readonly canvas: HTMLCanvasElement;

  private readonly player: Player;

  private readonly room?: string;

  private readonly map: MapClass;

  public constructor({ name, room }: Readonly<IGamePanel>) {
    this.canvas = document.createElement("canvas");
    this.player = new Player({
      name,
    });
    this.room = room;
    this.map = new MapClass({
      canvas: this.canvas,
      player: this.player,
      room,
    });

    void this.tick();

    // run tick every 60 seconds
    setInterval(() => {
      void this.tick.bind(undefined);
    }, TICK_RATE);
  }

  // runs once every 60 seconds
  public async tick(): Promise<void> {
    console.log("tick start");

    await this.map.draw();

    console.log("tick end");
  }
}

export default GamePanel;

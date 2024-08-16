import type { IEntitySize, ITilePosition } from "../types";
import { ZERO } from "../utils/constants";

interface IEntity {
  canvas: HTMLCanvasElement;
  id: string;
  name: string;
  position: ITilePosition;
  size: IEntitySize;
}

class Entity {
  public static fromJson(data: Readonly<IEntity>): Entity {
    return new Entity(data);
  }

  private readonly canvas: HTMLCanvasElement;

  private readonly id: string;

  private readonly name: string;

  private size: IEntitySize = {
    height: ZERO,
    width: ZERO,
  };

  private position: ITilePosition = {
    gx: ZERO,
    gy: ZERO,
  };

  private texture?: string;

  public constructor({ canvas, id, name, position, size }: Readonly<IEntity>) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.canvas = canvas;
    this.size = size;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPosition(): ITilePosition {
    return this.position;
  }

  public getTexture(): string | undefined {
    return this.texture;
  }

  public setTexture(texture: string): void {
    this.texture = texture;
  }

  public setPosition(position: ITilePosition): void {
    this.position = position;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getSize(): IEntitySize {
    return this.size;
  }

  public setSize(size: IEntitySize): void {
    this.size = size;
  }

  public update(): void {
    // Update the entity
  }

  public render(): void {
    // Render the entity
  }

  public destroy(): void {
    // Destroy the entity
  }

  public toJson(): Omit<IEntity, "canvas"> {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      size: this.size,
    };
  }
}

export type { IEntity };
export default Entity;

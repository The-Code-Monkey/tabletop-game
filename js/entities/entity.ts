import type { IPosition } from "../types";

interface IEntity {
  id: string;
  name: string;
  position: IPosition;
}

class Entity {
  public static fromJson(data: Readonly<IEntity>): Entity {
    return new Entity(data);
  }

  private readonly id: string;

  private readonly name: string;

  private position: Readonly<{
    xPos: number;
    yPos: number;
  }>;

  private texture?: string;

  public constructor({ id, name, position }: Readonly<IEntity>) {
    this.id = id;
    this.name = name;
    this.position = position;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPosition(): IPosition {
    return this.position;
  }

  public getTexture(): string | undefined {
    return this.texture;
  }

  public setTexture(texture: string): void {
    this.texture = texture;
  }

  public setPosition(position: IPosition): void {
    this.position = position;
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

  public toJson(): IEntity {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
    };
  }
}

export type { IEntity };
export default Entity;

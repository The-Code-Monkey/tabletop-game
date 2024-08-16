import type { IPosition } from "../types";
import { CANVAS_PADDING, EIGHT, TILE_SIZE, TWO, ZERO } from "./constants";

const calculateHexagonCenter = (gx: number, gy: number): IPosition => {
  const xPos = gx * TILE_SIZE + TILE_SIZE / TWO + CANVAS_PADDING;
  const yPos = gy * TILE_SIZE + TILE_SIZE / TWO + CANVAS_PADDING;

  if (ZERO === gy % TWO) {
    return {
      xPos,
      yPos,
    };
  }

  return {
    xPos: xPos + TILE_SIZE / TWO,
    yPos,
  };
};

const calculateHexagonPosition = (
  gx: number,
  gy: number,
  cameraPosition: IPosition,
): IPosition => {
  let xPos =
    gx * TILE_SIZE + TILE_SIZE / TWO + CANVAS_PADDING - cameraPosition.xPos;

  let yPos =
    gy * TILE_SIZE + TILE_SIZE / TWO + CANVAS_PADDING - cameraPosition.yPos;

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
};

export { calculateHexagonCenter, calculateHexagonPosition };

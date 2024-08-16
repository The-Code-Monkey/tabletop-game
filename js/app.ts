import GamePanel from "./classes/gamePanel";

function main() {
  const gamePanel = new GamePanel({
    name: "Player 1",
    room: "Room 1",
  });

  console.log(gamePanel);
}

main();

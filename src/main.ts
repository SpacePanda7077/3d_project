import { Engine } from "babylonjs";
import { Game } from "./game";
import { GameOver } from "./gameOver";

const canvas = document.getElementById("render_canvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

let currentScene;
currentScene = new GameOver(canvas, engine);

engine.runRenderLoop(() => {
  currentScene.getScene().render();
});

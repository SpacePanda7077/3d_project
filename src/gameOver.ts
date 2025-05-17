import {
  Engine,
  HemisphericLight,
  Scene,
  TimerState,
  UniversalCamera,
  Vector3,
} from "babylonjs";

import {
  AdvancedDynamicTexture,
  Button,
  type IAdvancedDynamicTextureOptions,
} from "@babylonjs/gui";

export class GameOver {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  camera: UniversalCamera;
  light: HemisphericLight;
  constructor(canvas: HTMLCanvasElement, engine: Engine) {
    this._canvas = canvas;
    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);

    this.camera = new UniversalCamera(
      "gameOverCam",
      Vector3.Zero(),
      this._scene
    );

    this.light = new HemisphericLight(
      "light",
      new Vector3(1, 1, 0),
      this._scene
    );

    const GameOverUI = AdvancedDynamicTexture.CreateFullscreenUI(
      "GameOverUI",
      true,
      this._scene as IAdvancedDynamicTextureOptions
    );

    const text = Button.CreateSimpleButton("Exit", "Exit");
    text.width = "150px";
    text.height = "50px";
    text.color = "white";
    text.background = "green";
    text.onPointerClickObservable.add(() => {
      console.log("go to main menu");
    });
    GameOverUI.addControl(text);
  }

  getScene() {
    return this._scene;
  }
}

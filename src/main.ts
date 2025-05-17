import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  TimerState,
  UniversalCamera,
  Vector3,
} from "babylonjs";

const canvas: HTMLCanvasElement | any =
  document.getElementById("render_canvas");

const State = { Start: 0, Game: 1, Lose: 2, CutScene: 3 };

class Game {
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _state: number = State.Start;
  camera: UniversalCamera;
  light1: HemisphericLight;
  sphere: import("babylonjs").Mesh;
  constructor() {
    this._canvas = canvas;
    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);

    this.light1 = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      this._scene
    );

    this.sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      this._scene
    );

    this.camera = new UniversalCamera(
      "cam1",
      new Vector3(0, 0, 5),
      this._scene
    );
    this.camera.setTarget(
      new Vector3(
        this.sphere.position.x,
        this.sphere.position.y,
        this.sphere.position.z - 5
      )
    );
    this.camera.attachControl(true);
    this.camera.rotation._y = 0;
    this.camera.position = new Vector3(0, 1, -5);
    console.log(this.camera.rotation);

    window.addEventListener("keydown", (event) => {
      if (event.key === "d") {
        this.sphere.position.x += 1;
      }
      if (event.key === "a") {
        this.sphere.position.x -= 1;
      }
      if (event.key === "w") {
        this.sphere.position.z += 1;
      }
      if (event.key === "s") {
        this.sphere.position.z -= 1;
      }
    });

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }
}

new Game();

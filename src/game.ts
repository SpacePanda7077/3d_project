import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  UniversalCamera,
  Vector3,
} from "babylonjs";

import * as GUI from "@babylonjs/gui";

export class Game {
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  camera: UniversalCamera;
  light1: HemisphericLight;
  sphere: import("babylonjs").Mesh;
  ground: import("babylonjs").GroundMesh;
  constructor(canvas: HTMLCanvasElement, engine: Engine) {
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
    this.sphere.position = new Vector3(0, 2, 0);

    this.camera = new UniversalCamera(
      "cam1",
      new Vector3(0, 0, 5),
      this._scene
    );
    this.camera.attachControl(true);
    this.camera.rotation._y = 0;
    this.camera.position = new Vector3(0, 1, -5);

    this.ground = MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 20 },
      this._scene
    );

    const MenuGUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "UI",
      true,
      this._scene as GUI.IAdvancedDynamicTextureOptions
    );
    const button = GUI.Button.CreateSimpleButton("start", "Start");
    button.width = "150px";
    button.height = "50px";
    button.color = "white";
    button.background = "green";
    button.onPointerClickObservable.add(() => {
      console.log("pointer down");
    });
    MenuGUI.addControl(button);

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
  }
  getScene() {
    return this._scene;
  }
}

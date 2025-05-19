import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  UniversalCamera,
  Vector3,
} from "babylonjs";
import RAPIER from "@dimforge/rapier3d-compat";

import * as GUI from "@babylonjs/gui";
import { Player } from "./classes/player";

export class Game {
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  camera: UniversalCamera;
  light1: HemisphericLight;

  ground!: import("babylonjs").GroundMesh;
  world!: RAPIER.World;

  groundBody!: RAPIER.RigidBodyDesc;
  groundRigidBody!: RAPIER.RigidBody;
  velocity!: RAPIER.Vector3;
  player!: Player;

  constructor(canvas: HTMLCanvasElement, engine: Engine) {
    this._canvas = canvas;
    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);

    this.light1 = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      this._scene
    );

    this.camera = new UniversalCamera(
      "cam1",
      new Vector3(0, 0, 5),
      this._scene
    );
    this.camera.attachControl(true);
    this.camera.rotation._y = 0;
    this.camera.position = new Vector3(0, 1, -5);

    this.addMenu();

    this.initializePhysics();
  }
  async initializePhysics() {
    await RAPIER.init();
    this.world = new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0));
    this.velocity = new RAPIER.Vector3(0, 0, 0);
    this.createStaticObj();
    this.player = new Player(this._scene, this.world);
    //this.handleMovement();

    this._engine.runRenderLoop(() => {
      this.world?.step();
      this.syncMeshes();
      this.player.sync();
      this.player.handleMovement();
      this.player.movePlayer(this._engine);
      this._scene.render();
    });
  }

  createStaticObj() {
    this.ground = MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 20 },
      this._scene
    );
    this.groundBody = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Fixed);
    this.groundRigidBody = this.world.createRigidBody(this.groundBody);

    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.1, 10);
    this.world.createCollider(groundColliderDesc, this.groundRigidBody);
  }
  syncMeshes() {
    // ground syncing ............................................................//
    const groundPos = this.groundRigidBody.translation();
    const groundRot = this.groundRigidBody.rotation();
    this.ground.position.set(groundPos.x, groundPos.y, groundPos.z);
    this.ground.rotationQuaternion?.set(
      groundRot.x,
      groundRot.y,
      groundRot.z,
      groundRot.w
    );
  }

  addMenu() {
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
  }

  getScene() {
    return this._scene;
  }
}

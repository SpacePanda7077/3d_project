import { Engine, MeshBuilder, Scene, Vector3 } from "babylonjs";

import RAPIER from "@dimforge/rapier3d-compat";

export class Player {
  player!: import("babylonjs").Mesh;
  playerRigidBodyDesc!: RAPIER.RigidBodyDesc;
  playerRigidBody!: RAPIER.RigidBody;
  playerColliderDesc!: RAPIER.ColliderDesc;
  playerCollider!: RAPIER.Collider;
  characterController!: RAPIER.KinematicCharacterController;
  move: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  };
  velocity: RAPIER.Vector3;
  constructor(scene: Scene, world: RAPIER.World) {
    this.move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    };

    this.velocity = new RAPIER.Vector3(0, 0, 0);

    this.createPlayer(scene, world);
  }
  createPlayer(scene: Scene, world: RAPIER.World) {
    this.player = MeshBuilder.CreateBox("player", { size: 1 }, scene);
    this.player.position = new Vector3(0, 1, 0);
    this.playerRigidBodyDesc = new RAPIER.RigidBodyDesc(
      RAPIER.RigidBodyType.KinematicPositionBased
    ).setTranslation(0, 1, 0);
    this.playerRigidBody = world.createRigidBody(this.playerRigidBodyDesc);

    this.playerColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    this.playerCollider = world.createCollider(
      this.playerColliderDesc,
      this.playerRigidBody
    );
    this.characterController = world.createCharacterController(0.02);
    this.characterController.setApplyImpulsesToDynamicBodies(true);
    this.characterController.enableAutostep(0.5, 0.5, true);
    this.characterController.enableSnapToGround(0.5);
  }
  sync() {
    const pos = this.playerRigidBody.translation();
    const rot = this.playerRigidBody.rotation();
    this.player.position = new Vector3(pos.x, pos.y, pos.z);
    this.player.rotationQuaternion?.set(rot.x, rot.y, rot.z, rot.w);
  }

  handleMovement() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "d") {
        this.move.right = true;
      }
      if (event.key === "a") {
        this.move.left = true;
      }
      if (event.key === "w") {
        this.move.forward = true;
      }
      if (event.key === "s") {
        this.move.backward = true;
      }
      if (event.code === "Space") {
        this.move.jump = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.key === "d") {
        this.move.right = false;
      }
      if (event.key === "a") {
        this.move.left = false;
      }
      if (event.key === "w") {
        this.move.forward = false;
      }
      if (event.key === "s") {
        this.move.backward = false;
      }
    });
    window.addEventListener("click", (event) => {});
  }

  movePlayer(engine: Engine) {
    if (this.move.forward) {
      this.velocity.z = 0.1;
    } else if (this.move.backward) {
      this.velocity.z = -0.1;
    } else {
      this.velocity.z = 0;
    }
    if (this.move.right) {
      this.velocity.x = 0.1;
    } else if (this.move.left) {
      this.velocity.x = -0.1;
    } else {
      this.velocity.x = 0;
    }
    const delta = engine.getDeltaTime() / 1000;
    const grounded = this.characterController.computedGrounded();
    if (!grounded) {
      this.velocity.y += -9.81 * delta;
    } else {
      this.velocity.y = 0;
      if (this.move.jump) {
        this.velocity.y = 0.7;
      }
      this.move.jump = false;
    }

    this.characterController.computeColliderMovement(
      this.playerCollider,
      this.velocity
    );
    const movement = this.characterController.computedMovement();

    const curPos = this.playerRigidBody.translation();
    const nexPos = new RAPIER.Vector3(
      curPos.x + movement.x,
      curPos.y + movement.y,
      curPos.z + movement.z
    );
    this.playerRigidBody.setNextKinematicTranslation(nexPos);
  }
}

import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let camera, scene, renderer, clock;
let params = {
  snowfall: 10,
};

const maxRange = 1000;
const minRange = maxRange / 2;

const container = document.querySelector("#scene-container");

const aspect = container.clientWidth / container.clientHeight;

clock = new Clock();

class SnowFlakes extends THREE.Object3D {
  constructor() {
    super();
    this.snowList = [];
    this.angle = 0;

    var length = params.snowfall;

    var geometry = new THREE.BufferGeometry();

    var materials = [];

    var textureLoader = new THREE.TextureLoader();
    var sprite1 = textureLoader.load(
      "https://dl.dropbox.com/s/13ec3ht27adnu1l/snowflake1.png?dl=0"
    );
    var sprite2 = textureLoader.load(
      "https://dl.dropbox.com/s/rczse8o8zt5mxe6/snowflake2.png?dl=0"
    );
    var sprite3 = textureLoader.load(
      "https://dl.dropbox.com/s/cs17pph4bu096k7/snowflake3.png?dl=0"
    );
    var sprite4 = textureLoader.load(
      "https://dl.dropbox.com/s/plwtcfvokuoz931/snowflake4.png?dl=0"
    );
    var sprite5 = textureLoader.load(
      "https://dl.dropbox.com/s/uhh77omqdwqo2z5/snowflake5.png?dl=0"
    );

    var vertices = [];
    for (var i = 0; i < length; i++) {
      var x = getRandom(0, 500);
      var y = getRandom(0, 500);
      var z = getRandom(0, 500);
      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    var parameters = [
      ["#FFFFFF", sprite2, getRandom(10, 10)],
      ["#FFFFFF", sprite3, getRandom(10, 15)],
      ["#FFFFFF", sprite1, getRandom(10, 15)],
      ["#FFFFFF", sprite5, getRandom(5, 10)],
      ["#FFFFFF", sprite4, getRandom(5, 10)],
    ];

    for (var i = 0; i < parameters.length; i++) {
      var sprite = parameters[i][1];
      var size = parameters[i][2];
      materials[i] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });

      var particles = new THREE.Points(geometry, materials[i]);
      particles.rotation.x = Math.random() * 360;
      particles.rotation.y = Math.random() * 360;
      particles.rotation.z = Math.random() * 360;
      particles.vx = 0;
      particles.vy = 0;
      particles.material.opacity = 0;

      this.add(particles);
      this.snowList.push(particles);
    }
  }

  update() {
    this.angle += 0.001;

    for (var i = 0; i < this.snowList.length; i++) {
      this.snowList[i].material.opacity += 0.01;
      this.snowList[i].vy -= 1;
      this.snowList[i].vx = Math.sin(this.angle) * Math.cos(this.angle) * 10;

      this.snowList[i].vx *= 0.2;
      this.snowList[i].vy *= 0.6;

      this.snowList[i].position.x += this.snowList[i].vx;
      this.snowList[i].position.y += this.snowList[i].vy;

      if (this.snowList[i].position.y < -1000) {
        this.snowList[i].material.opacity += 0.1;
        this.remove(this.snowList[i]);
        this.snowList.splice(i, 1);
        i -= 1;
        //console.log(this.snowList.length);
      }
    }
  }
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

init();

function init() {
  scene = new Scene();

  var meshList = [];
  var frame = 5;

  scene.fog = new THREE.Fog(0x000036, 0, minRange * 3);

  const fov = 45;
  const near = 0.1;
  const far = 2000;

  camera = new PerspectiveCamera(fov, aspect, near, far);

  camera.position.set(0, -100, 400);
  camera.lookAt(scene.position);
  const geometry = new BoxGeometry(10, 10, 10);

  const material = new MeshBasicMaterial();

  const cube = new Mesh(geometry, material);

  scene.add(cube);
  loadModel();

  renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color(0x000036));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  container.append(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x666666);
  scene.add(ambientLight);
  tick();
  function tick() {
    var mesh = new SnowFlakes();
    scene.add(mesh);
    meshList.push(mesh);
    for (var i = 0; i < meshList.length; i++) {
      meshList[i].update();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);

    frame++;
    if (frame % 2 == 0) {
      return;
    }
  }

  requestAnimationFrame(render);
}

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    "assets/santa_sleigh_reindeer.glb",
    function (gltf) {
      const model = gltf.scene;
      gltf.scene.rotation.set(0, 0, 0);
      gltf.scene.scale.set(5, 5, 5);
      scene.add(gltf.scene);
      model.rotation.x += degToRad(180);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

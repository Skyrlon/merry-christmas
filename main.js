import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  Clock,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

let camera, controls, scene, renderer, mixer, clock;

const container = document.querySelector("#scene-container");

const aspect = container.clientWidth / container.clientHeight;

clock = new Clock();
init();

animate();

function init() {
  scene = new Scene();

  scene.background = new Color("darkblue");

  const fov = 35;
  const near = 0.1;
  const far = 100;

  camera = new PerspectiveCamera(fov, aspect, near, far);

  camera.position.set(10, 5, 30);
  const geometry = new BoxGeometry(1, 1, 1);

  const material = new MeshBasicMaterial();

  const cube = new Mesh(geometry, material);

  scene.add(cube);

  renderer = new WebGLRenderer();

  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  container.append(renderer.domElement);

  const light = new AmbientLight("white", 5);

  light.position.set(10, 10, 10);
  scene.add(light);
}

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  let delta = clock.getDelta();

  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}

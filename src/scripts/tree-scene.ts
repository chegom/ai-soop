import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  CircleGeometry,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

type WindShader = { uniforms: { uTime: { value: number } } };

const windShaders: WindShader[] = [];

function applyWind(material: Material) {
  const standard = material as MeshStandardMaterial;
  if (!standard.isMeshStandardMaterial) return;
  standard.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 _wind;\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float gust = sin(uTime * 1.05 + _wind.g * 6.2831853);
        transformed.x += _wind.r * 0.28 * gust;
        transformed.z += _wind.r * 0.12 * cos(uTime * 0.8 + _wind.g * 6.2831853);
        float flutter = sin(uTime * 2.5 + _wind.g * 17.0);
        transformed.x += _wind.b * 0.07 * flutter;
        transformed.y += _wind.b * 0.04 * cos(uTime * 3.0 + _wind.g * 13.0);`,
      );
    windShaders.push(shader as WindShader);
  };
  standard.customProgramCacheKey = () => 'ai-soop-wind-1';
}

function prepareTree(root: Group) {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    const wind = mesh.geometry.getAttribute('_wind');
    if (!wind) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach(applyWind);
  });
  const box = new Box3().setFromObject(root);
  root.position.y -= box.min.y;
}

export async function startTree(canvas: HTMLCanvasElement, stage: Element) {
  const modelUrl = canvas.dataset.model;
  const basisUrl = canvas.dataset.basis;
  if (!modelUrl || !basisUrl) return;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0xf6f5f1, 1);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;

  const scene = new Scene();
  scene.background = new Color(0xf6f5f1);
  scene.fog = new Fog(0xf3f6f0, 58, 96);

  const camera = new PerspectiveCamera(26, 1, 0.1, 140);
  scene.add(new HemisphereLight(0xfff7ee, 0x8eaa86, 1.05));
  scene.add(new AmbientLight(0xffffff, 0.12));
  const sun = new DirectionalLight(0xfff1d8, 2.35);
  sun.position.set(18, 28, 10);
  scene.add(sun);
  const fill = new DirectionalLight(0xd7e6d4, 0.45);
  fill.position.set(-14, 6, 8);
  scene.add(fill);

  const ktx2 = new KTX2Loader().setTranscoderPath(basisUrl).detectSupport(renderer);
  const loader = new GLTFLoader().setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(modelUrl);
  prepareTree(gltf.scene);

  const spots = [
    { x: 7.5, z: 0, s: 1, rot: 0.25 },
    { x: 18, z: -9, s: 0.62, rot: -0.45 },
    { x: 12, z: -16, s: 0.46, rot: 0.85 },
    { x: 24, z: -6, s: 0.54, rot: 1.7 },
  ];
  const hero = new Group();
  spots.forEach((spot, index) => {
    const tree = index === 0 ? gltf.scene : gltf.scene.clone(true);
    tree.position.x = spot.x;
    tree.position.z = spot.z;
    tree.rotation.y = spot.rot;
    tree.scale.setScalar(spot.s);
    hero.add(tree);
  });
  scene.add(hero);

  const ground = new Mesh(
    new CircleGeometry(26, 64),
    new MeshStandardMaterial({ color: 0xe4eee2, roughness: 1, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(6, 0.01, -4);
  scene.add(ground);

  const heroBox = new Box3().setFromObject(hero.children[0]);
  const size = heroBox.getSize(new Vector3());
  const center = heroBox.getCenter(new Vector3());
  const dist = (size.y / (2 * Math.tan((camera.fov * Math.PI) / 360))) * 0.68;
  const base = new Vector3(center.x - size.x * 1.05, center.y + size.y * 0.02, center.z + dist);
  const look = new Vector3(center.x + size.x * 0.2, center.y + size.y * 0.08, center.z);
  camera.position.copy(base);
  camera.lookAt(look);

  let pointerX = 0;
  let pointerY = 0;
  const onPointer = (event: PointerEvent) => {
    pointerX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
    pointerY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);

  const clockStart = performance.now();
  const tick = () => {
    const time = (performance.now() - clockStart) / 1000;
    for (const shader of windShaders) shader.uniforms.uTime.value = time;
    const drift = Math.sin(time * 0.18);
    camera.position.x = base.x + drift * 0.45 + pointerX * 0.7;
    camera.position.y = base.y + Math.cos(time * 0.13) * 0.12 - pointerY * 0.28;
    camera.lookAt(look);
    renderer.render(scene, camera);
  };

  let onScreen = true;
  const syncLoop = () => {
    const run = onScreen && document.visibilityState === 'visible';
    renderer.setAnimationLoop(run ? tick : null);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      syncLoop();
    },
    { threshold: 0.08 },
  );
  observer.observe(stage);
  document.addEventListener('visibilitychange', syncLoop);

  canvas.hidden = false;
  const still = stage.querySelector('.tree-still');
  if (still instanceof HTMLElement) still.hidden = true;
  stage.setAttribute('data-tree-ready', 'true');
  syncLoop();
}

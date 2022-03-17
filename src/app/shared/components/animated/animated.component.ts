import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  NgZone,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-animated',
  templateUrl: './animated.component.html',
  styleUrls: ['./animated.component.scss'],
})
export class AnimatedComponent implements AfterViewInit {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private planetgeometry: THREE.SphereGeometry;
  private planetsgeometry: THREE.SphereGeometry;
  private planet: THREE.Mesh;
  private controls;
  constructor(private ngZone: NgZone) {
    this.planetgeometry = new THREE.SphereGeometry(
      0.5,
      5000,
      100,
      0.001,
      6.28,
      0,
      3.14
    );
    this.planetsgeometry = new THREE.SphereGeometry(
      0.3,
      5000,
      100,
      0.001,
      6.28,
      0,
      3.14
    );
  }

  ngAfterViewInit(): void {
    this.setUpThree();
    this.setLights();
    this.loadPlanet();
    this.loadPlanets();
    this.setupMovement();
    this.setupControls();
  }

  private setUpThree() {
    // setup canvas and render
    this.canvas = this.rendererCanvas.nativeElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // alpha: true,    // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setClearColor(0x000000, 0.0);
    // this.renderer.setClearColor(0x000000, 0.0);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    // renderer.setClearColor(0x000000, 0.0);
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
    this.setUpSizesView(window.innerWidth, window.innerHeight);
  }

  private setUpSizesView(innerWidth, innerHeight) {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  loadPlanet() {
    const texture = new THREE.TextureLoader().load(
      'assets/img/earth-texture.jpg'
    );
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: new THREE.TextureLoader().load('assets/img/earth-bump.jpg'),
      bumpScale: 0.05,
      specularMap: new THREE.TextureLoader().load('assets/img/earth-spec.jpg'),
      specular: new THREE.Color('grey'),
      alphaMap: new THREE.TextureLoader().load('assets/img/planet.jpg'),
    });
    this.planet = new THREE.Mesh(this.planetgeometry, material);
    this.planet.name = 'earth';

    this.scene.add(this.planet);

    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  private generateRandomNumber(min?: number, max?: number): number {
    if (min) {
      return Math.random() * (max - min) + min;
    }
    let random = Math.floor(Math.random() * 5) + 1;
    random *= Math.round(Math.random()) ? 1 : -1;

    return random;
  }

  loadPlanets() {
    const planetsAmount = 10;

    const counter = [];
    for (let i = 0; i < planetsAmount; i++) {
      const texture = new THREE.TextureLoader().load(
        `assets/img/planet${i}.jpg`
      );
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: new THREE.TextureLoader().load('assets/img/planet.jpg'),
        bumpScale: 0.05,
        specular: new THREE.Color('grey'),
        alphaMap: new THREE.TextureLoader().load('assets/img/planet.jpg'),
      });
      const planet = new THREE.Mesh(this.planetsgeometry, material);
      planet.position.x = Math.round(this.generateRandomNumber(-5, 5));
      planet.position.y = Math.round(this.generateRandomNumber(-2, 5));
      planet.position.z = this.generateRandomNumber();
      planet.name = 'planet';

      // place planets far from earth
      if (
        counter.includes(planet.position.x) ||
        Math.abs(planet.position.x) < 3
      ) {
        console.log(counter);
        planet.position.x += 3;
      }
      counter.push(planet.position.x);
      this.scene.add(planet);
    }
  }

  private setLights() {
    // TODO: solve why galaxy is not appearing
    // galaxy geometry
    const starGeometry = new THREE.SphereGeometry(0.3, 64, 64);
    // galaxy material
    const starMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('../../../../assets/img/galaxy1.png'),
      side: THREE.DoubleSide,
      // transparent: true,
    });
    // galaxy mesh
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.layers.set(1);
    this.scene.add(starMesh);

    this.light = new THREE.AmbientLight(0xffffff, 0.6);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0ffffff, 0.3);
    this.scene.add(hemiLight);
    this.scene.add(this.light);
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupMovement() {
    // setup animations movement
    const clock = new THREE.Clock();
    const tick = () => {
      const time = clock.getElapsedTime();
      window.requestAnimationFrame(tick);
      this.controls.update();
      this.scene.children.forEach((element) => {
        if (element.type === 'Mesh') {
          element.rotation.x += 0.0000001;
          element.rotation.y = 0.2 * time;
        }
      });
      this.renderer.render(this.scene, this.camera);
    };
    tick();
  }

  private setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 2;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1;
    this.controls.maxPolarAngle = Math.PI * 0.8;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
  }
}

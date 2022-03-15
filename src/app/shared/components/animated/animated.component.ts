import { Component, ElementRef, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-animated',
  templateUrl: './animated.component.html',
  styleUrls: ['./animated.component.scss'],
})
export class AnimatedComponent implements AfterViewInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private planet: THREE.Mesh;

  private frameId: number = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.setUpThree();
    this.loadPlanet();
  }

  private setUpThree() {
    // setup canvas and render
    this.canvas = this.rendererCanvas.nativeElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.setUpSizesView(window.innerWidth, window.innerHeight);
  }

  private setUpSizesView(innerWidth, innerHeight) {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  loadPlanet() {
    this.setLights();
    const texture = new THREE.TextureLoader().load('../../../../assets/img/earth-texture.jpg');
    const geometry = new THREE.SphereGeometry(0.5, 500, 100, 0.001, 6.28, 0, 3.14);
    const material = new THREE.MeshBasicMaterial( { map: texture} );
    this.planet = new THREE.Mesh(geometry, material);

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

  private setLights() {
    this.light = new THREE.AmbientLight(0x404040);
    const spotLight = new THREE.SpotLight( 0xffffff );
    this.light.position.z = 10;

    spotLight.position.set( 100, 1000, 100 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    this.scene.add( spotLight );
    this.scene.add(this.light);
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.planet.rotation.x += 0.0000001;
    this.planet.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}

import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from '../../services/facade.service';

import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

declare var $:any;

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit, AfterViewInit{

  public token:string = "";

  constructor(
    private router: Router,
    private facadeService: FacadeService
  ){}

  ngOnInit(): void {
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);

    if(this.token !=""){
      this.router.navigate(["home"]);
    }
  }


  @ViewChild('canvas') private canvasRef: ElementRef;
  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPane: number = 1;

  @Input('farClipping') public farClippingPane: number = 1000;

  //? Scene properties
  private camera: THREE.PerspectiveCamera;

  private controls: OrbitControls;

  private ambientLight: THREE.AmbientLight;

  private light1: THREE.PointLight;

  private light2: THREE.PointLight;

  private light3: THREE.PointLight;

  private light4: THREE.PointLight;

  private model: any;

  private directionalLight: THREE.DirectionalLight;

  //? Helper Properties (Private Properties);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loaderGLTF = new GLTFLoader();

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

   private animateModel() {
    if (this.model) {
      this.model.rotation.z += 0.005;
    }
  }

  private createControls = () => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.zIndex='-1';
    document.body.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enabled=false;
    //this.controls.autoRotate = true;
    //this.controls.enableZoom = true;
    //this.controls.enablePan = false;
    this.controls.update();
  };


  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.loaderGLTF.load('assets/objectos/ElLoboFeroz.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.scene.add(this.model);
    });

    this.loaderGLTF.load('assets/objectos/LetraB.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      this.model.position.set(2,1,0);
      this.scene.add(this.model);
    });

    this.loaderGLTF.load('assets/objectos/LetraU.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      this.model.position.set(2.5,0,0);
      this.scene.add(this.model);
    });

    this.loaderGLTF.load('assets/objectos/LetraA.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      this.model.position.set(3,-1,0);
      this.scene.add(this.model);
    });
    
    this.loaderGLTF.load('assets/objectos/LetraP.gltf', (gltf: GLTF) => {
      this.model = gltf.scene.children[0];
      this.model.position.set(2.5,-2,0);
      this.scene.add(this.model);
    });
    //*C
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    )
    this.camera.position.x = 0;
    this.camera.position.y = 50;
    this.camera.position.z = 400;
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 10);
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.4);
    this.directionalLight.position.set(0, 1, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
    this.light1 = new THREE.PointLight(0x4b371c, 10);
    this.light1.position.set(0, 200, 400);
    this.scene.add(this.light1);
    this.light2 = new THREE.PointLight(0x4b371c, 10);
    this.light2.position.set(500, 100, 0);
    this.scene.add(this.light2);
    this.light3 = new THREE.PointLight(0x4b371c, 10);
    this.light3.position.set(0, 100, -500);
    this.scene.add(this.light3);
    this.light4 = new THREE.PointLight(0x4b371c, 10);
    this.light4.position.set(-500, 300, 500);
    this.scene.add(this.light4);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true,alpha: true });
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: LoginScreenComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
  }
  //////////////
  public username:string = "";
  public password: string ="";
  public type:string = "password";
  public errors: any = {};

  public showPassword(){
    if(this.type == "password"){
      $("#show-password").addClass("show-password");
      $("#show-password").attr("data-password", true);
      this.type = "text";
    }else if(this.type == "text"){
      $("#show-password").removeClass("show-password");
      $("#show-password").attr("data-password", false);
      this.type = "password";
    }

  }

  public login(){
    //Validar
    this.errors = [];

    this.errors = this.facadeService.validarLogin(this.username, this.password);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }

    //Si pasa la validación ir a la página de home
    this.facadeService.login(this.username, this.password).subscribe(
      (response)=>{
        this.facadeService.saveUserData(response);
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo iniciar sesión");
      }
    );


  }

  public registrar(){
    this.router.navigate(["registro-usuarios"]);
  }

 
}

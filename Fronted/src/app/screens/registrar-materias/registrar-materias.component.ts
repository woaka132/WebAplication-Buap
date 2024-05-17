import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MateriasService } from '../../services/materias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';

import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

declare var $:any;

@Component({
  selector: 'app-registrar-materias',
  templateUrl: './registrar-materias.component.html',
  styleUrls: ['./registrar-materias.component.scss']
})

export class RegistrarMateriasComponent implements OnInit{
  @Input() rol:string = "";
  @Input() datos_user: any = {};

  public admin:any = {};
  public materia:any = {};
  public editar:boolean = false;
  public errors:any = {};
  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public dias_json: any [] = [];
  


  public dias:any[]= [
    {value: '1', nombre: 'Lunez'},
    {value: '2', nombre: 'Martes'},
    {value: '3', nombre: 'Miercoles'},
    {value: '4', nombre: 'Jueves'},
    {value: '5', nombre: 'Viernes'},
    {value: '6', nombre: 'Sabado'}
  ];

  public programa_educativos: any[] = [
    {value: '1', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: '3', viewValue: 'Ingeniería en Tecnologías de la Información'}
  ];

  public token: string = "";
  public idMateria: Number = 0;

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
    //renderer.domElement.style.zIndex='-1';
    document.body.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    //this.controls.enabled=false;
    this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.update();
  };

  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.loaderGLTF.load('assets/objectos/NewAnimationTesteMomentA.gltf', (gltf: GLTF) => {

      this.model = gltf.scene.children[0];
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      
      this.scene.add(this.model)
    });

    const clock = new THREE.Clock();
    
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    )
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 900;
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
    let component: RegistrarMateriasComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      //component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
    

  }

  constructor(
    private location : Location,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private materiasService: MateriasService,
    private facadeService: FacadeService
  ){}

  ngOnInit(): void {
    this.materia.dias_json = this.dias_json
    //El if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idMateria);
      //Al iniciar la vista obtiene el usuario por su ID
      this.obtenerMateriaByID();
    }
  }

  //Función para obtener un solo usuario por su ID
  public obtenerMateriaByID(){
    this.materiasService.getMateriaByID(this.idMateria).subscribe(
      (response)=>{
        this.materia = response;
        console.log("Datos user: ", this.materia);
      }, (error)=>{
        alert("No se pudieron obtener los datos del usuario para editar");
      }
    ); 
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    //Validar
    this.errors = [];
    console.log(this.materia)
    this.errors = this.materiasService.validarMateria(this.materia);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    //Registrar al usuario    
    this.materiasService.registrarMateria(this.materia).subscribe(
      (response)=>{
        alert("Materia registrado correctamente");
        console.log("Materia registrada: ", response);
        this.router.navigate(["/home"]);
      }, (error)=>{
        alert("No se pudo registrar la materia");
        console.log(error)
      }
    );
    
  }

  public actualizar(){
    //Validación
    this.errors = [];
    console.log(this.materia)
    this.errors = this.materiasService.validarMateria(this.materia);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.materiasService.editarMateria(this.materia).subscribe(
      (response)=>{
        alert("Matería editada correctamente");
        console.log("Matería editada: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["materias"]);
      }, (error)=>{
        alert("No se pudo editar el maestro");
      }
    );
  }

  public revisarSeleccion(nombre: string){
    if(this.materia.dias_json){
      var busqueda = this.materia.dias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  public checkboxChange(event:any){
    //console.log("Evento: ", event);
    if(event.checked){
      this.dias_json.push(event.source.value)
      this.materia.dias_json = this.dias_json
    }else{
      console.log(event.source.value);
      this.materia.dias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materia.dias_json);
  }
  
}

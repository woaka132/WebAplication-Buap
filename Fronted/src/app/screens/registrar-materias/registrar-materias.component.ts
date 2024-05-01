import { Component, Input, OnInit } from '@angular/core';
import { MateriasService } from '../../services/materias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
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

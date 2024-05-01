import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMaestro(){
    return {
      'nrc':'',
      'nombre_de_la_materia': '',
      'seccion': '',
      'dias_json': [],
      'horario_inicio':'',
      'horario_finalizacion':'',
      'salon': '',
      'programa_educativo': ''
    }
  }

    //Validación para el formulario
  public validarMateria(data: any){
    console.log("Validando materias... ", data);
    let error: any = [];
  
    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["nrc"])){
      error["nrc"] = this.errorService.numeric;
    }

    if(!this.validatorService.required(data["nombre_de_la_materia"])){
      error["nombre_de_la_materia"] = this.errorService.required;
    }
  
    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required;
    } else if(!this.validatorService.numeric(data["seccion"])){
      error["seccion"] = this.errorService.numeric;
    }

    if(!this.validatorService.required(data["horario_inicio"])){
      error["horario_inicio"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["horario_finalizacion"])){
      error["horario_finalizacion"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["programa_educativo"])){
      error["programa_educativo"] = this.errorService.required;
    }

    if(data["dias_json"].length == 0){
      error["dias_json"] = "Al menos debes seleccionar una materia";
      //alert("Debes seleccionar materias para poder registrarte.");
    }

    //Return arreglo
    return error;
  }

  public registrarMateria (data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/materia/`,data, httpOptions);
  }

  public obtenerListaMaterias (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, {headers:headers});
  } 
    
    //Obtener un solo maestro dependiendo su ID
  public getMateriaByID(idMateria: Number){
    return this.http.get<any>(`${environment.url_api}/materia/?id=${idMateria}`,httpOptions);
  }
  //Servicio para actualizar un usuario
  public editarMateria (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/materias-edit/`, data, {headers:headers});
  }
  //Eliminar Maestro
  public eliminarMateria(idMateria: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/materias-edit/?id=${idMateria}`,{headers:headers});
  }  
}

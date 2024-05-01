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
export class MaestrosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMaestro(){
    return {
      'rol':'',
      'id_trabajador': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'fecha_nacimiento': '',
      'telefono': '',
      'rfc': '',
      'cubiculo': '',
      'area_investigacion': '',
      'materias_json': []
    }
  }

  //Validación para el formulario
  public validarMaestro(data: any, editar: boolean){
    console.log("Validando maestro... ", data);
    let error: any = [];

    if(!this.validatorService.required(data["clave_maestro"])){
      error["clave_maestro"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if(!this.validatorService.required(data["edad"])){
      error["edad"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["fecha_nacimineto"])){
      error["fecha_nacimineto"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(data["rfc"], 12)){
      error["rfc"] = this.errorService.min(12);
      alert("La longitud de caracteres deL RFC es menor, deben ser 12");
    }else if(!this.validatorService.max(data["rfc"], 13)){
      error["rfc"] = this.errorService.max(13);
      alert("La longitud de caracteres deL RFC es mayor, deben ser 13");
    }

    if(!this.validatorService.required(data["curp"])){
      error["curp"] = this.errorService.required;
    }else if(!this.validatorService.min(data["curp"], 18)){
      error["curp"] = this.errorService.min(18);
      alert("La longitud de caracteres de la CURP es menor, deben ser 18");
    }else if(!this.validatorService.max(data["curp"], 18)){
      error["curp"] = this.errorService.max(18);
      alert("La longitud de caracteres de la CURP es mayor, deben ser 18");
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["ocupacion"])){
      error["ocupacion"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["areas_de_trabajo"])){
      error["areas_de_trabajo"] = this.errorService.required;
    }

    if(data["materias_json"].length == 0){
      error["materias_json"] = "Al menos debes seleccionar una materia";
      //alert("Debes seleccionar materias para poder registrarte.");
    }
    //Return arreglo
    return error;
  }

  public registrarMaestro (data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/maestro/`,data, httpOptions);
  }

  public obtenerListaMaestros (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, {headers:headers});
  } 

  //Obtener un solo maestro dependiendo su ID
  public getMaestroByID(idUser: Number){
    return this.http.get<any>(`${environment.url_api}/maestro/?id=${idUser}`,httpOptions);
  }
  
  //Servicio para actualizar un usuario
  public editarMaestro (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/maestros-edit/`, data, {headers:headers});
  }
  //Eliminar Maestro
  public eliminarMaestro(idUser: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/maestros-edit/?id=${idUser}`,{headers:headers});
  }  

}

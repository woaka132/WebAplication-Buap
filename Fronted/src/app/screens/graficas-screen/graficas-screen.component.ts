import { Component, OnInit } from '@angular/core';
import { AdministradorService } from 'src/app/services/administrador.service'
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  public total_user: any = {};
  constructor(
    private administradoresServices: AdministradorService
  ){}

  ngOnInit(): void {
   this.obtenerTotalUsers();
    // Go through each key in the bigObject
  }
  //Function to create a table
  public crearTabla(id:string, type:any, color:any){
    var titulos : any[] = [];
    var data : any[] = [];
    for (const key in this.total_user)
      {
        titulos.push(key)
        data.push(this.total_user[key]);
      } 
     
    console.log(titulos,data)  
    new Chart(
      id,
      {
        type: type,
        data: {
          labels: titulos,
          datasets: [
            {
              label: 'Cantidad de personas',
              data: data,
              backgroundColor: color,
              borderColor: '#173831'
            }
          ],
        },
        options:{
          responsive: false,
        },
        plugins : [ DatalabelsPlugin ]
      }
    );
  }

  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        //Create a LinearTable
        this.crearTabla('mychart','line',['#173831'])
        //Create a pieTable
        this.crearTabla('mychartCircular','pie',[
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ])
        //Create a DoughntTable
        this.crearTabla('mychartdoughnut','doughnut',[
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ])
        //Create a BarTable
        this.crearTabla('mychartBar','bar',[
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ])

      }, (error)=>{
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

}

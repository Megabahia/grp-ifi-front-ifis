import {Component, OnInit} from '@angular/core';
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ClientesService, Transaccion} from '../clientes.service';
import {DatePipe} from '@angular/common';

/**
 * Bigpuntos
 * Ifis
 * Esta pantalla sirve para listar las transacciones
 * Rutas:
 * `${apiUrl}/mdm/facturas/list/negocio/`,
 * `${apiUrl}/mdm/facturas/listOne/${id}`
 * `${apiUrl}/mdm/facturas/list/negocio/grafica/`,
 */

@Component({
  selector: 'app-transacciones-list',
  templateUrl: './transacciones-list.component.html',
  providers: [DatePipe],
})
export class TransaccionesListComponent implements OnInit {
  menu;
  page = 1;
  pageSize = 10;
  collectionSize;
  listaTransacciones;
  inicio = new Date();
  fin = new Date();
  transaccion: Transaccion = {
    canal: '',
    cliente: '',
    correo: '',
    created_at: '',
    descuento: 0,
    detalles: [],
    direccion: '',
    fecha: '',
    id: 0,
    identificacion: '',
    iva: '',
    nombreVendedor: '',
    numeroFactura: 0,
    numeroProductosComprados: '',
    razonSocial: '',
    subTotal: 0,
    telefono: '',
    tipoIdentificacion: '',
    total: 0,
    empresa_id: ''
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1,
  };
  public barChartLabels: Label[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];
  public barChartColors: Color[] = [
    {
      backgroundColor: '#84D0FF',
    },
  ];
  datosTransferencias = {
    data: [],
    label: 'Series A',
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
  };

  constructor(
    private datePipe: DatePipe,
    private clientesService: ClientesService
  ) {
    this.inicio.setMonth(this.inicio.getMonth() - 3);
  }

  ngOnInit(): void {
    this.menu = {
      modulo: 'mdm',
      seccion: 'clientesTransac',
    };
    this.barChartData = [this.datosTransferencias];
    this.obtenerTransacciones();
  }

  obtenerTransacciones() {
    this.clientesService
      .obtenerTodasTrasacciones({
        page: this.page - 1,
        page_size: this.pageSize,
        inicio: this.inicio,
        fin: this.fin,
      })
      .subscribe((info) => {
        this.collectionSize = info.cont;
        this.listaTransacciones = info.info;
        this.obtenerGraficos();
      });
  }

  transformarFecha(fecha) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }

  async obtenerTransaccion(id) {
    this.clientesService.obtenerTransaccion(id).subscribe((info) => {
      this.transaccion = info;
      console.log(info);
    });
  }

  async obtenerGraficos() {
    this.clientesService
      .obtenerGraficaTransaccionesGeneral({
        page: this.page - 1,
        page_size: this.pageSize,
        inicio: this.inicio,
        fin: this.fin,
      })
      .subscribe((info) => {
        const etiquetas = [];
        const valores = [];

        info.map((datos) => {
          etiquetas.push(datos.anio + '-' + datos.mes);
          valores.push(datos.cantidad);
        });
        this.datosTransferencias = {
          data: valores,
          label: 'Series A',
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        };
        this.barChartData = [this.datosTransferencias];
        this.barChartLabels = etiquetas;
      });
  }
}

import { Component ,OnInit,Inject, ElementRef, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InformData} from '../interface/reservation.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-inform',
  standalone: true,
  imports: [MatIconModule,MatTooltipModule],
  templateUrl: './inform.component.html',
  styleUrl: './inform.component.css'
})
export class InformComponent {
  @ViewChild('contenido') contenido?: ElementRef;

    constructor(
                public dialogRef: MatDialogRef<InformComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any
               ) {}



    convertTo12HourFormat(dateTime: string): string {
      const [date, time] = dateTime.split('T'); // Separamos la fecha y la hora
      const [hours, minutes] = time.split(':'); // Separamos las horas y los minutos
      const [day, month, year] = date.split('-'); // Separamos el día, el mes y el año

      let hour = parseInt(hours, 10);
      const suffix = hour >= 12 ? 'PM' : 'AM';

      if (hour === 0) {
        hour = 12;
      } else if (hour > 12) {
        hour -= 12;
      }

      // Devolvemos la hora en formato de 12 horas con el sufijo AM o PM
      return `${date} (${hour}:${minutes} ${suffix})`;
    }


    ngOnInit(): void {
          console.log(this.data.title)
          console.log(this.data.report.nombre)
          console.log(this.data.report.descripcion)
          console.log(this.data.report.salon)
          console.log(this.convertTo12HourFormat(this.data.report.fecha))
          console.log(this.data.report.requerimiento)
    }
    
    print(): void {
        const pdf = new jspdf.jsPDF('p', 'mm', 'letter'); // Tamaño carta (216 x 279 mm)

        // Agregar la imagen de cintillo centrada
        const cintillo = new Image();
        cintillo.src = './assets/cintillo4.png'; // Ruta de la imagen de cintillo
        pdf.addImage(cintillo, 'png', 0, 0, pdf.internal.pageSize.getWidth(), 20);

        // Agregar texto
        const texto = `
          ${this.data.title}
          Nombre: ${this.data.report.nombre}
          Descripción: ${this.data.report.descripcion}
          Salón: ${this.data.report.salon}
          Fecha: ${this.convertTo12HourFormat(this.data.report.fecha)}
          Requerimiento: ${this.data.report.requerimiento}
        `;
        
        const x = 10; // Posición horizontal
        let y = 80; // Posición vertical inicial

        pdf.setFontSize(22);
        pdf.text(this.data.title, pdf.internal.pageSize.getWidth() / 2, 70,{align: 'center'}); // Ajusta la posición del texto según sea necesario
        pdf.setFontSize(16);
        y += 10;
        pdf.text(`Nombre: ${this.data.report.nombre}`, x, y);
        y += 10;
        pdf.text(`Descripción: ${this.data.report.descripcion}`, x, y);
        y += 10;
        pdf.text(`Salón: ${this.data.report.salon}`, x, y);
        y += 10;
        pdf.text(`Fecha: ${this.convertTo12HourFormat(this.data.report.fecha)}`, x, y);
        y += 10;
        pdf.text(`Requerimiento: ${this.data.report.requerimiento}`, x, y);


        // Descargar el PDF
        window.open(pdf.output('bloburl'), '_blank');




    }




}

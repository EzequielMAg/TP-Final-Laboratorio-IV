import { Component, Input } from '@angular/core';

import { Order, Product } from 'src/app/core/models';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent {

  @Input()
  public order: Order = new Order();
  public date: Date | null= null;
  public formattedDate: string = "";

  public panelOpenState: boolean = false;

  constructor(private productService: ProductsService) {}

  ngOnInit(): void{

    if (typeof this.order.dateTime === 'string') { //como el atributo dateTime se serializa en el json, el mismo se guarda como string
      this.date = new Date(this.order.dateTime); //por lo que se debe realizar la conversion de string a tipo Date para poder darle el
    //formato deseado
    }

    if(this.date == null){
      this.formattedDate = "sin fecha"
    }else{
      this.formattedDate = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'America/Argentina/Buenos_Aires',
      }).format(this.date);

  }
}

  public getProductById(idProduct : string): Product {
    // console.log(this.productService.getProductById(idProduct)); 
    return this.productService.getProductById(idProduct)!; //TODO: optimizar busqueda de productos por id
  }

}

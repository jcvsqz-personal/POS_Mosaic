import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app'
import IItem from '../models/item.model';
import { v4 as uuid } from 'uuid'
import { OrderService } from '../services/order.service';
import IOrder from '../models/order.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait..'
  isSubmitting = false
  items = [
    {
      price: 29.99,
      name: 'Apple',
      quantity: 1
    },
    {
      price: 35.00,
      name: 'Orange',
      quantity: 1
    },
    {
      price: 40.00,
      name: 'Lemon',
      quantity: 1
    },
  ]
  cartItems: IItem[] = []

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
  }

  addToCart(item: IItem) {
    this.showAlert= false
    let toInsertItem = {
      name: item.name,
      price: item.price,
      quantity: 1,
      total: item.price
    }

    const found = this.cartItems.find((obj) => {
      return obj.name === item.name
    })

    if(found){
      this.cartItems.forEach(element => {
        if(element.name === item.name){
          element.quantity += 1
          element.total = element.quantity * element.price
        }
      });
    }else{
      this.cartItems.push(toInsertItem)
    }
    
    console.log(this.cartItems);
  
  }

  placeOrder(){
    this.isSubmitting = true
    if(!this.cartItems || this.cartItems.length == 0){
      
      this.showAlert= true
      this.alertColor = 'red'
      this.alertMsg = 'Oops no items on the cart'

      setTimeout(() => {
        this.showAlert= false
        this.alertColor = 'blue'
        this.alertMsg = 'Please wait'
      },5000)

      this.isSubmitting = false
      return
    }

    this.showAlert= true
    this.alertColor = 'blue'
    this.alertMsg = 'Sending order..'

    const orderId = uuid()
    const order: IOrder = {
      orderId: orderId,
      item: this.cartItems,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }

    this.orderService.createOrder(order).then(() => {
      this.isSubmitting = false
      this.showAlert= true
      this.alertColor = 'green'
      this.alertMsg = 'Order placed'

      setTimeout(() => {
        this.showAlert= false
        this.alertColor = 'blue'
        this.alertMsg = 'Please wait'
      },5000)

      this.cartItems = []
    })
  }
}

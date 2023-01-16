import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, combineLatest, switchMap, of, map } from 'rxjs';
import IItem from '../models/item.model';
import IOrder from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public orderCollection: AngularFirestoreCollection<IOrder> 
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { 
    this.orderCollection = db.collection('orders')
  }

  createOrder(data: IOrder):  Promise<DocumentReference<IOrder>> {
    return this.orderCollection.add(data)
  }

  getUserOrders(sort: BehaviorSubject<string>) {
    return combineLatest([this.auth.user,sort]).pipe(
      switchMap(values => {
        const [user, sort] = values
        if(!user){
          return of([])
        }
        const query = this.orderCollection.ref.where(
         'uid','==',user.uid 
        ).orderBy('timestamp',sort === '1' ? 'desc' : 'asc')

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IOrder>).docs)
    )
  }

  upateOrder(id: string, title: string) {
    return this.orderCollection.doc(id).update({
      
    })
  }

  async deleteOrder(order: IOrder) {

    await this.orderCollection.doc(order.orderId).delete()
  }
}

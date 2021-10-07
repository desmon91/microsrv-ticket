import request from 'supertest'
import {app}from '../../app'
import {Ticket} from '../../models/ticket'
import {natsWrapper} from '../../nats-wrapper'
import mongoose from 'mongoose'

it('can cancel the order', async()=>{
    const user = global.signin()
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    // make a request to build an order with this ticket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)

    // make request to cancel the order
    const {body: fetchOrder} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

})

it('can not cancel other user order', async()=>{
    const user = global.signin()
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    // make a request to build an order with this ticket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)

    // make request to cancel the order
   await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401)

 
})

it('emits a order cancelled event', async()=>{
    const user = global.signin()
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    // make a request to build an order with this ticket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)

    // make request to cancel the order
    const {body: fetchOrder} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    
        expect(natsWrapper.client.publish).toHaveBeenCalled()
})

import request from 'supertest'
import {app}from '../../app'
import mongoose from 'mongoose'
import {Ticket} from '../../models/ticket'

it('returns an error if the user does not singin', async()=>{
    const ticketId = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .post('/api/orders')
        .send({
            ticketId
        })
        .expect(401)
})

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    return ticket
}

it('fetch orders for particular user', async()=>{
   // Create three tickets
    const ticketOne = await buildTicket()
    const ticketTwo = await buildTicket()
    const ticketThree = await buildTicket()

    const userOne = global.signin()
    const userTwo = global.signin()

   // Create one order as User #1
   await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ticketId: ticketOne.id})
    .expect(201)

   // Create two order as User #2
   await request(app)
   .post('/api/orders')
   .set('Cookie', userTwo)
   .send({ticketId: ticketTwo.id})
   .expect(201)

   await request(app)
   .post('/api/orders')
   .set('Cookie', userTwo)
   .send({ticketId: ticketThree.id})
   .expect(201)

   // Make request for User #2
   const response = await request(app)
                        .get('/api/orders')
                        .set('Cookie', userTwo)
                        .expect(200)


   // Make sure we only got the orders for User #2
   expect(response.body.length).toEqual(2)
})


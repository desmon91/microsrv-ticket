import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@ticketing-mcsv/common"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming"

const setup = async ()=>{
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: '123'
    })

    await ticket.save()

    // create fake data event to publish message
    const data:OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: '123',
        expiresAt: '1234',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg}
}

it('set the userId of the ticket', async()=>{
    const {listener, ticket, data, msg} = await setup()

    // publish the message and update it
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)


    // check if the id of order and orderId in the ticket is same
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('ack the message', async()=>{
    const {listener, ticket, data, msg} = await setup()

    // publish the message and update it
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)


   // check if the msg get acknowledged
    expect(msg.ack).toHaveBeenCalled()
})

it('publish a ticket updated event with orderId in it for locking', async()=>{
    const {listener, ticket, data, msg} = await setup()

    // publish the message and update it
    await listener.onMessage(data, msg)

   // check if the msg published
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
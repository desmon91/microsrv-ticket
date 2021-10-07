import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus } from "@ticketing-mcsv/common"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming"

const setup = async ()=>{
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: '123'
    })

    await ticket.save()

    // create fake data event to publish message
    const data:OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg}
}

it('set the userId of the ticket to be undefined', async()=>{
    const {listener, ticket, data, msg} = await setup()

    // publish the message and update it
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)


    // check if the id of order and orderId in the ticket is same
    expect(updatedTicket!.orderId).toEqual(undefined)
})

it('ack the message', async()=>{
    const {listener, data, msg} = await setup()

    // publish the message and update it
    await listener.onMessage(data, msg)


   // check if the msg get acknowledged
    expect(msg.ack).toHaveBeenCalled()
})

it('publish a ticket updated event with undefined orderId in it for unlocking', async()=>{
    const {listener, data, msg} = await setup()

    // publish the message and update it
    await listener.onMessage(data, msg)

   // check if the msg published
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
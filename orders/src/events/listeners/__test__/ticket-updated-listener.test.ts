import mongoose from 'mongoose'
import { TicketUpdatedEvent } from "@ticketing-mcsv/common"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async ()=>{
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()

    // create fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket}
}

it('find, updates and saves a ticket', async()=>{
    const {listener, data, msg, ticket} = await setup()
    // call the on Message function to update the data and send message
    await listener.onMessage(data, msg)
    
    // write assertion to make sure a ticket was updated
    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)

})

it('acks the message', async()=>{
    const {listener, data, msg} = await setup()
    // call the on Message function with data + message
    await listener.onMessage(data, msg)

    // write assertion to make sure a ack was called
    expect(msg.ack).toHaveBeenCalled()
    
})

it('does not call ack if the data version is out of order', async()=>{
    const {listener, data, msg} = await setup()

    // update data version to be far in the future
    data.version = 10

    //update it to the database
    try {
        await listener.onMessage(data, msg)
    } catch (error) {
        
    }
   
    // check if the msg ack reject the update
    expect(msg.ack).not.toHaveBeenCalled()

})

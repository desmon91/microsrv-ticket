import { Listener, OrderCreatedEvent, Subjects } from "@ticketing-mcsv/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCreatedListener extends Listener <OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName

   async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)
        
        // if no ticket, throw error
        if(!ticket){
            throw Error('Ticket not found')
        }

        // Mark the ticket as being reserved
        ticket.set({orderId: data.id})

        // Save the ticket
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        })

        // ack the message
        msg.ack()
    }
}
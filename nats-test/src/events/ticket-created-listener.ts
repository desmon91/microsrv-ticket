import { Message } from "node-nats-streaming"
import { Listener } from "./base-listeners"
import { TicketCreatedEvent } from "./ticket-created-event"
import { Subjects } from "./subjects"

export class TicketCreatedListener extends Listener <TicketCreatedEvent>  {
    //<Type> meaning we are using that type here and must be comply
    // :Type meaning we are returning that type and must be comply
    readonly subject =  Subjects.TicketCreated
    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log(`Event data`, data)

        msg.ack()
    }
}
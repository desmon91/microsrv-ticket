import {Publisher, Subjects, TicketCreatedEvent} from '@ticketing-mcsv/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
}


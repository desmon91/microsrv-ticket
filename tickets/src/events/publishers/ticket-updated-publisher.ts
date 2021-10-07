import {Publisher, Subjects, TicketUpdatedEvent} from '@ticketing-mcsv/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated
}


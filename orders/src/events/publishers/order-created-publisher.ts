import { Publisher, OrderCreatedEvent, Subjects } from "@ticketing-mcsv/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated
}


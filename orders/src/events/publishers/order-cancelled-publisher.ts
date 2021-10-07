import { Publisher, OrderCancelledEvent, Subjects } from "@ticketing-mcsv/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled
}


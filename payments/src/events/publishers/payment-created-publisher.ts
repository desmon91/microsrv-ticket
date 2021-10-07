import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketing-mcsv/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated
}
import { Subjects, Publisher, ExpirationCompleteEvent } from "@ticketing-mcsv/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete
}
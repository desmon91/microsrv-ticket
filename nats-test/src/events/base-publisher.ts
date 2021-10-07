import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects
    data: any
}

export abstract class Publisher <T extends Event>{
      //abstract mean you have to define it in the subclass
    //<T extends Type> meaning that the subclass will have to input a Type in <> as argument

    abstract subject: T['subject']
    private client:Stan

    constructor(client: Stan){
        this.client = client
    }

    publish(data: T['data']): Promise <void>{

        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err)=>{
                if(err){
                    return reject(err)
                }
                console.log('Event published to subject', this.subject)
                resolve()
            })
        })
       
    }
}
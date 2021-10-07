import mongoose from 'mongoose'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
// An interface that describes the properties
// that are required to make a user

interface TicketAttrs {
    title: string
    price: number
    userId: string
}

// An interface that describes the properties
// that a User Model has

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

//An interface that descries the properties
// that a User document has

interface TicketDoc extends mongoose.Document{
    title: string
    price: number
    userId: string
    version: number
    orderId?: string
}

const ticketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userId:{
        type: String,
        require: true
    },
    orderId:{
        type: String,
    }
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs)=>{
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)



export {Ticket}
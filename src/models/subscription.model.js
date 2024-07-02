import {Schema,model} from "mongoose"

const subscriptionSchema= new Schema({
    subscriber:{
        type:Schema.Types.ObjectId, // one who is subscribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId, // user's id who owns the channel
        ref:"User"
    }
},{timestamps:true})

const Subscription=model("Subscription",subscriptionSchema)
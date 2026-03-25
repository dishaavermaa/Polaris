import mongoose, {Schema} from "mongoose";

const SubscriptionSchema = new Schema({
    subscriber : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    channel : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    }
},{timestamps: true});

SubscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription",SubscriptionSchema);

import { Document, Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, autoCreate: true, collection: 'Store', autoIndex: true })
export class Store extends Document {
    @Prop({ unique: true })
    UID: string;
    @Prop({ index: true })
    Date: Date;
    @Prop()
    Amount: number;
    @Prop()
    Education: string;
    @Prop()
    Decision: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.index({ Date: 1, Education: 1 }, { unique: true });
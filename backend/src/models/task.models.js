import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    taskname: {
        type: String,
        required: true
    },
    taskdescription: {
        type: String,
    },
    taskstatus: {
        type: Boolean,
        default: false
    },
    taskcreatedat: {
        type: Date
    },
    taskeditedat: {
        type: Date
    },
    duedate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > Date.now();

            },
            message: "Due Date must be the future date"

        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }


}, { timestamps: true })

export const Task = mongoose.model("Task", taskSchema)
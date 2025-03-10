//yha humlog task likhange 
/* toh sabse pahle humlog create task ka code likhange 
toh task create karne ma hume task name task description task priority aur
task ka deadline ko user sa lange 
aur ha agar task ka priority nhi diya hai to default set karenga medium ma 
* */
import { Task } from "../models/task.models.js";

const task = async (req, res) => {
    try {
        const { taskname, taskdescription, priority = "low", duedate } = req.body;
        if (!taskname) {
            return res.status(400).json({
                message: "Task name is required"
            })
        }
        const taskstatus = false;
        //lets create a new task

        const task = new Task({
            taskname,
            taskdescription: taskdescription || null,
            taskstatus: taskstatus || false,
            priority: priority || null,
            duedate: duedate || null,
            owner: req.user?._id,
            taskcreatedat: new Date(),
        })

        const savedtask = await task.save();

        return res.status(201).json({ message: "Task created successfully", task: savedtask });
    } catch (error) {
        console.error("Error while creating task:", error);
        return res.status(500).json({ message: "Failed to create task" });

    }
}
const deletetask = async (req, res) => {

    try {
        const { taskId } = req.params;
        const userId = req.user?._id
        console.log("task id", taskId);
        console.log("user id", userId);
        if (!taskId) {
            return res.status(400).json({
                message: "the task id not provided"
            });
        }
        const task = await Task.findOneAndDelete({ _id: taskId, owner: userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found or not authorized to delete" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
        console.log("lasst line");

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}
//ab do kaam ho gaya hai aur baki kaam karte hai 
//next kam hai task ko edit karna aur done karna
//updaate task dekhte hai pahla
const updatetask = async (req, res) => {
    try {
        //pahla task ka data yani id lana hoga jisko update kar rahe hai 
        //phir user ka id lana hoga jo ya cler karega ki usse ka data update ho 
        console.log("reached here");
        const { taskId } = req.params;
        const userId = req.user;
        const update = req.body;
        console.log("Update data:", req.body);
        console.log("Task ID:", taskId);
        console.log("User ID:", userId);


        // console.log(update);
        const task = await Task.findOneAndUpdate({ _id: taskId, owner: userId },
            { $set: update },
            { new: true }
        );
        console.log("updated", task);
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized to update" });
        }
        res.status(200).json({
            message: "Task updated successfully",
            task, // Updated task ka data send karo
        });

    } catch (error) {
        console.log("error at updating the data", error);
    }
}

const getalltask = async (req, res) => {
    try {

        const userId = req.user?._id;
        console.log("Logged-in user ID:", userId);
        const task = await Task.find({ owner: userId, });
        if (!task || task.length === 0) {
            return res.status(200).json({ success: true, tasks: [] });
        }
        res.status(200).json({ task });



    } catch (error) {
        console.log(error);

    }
}
export { task, deletetask, updatetask, getalltask }
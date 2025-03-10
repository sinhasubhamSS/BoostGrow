export const admincheck=async(req,res,next)=>{
    try {
        //sabsa pahla humko authmiddleware sa kon sa user logged in hai uska data mil jayega to mai dekho kya kar sakta hu
        if(req.user?.role!=="admin"){
            return res.status(401).json({
                message:"only admins can access this "
            })
        }
        next();   
    } catch (error) {
        console.log("error at adminceck");
    }
}
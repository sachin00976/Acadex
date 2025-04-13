const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req , res , next))
        .catch((err)=>{
           //next(err);
            return res.status(err.statusCode || 500).json({
                message:err.message,
                statusCode:err.statusCode|| 500,
                success:false,

        });
        }
        )
    }
}
export {asyncHandler}

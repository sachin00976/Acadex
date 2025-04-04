import multer from "multer";

const storage=multer.diskStorage(
    {
        destination:function(req,file,cb)
        {
            cb(null,"./public/media")
        },
        filename:function(req,file,cb){
            let filename = "default.png";
            if(req.body?.type==="profile")
            {
                if(req.body?.post) // faculty
                {

                }
                else if(req.body?.enrollmentNo) // student
                {

                }
                else // admin
                {
                    filename=`Admin_Profile_${req.body.employeeId}.png`
                }
            }
            cb(null,`${filename}`)
        }
    }
);

export const upload=multer({storage:storage})


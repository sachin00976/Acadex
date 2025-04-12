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
                    filename = `Faculty_Profile_${req.body.employeeId}`;
                }
                else if(req.body?.enrollmentNo) // student
                {

                }
                else // admin
                {
                    filename=`Admin_Profile_${req.body.employeeId}`;
                }
            }
            else if (req.body?.type === "timetable") {
                  filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`
            }
            cb(null,`${filename}`)
        }
    }
);

export const upload=multer({storage:storage})


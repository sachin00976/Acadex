// import multer from "multer";

// const storage=multer.diskStorage(
//     {
//         destination:function(req,file,cb)
//         {
//             cb(null,"./public/media")
//         },
//         filename:function(req,file,cb){
//             let filename = "default.png";
//             if(req.body?.type==="profile")
//             {
//                 if(req.body?.post) // faculty
//                 {
//                     filename = `Faculty_Profile_${req.body.employeeId}`;
//                 }
//                 else if(req.body?.enrollmentNo) // student
//                 {
//                     filename = `Student_Profile_${req.body.enrollmentNo}`
//                 }
//                 else // admin
//                 {
//                     filename=`Admin_Profile_${req.body.employeeId}`;
//                 }
//             }
//             else if (req.body?.type === "timetable") {
//                   filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`
//             }
            
//             cb(null,`${filename}`)
//         }
//     }
// );

// export const upload=multer({storage:storage})

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/media");
  },
  filename: function (req, file, cb) {
    let filename = "default.png";
    const ext = path.extname(file.originalname);
    const baseName = file.originalname.replace(/\s+/g, "_").replace(ext, "");

    if (req.body?.type === "profile") {
      if (req.body?.post) {
        filename = `Faculty_Profile_${req.body.employeeId}${ext}`;
      } else if (req.body?.enrollmentNo) {
        filename = `Student_Profile_${req.body.enrollmentNo}${ext}`;
      } else {
        filename = `Admin_Profile_${req.body.employeeId}${ext}`;
      }
    } else if (req.body?.type === "timetable") {
      filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}${ext}`;
    } else if (req.body?.type === "material") {
      filename = `Material_${Date.now()}_${baseName}${ext}`;
    }

    cb(null, filename);
  },
});

export const upload = multer({ storage });


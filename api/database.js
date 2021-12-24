require("dotenv").config();
const express = require("express");
const OurApp = express.Router();
const mongoose = require("mongoose");

//importing schemas
const Teacher = require("./schema/teacher");
const Faculty = require("./schema/faculty");
const SubDepartment = require("./schema/subDepartment");


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connection extablished!"))
  .catch((err) => {
    console.log(err);
  });



OurApp.get("/", (request, response) => {
  response.json({ message: "link working" });
});

//getting teacher with department
OurApp.get("/teacher/:faculity/:subdepartment", async (req, res) => {
  const getTeachers = await Teacher.find({
    Faculity: req.params.faculity,
    SubDepartment: req.params.subdepartment,
  });
  return res.json({ getTeachers });
});

//Adding new teachers
OurApp.post("/teacher/new", async (req, res) => {
  try {
    const { newTeacher } = req.body;
    await Teacher.create(newTeacher);
    return res.json({ message: "new teacher added" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

//Getting all faculty
OurApp.get("/faculty", async (req, res) => {
  const getDepartment= await Faculty.find({
  });
  return res.json( {getDepartment} );
});

//adding new faculty
OurApp.post("/faculty/new",async(req,res)=> {
  try{
  const {newFaculty}=req.body;
  await Faculty.create(newFaculty);
  return res.json({message: "new Faculty added"})
}
catch(error)
{
  return res.json({error: error.message});
}

})

// adding new subDepartment
OurApp.post("/subDepartment/new",async(req,res)=>{
  try{
    const {newSubDepartment}=req.body;
    await SubDepartment.create(newSubDepartment);
    return res.json({message: "new subDepartment added"})
  }
  catch(error)
  {
    return res.json({error: error.message});
  }
  
  })

// getting all the subDepartment Based upon faculty
OurApp.get("/subDepartment/:faculty",async(req,res)=>{
  const getSubDepartment = await SubDepartment.find({
    Faculty: req.params.faculty
  })
  return res.json({getSubDepartment})
})

module.exports = OurApp;



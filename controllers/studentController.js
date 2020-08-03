const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Student = mongoose.model("Student");
router.get("/", auth, (req, res) => {
  res.render("student/addOrEdit", {
    viewTitle: "Insert Student"
  });
});

// Router for edit or create functionality
router.post("/", auth, (req, res) => {
  console.log("here", req.body);
  if (req.body._id == "") insertRecord(req, res);
  else updateRecord(req, res);
});

// create function
function insertRecord(req, res) {
  console.log("in log");

  var student = new Student();
  student.fullName = req.body.fullName;
  student.email = req.body.email;
  student.mobile = req.body.mobile;
  student.city = req.body.city;
  //console.log("abc", student);
  student.save((err, doc) => {
    //console.log("123", doc, err);
    if (!err) {
      //console.log(doc);
      res.redirect("student/list");
    } else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("student/addOrEdit", {
          viewTitle: "Insert Student",
          student: req.body
        });
      } else console.log("Error during record insertion : " + err);
    }
  });
}

// edit function
function updateRecord(req, res) {
  console.log("in it", req.body);
  Student.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("student/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("student/addOrEdit", {
            viewTitle: "Update Student",
            student: req.body
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

// read router
router.get("/list", auth, (req, res) => {
  Student.find((err, docs) => {
    if (!err) {
      res.render("student/list", {
        list: docs
      });
    } else {
      console.log("Error in retrieving student list :" + err);
    }
  });
});

// error handler function
function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

// get route
router.get("/:id", (req, res) => {
  Student.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("student/addOrEdit", {
        viewTitle: "Update Student",
        student: doc
      });
    }
  });
});

// delete route
router.get("/delete/:id", (req, res) => {
  console.log(req.params);
  Student.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/student/list");
    } else {
      console.log("Error in student delete :" + err);
    }
  });
});

// authentication function
function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;

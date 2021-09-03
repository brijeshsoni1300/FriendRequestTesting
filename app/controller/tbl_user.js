var sql = require("../../db");
var async = require("async");
const { v4: uuidv4 } = require("uuid");
//import { v4 as uuidv4 } from 'uuid';
const date = require("date-and-time");
const { response } = require("express");

///////////////////////////    insert    ////////////////////////////
exports.userinsert = function (req, res) {
  var response_obj = {};
  var finalArr = [];
  const params = req.body;
  const mobile = params.mobile;
  const email = params.email;
  if (mobile == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter mobile number";
    res.status(200).send(response_obj);
  } else if (email == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter email";
    res.status(200).send(response_obj);
  } else {
    var date = new Date();
    var uuid = uuidv4();
    sql.query(
      `select mobile, email from tbl_user where (mobile = ? || email = ?)`,
      [mobile, email],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          sql.query(
            "insert into tbl_user (uuid, created_at, mobile, email,modified_at) values(?, ?, ?, ?, ?)",
            [uuid, date, mobile, email, date],
            (err, result1) => {
              if (err) throw err;
              var temp = {
                uuid: uuid,
                createdAt: date,
                "mobile no": mobile,
                email: email,
              };
              finalArr[0] = temp;
              response_obj["success"] = 1;
              response_obj["data"] = finalArr;
              response_obj["message"] =
                "user inserted in the database succesfully";
              res.status(200).send(response_obj);
            }
          );
        }
      }
    );
  }
};

///////////////////////////    update    ////////////////////////////
exports.userupdate = function (req, res) {
  var response_obj = {};
  var finalArr = [];
  const params = req.body;
  const mobile = params.mobile;
  const email = params.email;
  const newmobile = params.newmobile;
  const newemail = params.newemail;
  if (mobile == null && email == null) {
    response_obj["success"] = 1;
    response_obj["message"] =
      "you have to give atleast one of mobile or email to be updated";
    res.status(200).send(response_obj);
  } else {
    const now = new Date();
    const value = date.format(now, "YYYY-MM-DD HH:mm:ss");
    sql.query(
      `select * from tbl_user where mobile = ? OR email = ?`,
      [mobile, email],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          response_obj["success"] = 1;
          response_obj["message"] = "no such user found to be updated";
        } else {
          let oldmobile = result[0].mobile;
          let oldemail = result[0].email;
          let olduuid = result[0].uuid;
          oldmobile =
            oldmobile != newmobile && newmobile != null ? newmobile : oldmobile;
          oldemail =
            oldemail != newemail && newemail != null ? newemail : oldemail;
          sql.query(
            `update tbl_user set mobile = ?, email = ?, modified_at = ? where uuid = '${olduuid}'`,
            [oldmobile, oldemail, value],
            (err, result1) => {
              if (err) throw err;
              if (result1.affectedRows == 0) {
                response_obj["success"] = 1;
                response_obj["message"] = "no row updated";
                res.status(200).send(response_obj);
              } else {
                response_obj["success"] = 1;
                response_obj["data"] = {
                  uuid: olduuid,
                  email: oldemail,
                  mobile: oldmobile,
                  modified_at: value,
                };
                response_obj["message"] = "data updated as above shown";
                res.status(200).send(response_obj);
              }
            }
          );
        }
      }
    );
  }
};

///////////////modified at is remaining////////
////////////////////////////////////////////////////////////////////////

///////////////////////////    update old   ////////////////////////////
exports.userupdateold = function (req, res) {
  var response_obj = {};
  var finalArr = [];
  const params = req.body;
  const mobile = params.mobile == null ? 1 : params.mobile;
  const email = params.email == null ? " " : params.email;
  const newmobile = params.newmobile;
  const newemail = params.newemail;
  if (mobile == 1 && email == " ") {
    response_obj["success"] = 1;
    response_obj["message"] =
      "you have to give atleast one of mobile or email to be updated";
    res.status(200).send(response_obj);
  } else {
    var q = "";
    var Q = "";
    let cnt = 0;
    if (newmobile != null) {
      q += "mobile = " + newmobile + ",";
      Q += "mobile ";
      cnt++;
    }
    if (newemail != null) {
      q += "email = " + "'" + newemail + "',";
    }
    const now = new Date();

    const value = date.format(now, "YYYY-MM-DD HH:mm:ss");
    q += "modified_at = " + value;
    sql.query(
      `update tbl_user set ${q} where mobile = ? OR email = ? `,
      [mobile, email],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.affectedRows == 0) {
          response_obj["success"] = 1;
          response_obj["message"] = "No data to be updated";
          res.status(200).send(response_obj);
        } else {
          response_obj["success"] = 1;
          response_obj["message"] = "Data updated succesfully";
          res.status(200).send(response_obj);
        }
      }
    );
  }
};

///////////////modified at is remaining////////
////////////////////////////////////////////////////////////////////////

///////////////////////////    delete   ////////////////////////////
exports.userdelete = function (req, res) {
  var response_obj = {};
  var finalArr = [];
  const params = req.body;
  const mobile = params.mobile == null ? 1 : params.mobile;
  const email = params.email == null ? "a" : params.email;
  if (mobile == 1 && email == "a") {
    response_obj["success"] = 1;
    response_obj["message"] =
      "you have to give atleast one of mobile or email to be updated";
    res.status(200).send(response_obj);
  } else {
    sql.query(
      `delete from tbl_user where (mobile = ? OR email = ?)`,
      [mobile, email],
      (err, result) => {
        if (err) throw err;
        if (result.affectedRows == 0) {
          response_obj["success"] = 1;
          response_obj["message"] =
            "no such user to be deleted in the database";
          res.status(200).send(response_obj);
        } else {
          response_obj["success"] = 1;
          response_obj["message"] = "user deleted successfully";
          res.status(200).send(response_obj);
        }
      }
    );
  }
};

/////get all users

exports.getallusers = function (req, res1) {
  var response_obj = [];

  sql.query(`select * from tbl_user`, (err, result) => {
    console.log(result.length);
    response_obj = result;
    async.forEachOf(
      result,
      (res, key, callback) => {
        sql.query(
          `select * from tbl_user_info where user_id = ${res.id}`,
          (error, result1) => {
            if (error) {
              console.log(error);
            } else {
              if (result1.length > 0) {
                response_obj[key]["user_info"] = result1[0];
              }
            }
            console.log(response_obj);
          }
        );
        // console.log(res.id, key)
        callback();
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response_obj);
          console.log("ALL USER LIST DONE");
        }
      }
    );

    console.log("blah blah");
  });
};

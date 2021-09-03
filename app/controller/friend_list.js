const { response } = require("express");
var sql = require("../../db");
var async = require("async");
///////////////////////////    insert    ////////////////////////////
exports.friendlistinsert = function (req, res) {
  const params = req.body;
  const user1 = params.user1;
  const user2 = params.user2;
  const status = params.status;
  var response_obj = {};
  var finalArr = [];
  if (user1 == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter user1";
    res.status(200).send(response_obj);
  } else if (user2 == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter user2";
    res.status(200).send(response_obj);
  } else if (status != 2 && status != 1) {
    response_obj["success"] = 1;
    response_obj["message"] =
      "Enter valid status either 1(friend) or 2(request)";
    res.status(200).send(response_obj);
  } else if (user1 == user2) {
    response_obj["success"] = 1;
    response_obj["message"] =
      "both user must be different ...you cannot associate same person with himself";
    res.status(200).send(response_obj);
  } else {
    var tempuser1 = [user1, user2];
    sql.query(
      `select * from friend_list where (user1 in (?) AND user2 in (?)) OR (user1 in (?) AND user2 in (?))`,
      [user1, user2, user2, user1],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          sql.query(
            `insert into friend_list (user1, user2, status) values (?, ?, ?)`,
            [user1, user2, status],
            (err, result1) => {
              if (err) {
                if (err.errno == 1452) {
                  response_obj["success"] = 1;
                  response_obj["message"] =
                    "there is no such user in our data base with user id you have given so we can not insert that information";
                  res.status(200).send(response_obj);
                } else {
                  throw err;
                }
              } else {
                response_obj["success"] = 1;
                response_obj["data"] = {
                  user1: user1,
                  user2: user2,
                  status: status,
                };
                response_obj["message"] =
                  "above data is inserted in database successfully";
                res.status(200).send(response_obj);
              }
            }
          );
        } else {
          response_obj["success"] = 1;
          response_obj["message"] =
            "data associated with given users is already there in the database";
          res.status(200).send(response_obj);
        }
      }
    );
  }
};

///////////////////////////    update    ////////////////////////////
exports.friendlistupdate = function (req, res) {
  const params = req.body;
  const id = params.id;
  const newstatus = params.newstatus;
  var response_obj = {};
  if (id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "you must provide an id";
    res.status(200).send(response_obj);
  } else {
    sql.query(`select * from friend_list where id = ${id}`, (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        response_obj["success"] = 1;
        response_obj["message"] = "no user found with the id you provided";
        res.status(200).send(response_obj);
      } else {
        let oldstatus = result[0].status;
        oldstatus =
          oldstatus != newstatus && newstatus != null ? newstatus : oldstatus;
        sql.query(
          `update friend_list set status = ? where id = ?`,
          [oldstatus, id],
          (err, result1) => {
            if (err) throw err;
            if (result1.affectedRows == 0) {
              response_obj["success"] = 1;
              response_obj["message"] = "no row updated";
              res.status(200).send(response_obj);
            } else {
              response_obj["success"] = 1;
              response_obj["data"] = {
                id: id,
                user1: result[0].user1,
                user2: result[0].user2,
                status: oldstatus,
              };
              response_obj["message"] = "data updated as above shown";
              res.status(200).send(response_obj);
            }
          }
        );
      }
    });
  }
};

///////////////////////////    delete   ////////////////////////////
exports.friendlistdelete = function (req, res) {
  const params = req.body;
  id = params.id;
  var response_obj = {};
  var finalArr = [];
  if (id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter id to be deleted";
    res.status(200).send(response_obj);
  } else {
    sql.query(`delete from friend_list where id = ?`, [id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows == 0) {
        response_obj["success"] = 1;
        response_obj["message"] =
          "no such friend info to be deleted having id given by you";
        res.status(200).send(response_obj);
      } else {
        response_obj["success"] = 1;
        response_obj["message"] = "friend details deleted succesfully";
        res.status(200).send(response_obj);
      }
    });
  }
};

/////////////////////////////////////   friend request /////////////////////////////
exports.firendrequest = function (req, res) {
  const params = req.body;
  const requester_id = params.user1;
  const requesting_id = params.user2;
  const ids = [requester_id, requesting_id];
  let response_obj = {};
  if (requesting_id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "please enter user1's id";
    res.status(200).send(response_obj);
  } else if (requester_id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "please enter user2's id";
    res.status(200).send(response_obj);
  } else {
    sql.query(
      `select * from friend_list where (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)`,
      [requesting_id, requester_id, requester_id, requesting_id],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          sql.query(
            `insert into friend_list(user1, user2, status) values (?, ?, ?)`,
            [requester_id, requesting_id, 1],
            (err, result1) => {
              if (err) throw err;
              response_obj["success"] = 1;
              response_obj["data"] = {
                user1: requester_id,
                user2: requesting_id,
                status: 1,
              };
              response_obj["message"] = "request send succesfully";
              res.status(200).send(response_obj);
            }
          );
        } else if (result[0].status == 2) {
          response_obj["success"] = 1;
          response_obj["message"] = "both are already friend of each other";
          res.status(200).send(response_obj);
        } else {
          response_obj["success"] = 1;
          response_obj["message"] = "req already sent";
          res.status(200).send(response_obj);
        }
      }
    );
  }
};

///////////////find mutual friends////////////////////////

exports.mutualfriends = function (req, res) {
  const params = req.body;
  const user1 = params.user1;
  const user2 = params.user2;
  var response_obj = [];
  var user1Friend = [];
  var user2Friend = [];
  var array1 = [];

  var array2 = [];
  sql.query(
    `select * from friend_list where (user1 = ? OR user2 = ?) AND status = ?`,
    [user1, user1, 2],
    (err, result) => {
      if (err) throw err;
      async.forEachOf(
        result,
        (res, key, callback) => {
          for (let i = 0; i < result.length; i++) {
            array1.push(res.user2, res.user1);
          }
          user1Friend = result;
          callback();
        },
        (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log(user1Friend);
            array1.push(8,4)
            sql.query(
              `select * from friend_list where (user1 = ? OR user2 = ?) AND status = ?`,
              [user2, user2, 2],
              (err, result) => {
                if (err) throw err;
                async.forEachOf(
                  result,
                  (res, key, callback) => {
                    for (let i = 0; i < result.length; i++) {
                      array2.push(res.user2, res.user1);
                    }
                    user2Friend = result;
                    callback();
                  },
                  (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(user2Friend);
                      console.log("array 1", array1);
                      console.log("array 2", array2);
                      const filteredArray = array1.filter((value) =>
                        array2.includes(value)
                      );
                      var temp = { success: 1, mutualfriends: filteredArray };
                      console.log({ mutualfriends: filteredArray });
                      res.status(200).send(temp);
                    }
                  }
                );
              }
            );
          }
        }
      );
    }
  );
};

///////////////////////dump yard
// sql.query(
//   `select * from friend_list where (user1 = ? OR user2 = ?) AND status = ?`,
//   [user2, user2, 2],
//   (err, result) => {
//     if (err) throw err;
//     user2Friend = result;
//     console.log(user2Friend);
//   }
// );

// sql.query(`select * from friend_list where (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)`,[user1, user2, user2, user1], (err, result)=>{
//   if(err) throw err;
//   response_obj = result;

// })
////////////////////////dump yard




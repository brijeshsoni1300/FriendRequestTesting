var sql = require("../../db");

///////////////////////////    insert    ////////////////////////////
exports.userinfoinsert = function (req, res) {
  const params = req.body;
  const user_id = params.user_id;
  const name = params.name;
  const username = params.username;
  const location = params.location;
  const image_url = params.image_url;
  const account_type = params.account_type;
  const bio = params.bio;
  const fullname = params.fullname;
  var response_obj = {};
  var finalArr = [];
  if (user_id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter user_id";
    res.status(200).send(response_obj);
  } else if (name == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter name";
    res.status(200).send(response_obj);
  } else if (username == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter username";
    res.status(200).send(response_obj);
  } else if (location == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter location";
    res.status(200).send(response_obj);
  } else if (image_url == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter image_url";
    res.status(200).send(response_obj);
  } else if (account_type == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter account_type";
    res.status(200).send(response_obj);
  } else if (bio == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter bio";
    res.status(200).send(response_obj);
  } else if (fullname == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter fullname";
    res.status(200).send(response_obj);
  } else {
    sql.query(
      `insert into tbl_user_info (user_id, name, username, location, image_url, account_type, bio, fullname) values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        username,
        location,
        image_url,
        account_type,
        bio,
        fullname,
      ],
      (err, result) => {
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
            user_id: user_id,
            name: name,
            username: username,
            location: location,
            account_type: account_type,
            bio: bio,
            fullname: fullname,
          };
          response_obj["message"] =
            "above data is inserted in database successfully";
          res.status(200).send(response_obj);
        }
      }
    );
  }
};

///////////////////////////    update    ////////////////////////////
exports.userinfoupdate = function (req, res) {
  const params = req.body;
  const id = params.id;
  const newname = params.newname;
  const newusername = params.newusername;
  const newlocation = params.newlocation; 
  const newimage_url = params.newimage_url;
  const newaccount_type = params.newaccount_type;
  const newbio = params.newbio;
  const newfullname = params.newfullname;
  const response_obj = {};
  if (id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "you must have to enter id";
    res.status(200).send(response_obj);
  } else {
    sql.query(
      `select * from tbl_user_info where id = ?`,
      [id],
      (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          response_obj["success"] = 1;
          response_obj["message"] = "no user found with the given id";
          res.status(200).send(response_obj);
        } else {
          let oldname = result[0].name;
          let oldusername = result[0].username;
          let oldlocation = result[0].location;
          let oldimage_url = result[0].image_url;
          let oldaccount_type = result[0].account_type;
          let oldbio = result[0].bio;
          let oldfullname = result[0].fullname;
          let oldid = result[0].id;

          oldname = oldname != newname && newname != null ? newname : oldname;
          oldusername =
            oldusername != newusername && newusername != null
              ? newusername
              : oldusername;
          oldlocation =
            oldlocation != newlocation && newlocation != null
              ? newlocation
              : oldlocation;
          oldimage_url =
            oldimage_url != newimage_url && newimage_url != null
              ? newimage_url
              : oldimage_url;
          oldaccount_type =
            oldaccount_type != newaccount_type && newaccount_type != null
              ? newaccount_type
              : oldaccount_type;
          oldbio = oldbio != newbio && newbio != null ? newbio : oldbio;
          oldfullname =
            oldfullname != newfullname && newfullname != null
              ? newfullname
              : oldfullname;

          sql.query(
            `update tbl_user_info set name=?, username=?, location=?, image_url=?, account_type=?, bio=?, fullname=? where id = ${oldid}`,
            [
              oldname,
              oldusername,
              oldlocation,
              oldimage_url,
              oldaccount_type,
              oldbio,
              oldfullname,
            ],
            (err, result1) => {
              if (err) throw err;
              if (result1.affectedRows == 0) {
                response_obj["success"] = 1;
                response_obj["message"] = "no row updated";
                res.status(200).send(response_obj);
              } else {
                response_obj["success"] = 1;
                response_obj["data"] = {
                  id: oldid,
                  name: oldname,
                  username: oldusername,
                  location: oldlocation,
                  image_url: oldimage_url,
                  account_type: oldaccount_type,
                  bio: oldbio,
                  fullname: oldfullname,
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

///////////////////////////    delete   ////////////////////////////
exports.userinfodelete = function (req, res) {
  const params = req.body;
  id = params.id;
  var response_obj = {};
  var finalArr = [];
  if (id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter id to be deleted";
    res.status(200).send(response_obj);
  } else {
    sql.query(`delete from tbl_user_info where id = ?`, [id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows == 0) {
        response_obj["success"] = 1;
        response_obj["message"] =
          "no such user info to be deleted having id given by you";
        res.status(200).send(response_obj);
      } else {
        response_obj["success"] = 1;
        response_obj["message"] = "User info deleted succesfully";
        res.status(200).send(response_obj);
      }
    });
  }
};

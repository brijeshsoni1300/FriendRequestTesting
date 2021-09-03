var sql = require("../../db");
///////////////////////////    insert    ////////////////////////////
exports.fileinsert = function (req, res) {
  const params = req.body;
  const user_id = params.user_id;
  const file_url = params.file_url;
  const file_type = params.file_type;
  var response_obj = {};
  var finalArr = [];
  if (user_id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter user_id";
    res.status(200).send(response_obj);
  } else if (file_url == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter file_url";
    res.status(200).send(response_obj);
  } else if (file_type == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter file_type";
    res.status(200).send(response_obj);
  } else {
    sql.query(
      `insert into tbl_file (user_id, file_url, file_type) values (?, ?, ?)`,
      [user_id, file_url, file_type],
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
            file_url: file_url,
            file_type: file_type,
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
exports.fileupdate = function (req, res) {
  const params = req.body;
  const id = params.id;
  const newfile_url = params.newfile_url;
  const newfile_type = params.newfile_type;
  const response_obj = {};
  if (id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "you must provide an id";
    res.status(200).send(response_obj);
  } else {
    sql.query(`select * from tbl_file where id = ?`, [id], (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        response_obj["success"] = 1;
        response_obj["message"] = "no user found with the id you provided";
        res.status(200).send(response_obj);
      } else {
        let oldfile_url = result[0].file_url;
        let oldfile_type = result[0].file_type;
        oldfile_type =
          oldfile_type != newfile_type && newfile_type != null
            ? newfile_type
            : oldfile_type;
        oldfile_url =
          oldfile_url != newfile_url && newfile_url != null
            ? newfile_url
            : oldfile_url;
        sql.query(
          `update tbl_file set file_type = ?, file_url = ? where id = ${id} `,
          [oldfile_type, oldfile_url],
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
                file_type: oldfile_type,
                file_url: oldfile_url,
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
exports.filedelete = function (req, res) {
  const params = req.body;
  id = params.id;
  var response_obj = {};
  var finalArr = [];
  if (id == null) {
    response_obj["success"] = 1;
    response_obj["message"] = "Enter id to be deleted";
    res.status(200).send(response_obj);
  } else {
    sql.query(`delete from tbl_file where id = ?`, [id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows == 0) {
        response_obj["success"] = 1;
        response_obj["message"] =
          "no such file info to be deleted having id given by you";
        res.status(200).send(response_obj);
      } else {
        response_obj["success"] = 1;
        response_obj["message"] = "file deleted succesfully";
        res.status(200).send(response_obj);
      }
    });
  }
};

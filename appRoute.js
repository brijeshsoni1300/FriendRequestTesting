"use strict";

module.exports = function (app) {
  var Controller = require(".//app/controller/controller");
  var tbl_user = require(".//app/controller/tbl_user");
  var tbl_user_info = require(".//app/controller/tbl_user_info");
  var tbl_files = require(".//app/controller/tbl_files");
  var friend_list = require(".//app/controller/friend_list");
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  //////tbl_user
  app.all("/userinsert", tbl_user.userinsert);
  app.all("/userupdate", tbl_user.userupdate);
  app.all("/userdelete", tbl_user.userdelete);
  app.all("/getallusers", tbl_user.getallusers);

  //////tbl_user_info
  app.all("/userinfoinsert", tbl_user_info.userinfoinsert);
  app.all("/userinfoupdate", tbl_user_info.userinfoupdate);
  app.all("/userinfodelete", tbl_user_info.userinfodelete);

  //////tbl_files
  app.all("/fileinsert", tbl_files.fileinsert);
  app.all("/fileupdate", tbl_files.fileupdate);
  app.all("/filedelete", tbl_files.filedelete);

  //////friend_list
  app.all("/friendlistinsert", friend_list.friendlistinsert);
  app.all("/friendlistupdate", friend_list.friendlistupdate);
  app.all("/friendlistdelete", friend_list.friendlistdelete);  
  app.all("/firendrequest", friend_list.firendrequest);  
  app.all("/mutualfriends", friend_list.mutualfriends);  
};

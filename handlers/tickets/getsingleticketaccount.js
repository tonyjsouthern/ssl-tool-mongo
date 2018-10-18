function getSingleTicketAccount (req, res, next) {

  req.db.collection(req.collection).findOne({ accountname: req.params.accountname }, function(err, doc) {
    if (err) {
      console.log("Failed to get ticket");
      console.log(doc)
    } else {
      if (doc == null) {
        res.send("false")
      }else{
        res.send(doc)
      }
    }
  });
}

module.exports = getSingleTicketAccount;

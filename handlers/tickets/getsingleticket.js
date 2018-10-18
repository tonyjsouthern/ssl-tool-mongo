function getSingleTicket (req, res, next) {
  req.db.collection(req.collection).findOne({ _id: new req.object_id(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get ticket");
    } else {
      res.status(200).json(doc);
    }
  });
}

module.exports = getSingleTicket;

function deleteTicket (req, res, next) {
  var id = req.params.id
  req.db.collection(req.collection).deleteOne({_id: new req.object_id(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete ticket");
    } else {
      res.send("Item deleted: " + id)
      res.status(204).end();
    }
  });
}

module.exports = deleteTicket;

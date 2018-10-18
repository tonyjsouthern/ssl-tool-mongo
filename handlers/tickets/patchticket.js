function patchTicket (req, res, nect) {
  var updateDoc = req.body;
  delete updateDoc._id;

  req.db.collection(req.collection).update({_id: new req.object_id(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.send(updateDoc)
      res.status(204).end();
    }
  });
}

module.exports = patchTicket;

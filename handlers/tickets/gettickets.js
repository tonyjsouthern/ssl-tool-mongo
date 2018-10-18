function getTickets (req, res, next) {
    req.db.collection(req.collection).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get tickets.");
      } else {
        res.status(200).json(docs);
      }
    });
  }

module.exports = getTickets;

function createTicket (req, res, next) {
    var newTicket = req.body;
    newTicket.createDate = new Date();

  // require some field
  //  if (!(req.body.ticketname || req.body.ticketname)) {
  //    handleError(res, "Invalid user input", "Must provide a ticketname.", 400);
  //  }

    req.db.collection(req.collection).insertOne(newTicket, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new ticket.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }


module.exports = createTicket;

function getSingleZendesk(req, res, next) {
  var id = req.params.id
  req.axios.get('https://salesfusion.zendesk.com/api/v2/tickets/' + id + '.json', {
      auth: {
        username: process.env.ZENDESK_USERNAME,
        password: process.env.ZENDESK_PASSWORD
      }
    }).then(function(response) {
      res.send(response.data.ticket)
    })
    .catch((error) => {
      // Error
      if (error.response) {
        console.log(error.response.data.error);
        if (error.response.data.error == 'RecordNotFound') {
          res.send("Ticket Deleted")
        } else {
          res.send("Ticket Deleted or NA")
        }

      } else if (error.request) {
        if (error.response.data.error == 'RecordNotFound') {
          res.send("Ticket Deleted")
        } else {
          res.send("Ticket Deleted or NA")
        }

        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        //console.log(error.request);
      } else {
        if (error.response.data.error == 'RecordNotFound') {
          res.send("Ticket Deleted")
        } else {
          res.send("Ticket Deleted or NA")
        }
        // Something happened in setting up the request that triggered an Error
        //console.log('Error 231', error.message);
      }
    });
}

module.exports = getSingleZendesk;






/*

function getSingleZendesk (req, res, next) {
  var id = req.params.id
  req.axios.get('https://salesfusion.zendesk.com/api/v2/tickets/'+ id + '.json', {
    auth: {
      username: process.env.ZENDESK_USERNAME,
      password: process.env.ZENDESK_PASSWORD
    }
  }).then(function (response) {
      res.send(response.data.ticket)
    })
    .catch(function (error) {
      res.send(error)
    });
  }

module.exports = getSingleZendesk;


*/

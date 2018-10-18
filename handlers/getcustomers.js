function getCustomers(req, res,next) {
  req.connection.query('select accountname, ssl_in_use__c, ssl_expiration_date__c from Accounts where ssl_in_use__c = \'true\' and SSL_Expiration_Date__c <= dateadd(day, +30, getdate()) order by 3 asc').spread(function(results) {
    res.send(results);
  })
}


module.exports = getCustomers

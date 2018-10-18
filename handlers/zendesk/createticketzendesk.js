function createTicketZendesk (req, res, next) {
  var customername = req.body.accountname
  var subject = customername + ' SSL Renewal'
  // change this to include the expiration date
  var comment = `

----------INTERNAL USE ONLY----------
For an overview of the normal install process you can visit the following document: https://salesfusion.atlassian.net/wiki/spaces/TS/pages/633667608/SSL+Basics

Renewal Steps:

1) Use the admin controller to gather the customers CNAMES or run the following query on the controller db:
select hostedlink, cookieserver from customer where domainname like '%automate%'

2) Visit the following website and enter one of the customers CNAMES. Gather the below information:
A. Expiration Date
B. What type of certificate the customer has. To determine certificate type visit this article: https://goo.gl/REg4Lv

After the above information has been gathered, visit the certs google drive folder (https://goo.gl/3jPa2p). Locate the customers folder. Check the files in that folder to see if a CSR is present.If a CSR is present, this means we generated it for them and will need to send this to them again so that a new certificate may be generated. If no CSR is present, this likely means thecustomer generated it themselves and we do not need to send one over.

3) In the customers certificate folder and create a folder called "Old Certificate"
4) Place the existing CSR and CRT files into the folder
5) Copy the Sharing link to your clipboard and use it in the example below.
6) Reach out to the customer with the below example and let them know the SSL certificate will be expiring on the date gathered. Attach the CSR if it is needed.
7) Once you have received the SSL files, create a Jira using the "SSL Setup" Zendesk macro.
8) After the certificate is installed and you have received notification from the Jira, create a new email to Luke (luke.miller@salesfusion.com) with the customer name and NEW SSL expiration date. He will then update this information in Salesforce

Example:
Hi {ENTER CUSTOMER NAME},

I am reaching out notify you that the SSL certificate covering your Salesfusion CNAMES ({ENTER CNAMES HERE}) will be expiring on {ENTER DATE HERE}.
We would like to go ahead and get this taken care of for you. You can simply upload the new certificates into the following google drive folder: {ENTER DRIVE URL HERE} Once they are uploaded we can then install them on our servers and we should be all set!

{ONLY USE IF WE GENERATED THE CSR}
I have attached the CSR used to generate the certificate originally and you should be able to re-use this for the new certificates if your CNAMES will remain the same.

If you have any questions about this process please feel free to reach out!

Thanks!
`

  req.axios({
   method: 'post',
   url: 'https://salesfusion.zendesk.com/api/v2/tickets.json',
   auth: {
     username: process.env.ZENDESK_USERNAME,
     password: process.env.ZENDESK_PASSWORD
   },
   data: {
     "ticket": {
       "requester_id": null,
       "subject": subject,
       "comment": {
         "public": false,
         "body": comment
       }
     }
   }
 }).then(function(response){
   res.send(JSON.stringify(response.data.ticket.id));
 })
}

module.exports = createTicketZendesk;

module.exports = {
//  getCustomerBaseInfo:    require("./handlers/getCustomerBaseInfo.js"),
  getTickets: require("./handlers/tickets/gettickets.js"),
  createTicket: require("./handlers/tickets/createticket.js"),
  getSingleTicket: require("./handlers/tickets/getsingleticket.js"),
  getSingleTicketAccount: require("./handlers/tickets/getsingleticketaccount.js"),
  patchTicket: require("./handlers/tickets/patchticket.js"),
  deleteTicket: require("./handlers/tickets/deleteticket.js"),
  getCustomers: require("./handlers/getcustomers.js"),
  getSingleZendesk: require("./handlers/zendesk/getsinglezendesk.js"),
  createTicketZendesk: require("./handlers/zendesk/createticketzendesk.js")
}

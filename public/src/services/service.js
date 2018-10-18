export class TicketService {
  constructor() {
    this.baseURL = 'http://10.68.2.183'
    this.localURL = 'http://localhost'
  }

  getTickets() {
    return axios.get(this.baseURL  + ':8000/tickets')
  }

  getCustomers() {
    return axios.get(this.baseURL  + ':8000/customers')
  }

  createTicketInDB (ticketObject) {
    return axios.post(this.baseURL  + ':8000/tickets', {
      accountname: ticketObject.accountname,
      ssl_expiration_date__c: ticketObject.ssl_expiration_date__c,
      ticket_number: "",
      status: "Create-Ticket",
      zdStatus: "",
      zdUrl: "",
      slug: encodeURIComponent(ticketObject.accountname)
    })
  }

  getTicketByAccount(acct) {
    return axios.get(this.baseURL  + ':8000/tickets/account/' + acct)
  }

  createZendeskTicket(accountname, date) {
    return axios.post(this.baseURL  + ':8000/zendesk', {
      accountname: accountname,
      expiration: date
    })
  }

  updateTicket(object, id, ticketId, ticketStatus) {
    return axios.put(this.baseURL  + ':8000/tickets/' + id, {
      _id: object._id,
      accountname: object.accountname,
      ssl_expiration_date__c: object.ssl_expiration_date__c,
      ticket_number: ticketId,
      createDate: object.createDate,
      status: "Ticket-Already-Created",
      zdStatus: ticketStatus,
      zdUrl: "",
      slug: encodeURIComponent(object.accountname)
    })
  }

  getZendeskTicket (id) {
    return axios.get(this.baseURL  + ':8000/zendesk/' + id)
  }
}

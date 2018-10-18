import {
  inject
} from 'aurelia-framework';
import {
  TicketService
} from './src/services/service.js';

@inject(TicketService)

export class Logs {

  constructor(TicketService) {
    this.ticketService = TicketService;
    this.tickets = []
  }

  activate () {
    this.getTickets();
    console.log(this.tickets)
  }

  getTickets () {
    this.ticketService.getTickets().then( response => {
      response.data.forEach( data => {
        this.tickets.push(data)
      })
    })
  }
}

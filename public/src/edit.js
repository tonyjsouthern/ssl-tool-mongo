import {
  inject
} from 'aurelia-framework';

import { Router } from 'aurelia-router';

import {
  TicketService
} from './src/services/service.js';

@inject(TicketService)
export class Edit {

  constructor (TicketService, Router) {
    this.ticketService = TicketService
    this.router = Router;
    this.ticket;
    this.id;
    this.ticketId;
    this.zdStatus;
    this.accountName;
  }

  activate(params) {
    this.slug = encodeURIComponent(params.slug);
    console.log(this.slug)
    new Promise((resolve, reject) => {
      // encode the accountname to be passed into API call
      var acctName = this.slug;
      // get the record from the DB
      var ticketPromise = this.ticketService.getTicketByAccount(acctName)
      resolve(ticketPromise)
      })
      .then( response => {
        this.ticket = response.data
        this.id = response.data._id
        this.zdStatus = "Open"
        this.accountName = response.data.accountname
    })
  }

  updateTicketNumber() {
    this.ticketService.updateTicket(this.ticket, this.id, this.ticketId, this.zdStatus).then( response => {
      location.assign('/#/');
    })
  }



}

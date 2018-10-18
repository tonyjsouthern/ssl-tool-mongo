import {
  inject
} from 'aurelia-framework';
import {
  TicketService
} from './src/services/service.js';

@inject(TicketService)
export class Index {

  constructor(TicketService) {
    this.ticketService = TicketService;
    this.customers;
    this.tickets = [];
    this.status;
    this.recursiveNumTicket = 0;
    this.recursiveNumDB = 0;
    this.recursiveNum = 0;
    this.loadingModalValue = true;
    this.editModalValue = false;
  }

  activate() {
    new Promise((resolve, reject) => {
        var customerPromise = this.setCustomers();
        resolve(customerPromise);
        console.log("First Promise")
      })
      .then(() => {
        console.log("Second Promise")
        return this.setZendeskStatus();
      })
      .then(() => {
        console.log("Third Promise")
        return this.writeTicketsToDB();
      })
      .then(() => {
        console.log("Fourth Promise")
        return this.setTickets()
      })
  }


  setCustomers() {
    return this.ticketService.getCustomers().then(response => {
      this.customers = response.data
    })
  }

  setTickets() {
    if (this.recursiveNumTicket <= this.customers.length - 1) {
      return this.ticketService.getTickets().then(response => {
        return new Promise((resolve, reject) => {
            // encode the accountname to be passed into API call
            var acctName = encodeURIComponent(this.customers[this.recursiveNumTicket].accountname);
            // get the record from the DB
            var ticketPromise = this.ticketService.getTicketByAccount(acctName)
            resolve(ticketPromise)
          })
          .then(response => {
            this.tickets.push(response.data)
            this.recursiveNumTicket++
              this.setTickets()
          })
      })
    } else {
      this.recursiveNumTicket = 0
      this.loadingModalValue = false;
      console.log("Setting tickets completed")
    }
  }

  setZendeskStatus() {
    var ticketData;
    var ticketNum;
    var status;
    var dbTicketID;

    if (this.recursiveNum <= this.customers.length - 1) {
      return new Promise((resolve, reject) => {
          // encode the accountname to be passed into API call
          var acctName = encodeURIComponent(this.customers[this.recursiveNumDB].accountname);
          // get the record from the DB
          var ticketPromise = this.ticketService.getTicketByAccount(acctName)
          resolve(ticketPromise)
        })
        .then(response => {
          if (response.data.ticket_number != "") {
            ticketData = response.data
            ticketNum = response.data.ticket_number
            dbTicketID = ticketData._id
            this.ticketService.getZendeskTicket(response.data.ticket_number).then(response => {
              if (response.data.status == undefined) {
                status = response.data
                ticketNum = "99999"
              } else {
                status = response.data.status
              }
              //  console.log(response.data.status, ticketData, ticketNum, status)
              this.ticketService.updateTicket(ticketData, dbTicketID, ticketNum, status)
            })
          } else {
            // console.log("No Ticket Found")
          }
          this.recursiveNum++
            this.setZendeskStatus();
        })
    } else {
      console.log("Updating Zendesk Ticket Status completed.")
      this.recursiveNum = 0;
    }
  }

  writeTicketsToDB() {
    // check to see if the recursive number is less than array length
    if (this.recursiveNumDB <= this.customers.length - 1) {
      // create new promise
      return new Promise((resolve, reject) => {
          // encode the accountname to be passed into API call
          var acctName = encodeURIComponent(this.customers[this.recursiveNumDB].accountname);
          // get the record from the DB
          var ticketPromise = this.ticketService.getTicketByAccount(acctName)
          resolve(ticketPromise)
        })
        .then(response => {
          // check to see if the record exists in DB or not
          if (response.data == false) {
            // if it doesnt, create the new record
            console.log("creating " + this.customers[this.recursiveNumDB].accountname + "'s record in DB")
            this.ticketService.createTicketInDB(this.customers[this.recursiveNumDB])
          } else {
            // if it does, log to console that it already exists
            //console.log(this.customers[this.recursiveNum].accountname + " already exists within DB")
          } // end the second if
          // increment the recursive number
          this.recursiveNumDB++
            // recall the function
            return this.writeTicketsToDB()
        }) // end the response promise
    } else {
      console.log("Writing Tickets to DB Completed")
      // reset the recursive number
      this.recursiveNum = 0;
    } // end the first if
  }

  createZendeskController(event) {

    var acctName = event.toElement.value;
    var expDate = event.toElement.name;
    var currentCustomer;
    var ticketNumber;
    var status;

    new Promise((resolve, reject) => {
        var ticketObjectPromise = this.ticketService.getTicketByAccount(acctName)
        resolve(ticketObjectPromise);
        console.log("click first")
      })
      .then(response => {
        console.log("click second")
        currentCustomer = response.data
        if (event.toElement.innerHTML == "Create-Ticket") {
          return this.ticketService.createZendeskTicket(acctName, expDate).then(response => {
            ticketNumber = response.data;
            console.log(ticketNumber)
          })
        } else {
          alert("You have already created a ticket for this customer!")
        }
        console.log(currentCustomer)
      })
      .then(() => {
        console.log("click third");
        this.tickets = []
        this.ticketService.updateTicket(currentCustomer, currentCustomer._id, ticketNumber, "New")
        this.setTickets();
        this.loadingModalValue = true;
      })
  }

  closeModal() {
    this.editModalValue = false;
  }

  editTicketNumber(event) {
    console.log(event)
    this.editModalValue = true;
  }

}

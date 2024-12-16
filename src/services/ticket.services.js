import { v4 as uuid } from "uuid";
import { ticketDao } from "../dao/ticket.dao.js";
class TicketService {
  async create(amount, userMail) {
    const newTicket = {
      code: uuid(),
      purchase: userMail,
      amount,
    };
    return await ticketDao.create(newTicket);
  }
}

export const ticketService = new TicketService();

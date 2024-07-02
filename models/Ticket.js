const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const { Schema } = mongoose

const TicketSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, required: true }, // resolved, pending, rejected
  priority: { type: String, required: true }, // low, medium, high
  title: { type: String, required: true },
  chat: {
    type: [
      {
        message: { type: String, required: true },
        sender: { type: String, required: true },
        sentAt: {
          type: Date,
          required: true
        }
      }
    ],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

TicketSchema.plugin(paginate)

module.exports = mongoose.model('Ticket', TicketSchema)

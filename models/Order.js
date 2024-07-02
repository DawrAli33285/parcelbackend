const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const { Schema } = mongoose

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: {
    name: String,
    company: String,
    phone: String,
    street1: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  receiver: {
    street1: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  details: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  carrier: { type: String, enum: ['USPS', 'UPS']},
  service: { type: String, required: true },
  rate: { type: Number, required: true },
  fulfilled: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  label: { type: Schema.Types.ObjectId, ref: 'Label' },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// OrderSchema.index(
//   { createdAt: 1 },
//   {
//     partialFilterExpression: { paid: false },
//     expireAfterSeconds: 86400 // 24 hours
//   }
// )

OrderSchema.plugin(paginate)

module.exports = mongoose.model('Order', OrderSchema)

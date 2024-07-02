const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const { Schema } = mongoose

const AddressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

AddressSchema.plugin(paginate)

module.exports = mongoose.model('Address', AddressSchema)

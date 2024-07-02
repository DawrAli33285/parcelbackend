const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const { Schema } = mongoose

const LabelSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderID: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  labelID: { type: String, required: true },
  trackingID: { type: String, required: true },
  pdfURL: { type: String, required: true },
  publicURL: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

LabelSchema.plugin(paginate)

module.exports = mongoose.model('Label', LabelSchema)

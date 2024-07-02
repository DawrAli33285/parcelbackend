const labelAPI = require('@lib/labelAPI')
const { getTodaysDate, convertOzToLb } = require('@lib/utils')

async function generate(order) {
  if (order.carrier === 'UPS') {
    const payload = {
      type: order.service,
      weight: convertOzToLb(order.details.weight) || 1,
      height: order.details.height,
      width: order.details.width,
      length: order.details.length,
      date: getTodaysDate(),
      fromName: 'test',
      fromStreetNumber: order.sender.street1,
      fromZip: order.sender.zip,
      fromCity: order.sender.city,
      fromState: order.sender.state,
      toName: 'test',
      toStreetNumber: order.receiver.street1,
      toZip: order.receiver.zip,
      toCity: order.receiver.city,
      toState: order.receiver.state
    }

    return labelAPI.post('/label/generate-ups', payload)
  }

  if (order.carrier === 'USPS') {
    const payload = {
      type: order.service,
      weight: convertOzToLb(order.details.weight) || 1,
      height: order.details.height,
      width: order.details.width,
      length: order.details.length,
      date: getTodaysDate(),
      fromCountry: order.sender.country,
      fromName: 'test',
      fromStreetNumber: order.sender.street1,
      fromZip: order.sender.zip,
      fromCity: order.sender.city,
      fromState: order.sender.state,
      toCountry: order.receiver.country,
      toName: 'test',
      toStreetNumber: order.receiver.street1,
      toZip: order.receiver.zip,
      toCity: order.receiver.city,
      toState: order.receiver.state
    }

    return labelAPI.post('/label/generate', payload)
  }

  throw new Error('Invalid carrier')
}

module.exports = generate

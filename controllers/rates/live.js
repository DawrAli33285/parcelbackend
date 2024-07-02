const EasyPostClient = require('@easypost/api')

const client = new EasyPostClient(process.env.EASY_POST_API_KEY)

module.exports = async (req, res, next) => {
  try {
    const smallShipment = await client.Shipment.create({
      to_address: {
        name: 'Dr. Steve Brule',
        street1: '179 N Harbor Dr',
        city: 'Redondo Beach',
        state: 'CA',
        zip: '90277',
        country: 'US',
        phone: '310-808-5243'
      },
      from_address: {
        name: 'EasyPost',
        street1: '164 Townsend St',
        street2: 'Unit 1',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'US',
        phone: '415-456-7890'
      },
      parcel: {
        // Small Shipment
        length: 8,
        width: 6,
        height: 4,
        weight: 10
      }
    })

    if (smallShipment.rates.length === 0) {
      return res.status(400).json({
        message: 'No rates found for the given shipment'
      })
    }

    let smallLR = smallShipment.rates[0].rate || 0
    smallShipment.rates.forEach(rate => {
      if (rate.rate < smallLR) {
        smallLR = rate.rate
      }
    })

    const mediumShipment = await client.Shipment.create({
      to_address: {
        name: 'Dr. Steve Brule',
        street1: '179 N Harbor Dr',
        city: 'Redondo Beach',
        state: 'CA',
        zip: '90277',
        country: 'US',
        phone: '310-808-5243'
      },
      from_address: {
        name: 'EasyPost',
        street1: '164 Townsend St',
        street2: 'Unit 1',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'US',
        phone: '415-456-7890'
      },
      parcel: {
        // Medium Shipment
        length: 12,
        width: 10,
        height: 8,
        weight: 20
      }
    })

    if (mediumShipment.rates.length === 0) {
      return res.status(400).json({
        message: 'No rates found for the given shipment'
      })
    }

    let mediumLR = mediumShipment.rates[0].rate || 0
    mediumShipment.rates.forEach(rate => {
      if (rate.rate < mediumLR) {
        mediumLR = rate.rate
      }
    })

    const largeShipment = await client.Shipment.create({
      to_address: {
        name: 'Dr. Steve Brule',
        street1: '179 N Harbor Dr',
        city: 'Redondo Beach',
        state: 'CA',
        zip: '90277',
        country: 'US',
        phone: '310-808-5243'
      },
      from_address: {
        name: 'EasyPost',
        street1: '164 Townsend St',
        street2: 'Unit 1',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'US',
        phone: '415-456-7890'
      },
      parcel: {
        // Large Shipment
        length: 24,
        width: 20,
        height: 16,
        weight: 30
      }
    })

    if (largeShipment.rates.length === 0) {
      return res.status(400).json({
        message: 'No rates found for the given shipment'
      })
    }

    let largeLR = largeShipment.rates[0].rate || 0
    largeShipment.rates.forEach(rate => {
      if (rate.rate < largeLR) {
        largeLR = rate.rate
      }
    })

    return res.json({
      small: Number(smallLR).toFixed() || 0,
      medium: Number(mediumLR).toFixed() || 0,
      large: Number(largeLR).toFixed() || 0
    })
  } catch (error) {
    return next(error)
  }
}

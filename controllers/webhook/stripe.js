const Email = require('@lib/email')
const { generateLabel } = require('@lib/labels')
const Label = require('@models/Label')
const Order = require('@models/Order')
const uploadAPI = require('@lib/uploadAPI')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const eventData = event.data.object
      const info = eventData.metadata

      try {
        const order = await Order.findOne({
          _id: info.orderID,
          paid: false
        }).populate('user')

        if (!order) {
          return res.status(400).send('Order not found')
        }

        // Update the order to paid
        await Order.updateOne(
          {
            _id: order._id
          },
          {
            paid: true
          }
        )

        // Generate a shipping label and email it to the user
        const { data: labelInfo } = await generateLabel(order)
        if (!labelInfo) {
          return res.status(500).send('Failed to generate label')
        }

        // Upload to cloudinary
        const asset = await uploadAPI.upload(labelInfo.payload.pdf, {
          folder: 'labels',
          resource_type: 'auto'
        })

        const label = new Label({
          user: order.user,
          orderID: order._id,
          labelID: labelInfo.payload.id,
          trackingID: labelInfo.payload.code,
          pdfURL: labelInfo.payload.pdf,
          publicURL: asset.secure_url
        })

        await label.save()

        await Order.updateOne(
          {
            _id: order._id
          },
          {
            paid: true,
            label: label._id,
            fulfilled: true
          }
        )

        // Send the email
        await Email.sendLabelEmail(order.user.email, asset.secure_url)
      } catch (err) {
        console.log(err)
        return res.status(500).json(err)
      }
      break
    }
    default: {
      console.log(`Unhandled event type ${event.type}`)
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.send()
}

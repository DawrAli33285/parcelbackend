const Email = require('@lib/email')
const { generateLabel } = require('@lib/labels')
const uploadAPI = require('@lib/uploadAPI')
const Label = require('@models/Label')
const Order = require('@models/Order')

module.exports = async (req, res) => {
  const { sign } = req.body

  if (!sign) {
    return res.status(400).send('Invalid payload')
  }

  const data = JSON.parse(req.rawBody)
  delete data.sign

  const hash = crypto
    .createHash('md5')
    .update(
      Buffer.from(JSON.stringify(data)).toString('base64') +
        process.env.CRYPTOMUS_API
    )
    .digest('hex')

  if (hash !== sign) {
    return res.status(400).send('Invalid sign')
  }

  if (data.status === 'paid' || data.status === 'paid_over') {
    try {
      const order = await Order.findOne({
        _id: data.order_id,
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
      console.error(err)
      return res.status(500).send('Error generating label')
    }
  }

  return res.send(200)
}

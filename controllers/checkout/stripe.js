const { getUSPSParcelService, getUPSParcelService } = require('@lib/labels')
const { PEZodBadRequest } = require('@lib/parcelError')
const Order = require('@models/Order')
const Rate = require('@models/Rate')
const httpStatus = require('http-status')
const { z } = require('zod')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        rateID: z.string(),
        shippingSpeed: z.string()
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const rate = await Rate.findOne({ _id: data.rateID, user: req.user._id })

    if (!rate) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Order not found'
      })
    }

    const serviceName =
      rate.carrier === 'USPS'
        ? getUSPSParcelService(data.shippingSpeed) || undefined
        : getUPSParcelService(data.shippingSpeed) || undefined
    if (!serviceName) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Invalid shipping speed'
      })
    }

    const price = rate.rates[serviceName]
    const orderDetails = {
      user: rate.user,
      sender: rate.sender,
      receiver: rate.receiver,
      details: rate.details,
      carrier: rate.carrier,
      service: serviceName,
      rate: price
    }

    const order = await new Order(orderDetails).save()

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${rate.carrier} ${data.shippingSpeed} Shipping Label`
            },
            unit_amount: (price * 100).toFixed(0)
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      customer_email: req.user.email,
      metadata: {
        userID: String(req.user._id),
        orderID: String(order._id)
      },
      success_url: `${process.env.FRONTEND_URL}/dashboard/order/step-5?success=true&id=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/order/step-5?canceled=true`
    })

    return res.status(httpStatus.OK).json({
      redirectURL: session.url
    })
  } catch (err) {
    return next(err)
  }
}

const { PEZodBadRequest } = require('@lib/parcelError')
const Order = require('@models/Order')
const axios = require('axios')
const httpStatus = require('http-status')
const { z } = require('zod')
const crypto = require('crypto')
const Rate = require('@models/Rate')
const { getUSPSParcelService, getUPSParcelService } = require('@lib/labels')

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

    const payload = {
      amount: `${price}`,
      currency: 'USD',
      order_id: String(order._id),
      url_callback: `${req.protocol}://${req.get('host')}/api/webhook/cryptomus`,
      url_return: `${process.env.FRONTEND_URL}/dashboard/order/step-5?canceled=true`,
      url_success: `${process.env.FRONTEND_URL}/dashboard/order/step-5?success=true&id=${order._id}`
    }

    const sign = crypto
      .createHash('md5')
      .update(
        Buffer.from(JSON.stringify({ ...payload })).toString('base64') +
          process.env.CRYPTOMUS_API
      )
      .digest('hex')

    const invoice = await axios.post(
      'https://api.cryptomus.com/v1/payment',
      payload,
      {
        headers: {
          merchant: process.env.CRYPTOMUS_MERCHANT_ID,
          sign
        }
      }
    )

    return res.status(httpStatus.OK).json({
      redirectURL: invoice.data.result.url
    })
  } catch (err) {
    console.log(err)
    return next(err)
  }
}

const EasyPostClient = require('@easypost/api')
const { getUPSParcelService, getUSPSParcelService } = require('@lib/labels')
const { PEZodBadRequest } = require('@lib/parcelError')
const { convertToOz } = require('@lib/utils')
const Rate = require('@models/Rate')
const { z } = require('zod')

const client = new EasyPostClient(process.env.EASY_POST_API_KEY)
module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        sender: z.object({
          name: z.string(),
          company: z.string().optional(),
          phone: z.string().optional(),
          street1: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
          country: z.enum(['US'])
        }),
        receiver: z.object({
          street1: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
          country: z.enum(['US'])
        }),
        details: z.object({
          carrier: z.enum(['USPS', 'UPS']),
          units: z.enum(['kg', 'lb', 'oz', 'gr']),
          length: z.number(),
          width: z.number(),
          height: z.number(),
          weight: z.number()
        })
      })
      .refine(values => {
        if (values.carrier === 'USPS') return true;
        if (
          values.receiver.country === 'US' &&
          values.sender.country === 'US'
        ) {
          return true;
        }
        return false;
      }, "UPS can't be used for international shipments")
      .safeParseAsync(req.body);

    if (!success) {
      return PEZodBadRequest.handler(res, error);
    }

    if (data.details.units !== 'oz') {
      data.details.weight =
        convertToOz(data.details.weight, data.details.units) || 1;
    }

    // Hardcoding carriers here
    const carriers = ['USPS', 'UPS'];
    let allRates = [];
    let services = {};
    let rateIDs = [];

    for (const carrier of carriers) {
      const carrierID =
        carrier === 'USPS'
          ? process.env.USPS_CARRIER_ACCOUNT_ID
          : process.env.UPS_CARRIER_ACCOUNT_ID;

      const { length, width, height, weight, units } = data.details;
      const parcel = { length, width, height, weight, units };

      const shipment = await client.Shipment.create({
        carrier_accounts: [carrierID],
        from_address: data.sender,
        to_address: data.receiver,
        parcel
      });

      if (shipment.rates.length === 0) {
        continue; // No rates for this carrier, try next carrier
      }

      let carrierRates = {};

      shipment.rates.forEach(rate => {
        const price = parseFloat(rate.rate);
        const isServiceAvailable =
          carrier === 'USPS'
            ? getUSPSParcelService(rate.service) || undefined
            : getUPSParcelService(rate.service) || undefined;
        if (isServiceAvailable) {
          const serviceKey = `${carrier} ${rate.service}`;
          services[serviceKey] = price;
          carrierRates[serviceKey] = price;
          allRates.push({
            carrier,
            service: isServiceAvailable,
            price
          });
        }
      });

      if (Object.keys(carrierRates).length > 0) {
        const rate = await new Rate({
          user: req.user._id,
          sender: data.sender,
          receiver: data.receiver,
          details: data.details,
          carrier: carrier, // store the carrier as a string
          rates: carrierRates
        }).save();
        rateIDs.push(rate._id);
      }
    }

    if (allRates.length === 0) {
      return res.status(400).json({
        message: 'No rates found for the given shipment'
      });
    }

    return res.json({
      rates: services,
      carrier: carriers,
      rateID: rateIDs
    });
  } catch (error) {
    return next(error);
  }
};

//here
// module.exports = async (req, res, next) => {
//   try {
//     const { success, data, error } = await z
//       .object({
//         sender: z.object({
//           name: z.string(),
//           company: z.string().optional(),
//           phone: z.string().optional(),
//           street1: z.string(),
//           city: z.string(),
//           state: z.string(),
//           zip: z.string(),
//           country: z.enum(['US'])
//         }),
//         receiver: z.object({
//           street1: z.string(),
//           city: z.string(),
//           state: z.string(),
//           zip: z.string(),
//           country: z.enum(['US'])
//         }),
//         details: z.object({
//           carrier: z.enum(['USPS', 'UPS', 'BOTH']), // Added 'BOTH' as an option
//           units: z.enum(['kg', 'lb', 'oz', 'gr']),
//           length: z.number(),
//           width: z.number(),
//           height: z.number(),
//           weight: z.number()
//         })
//       })
//       .refine(values => {
//         if (
//           values.carrier === 'USPS' ||
//           values.carrier === 'UPS' ||
//           values.carrier === 'BOTH'
//         ) return true;

//         if (
//           values.receiver.country === 'US' &&
//           values.sender.country === 'US'
//         ) return true;

//         return false;
//       }, "Carrier can only be USPS, UPS, or BOTH for US shipments")
//       .safeParseAsync(req.body);

//     if (!success) {
//       return PEZodBadRequest.handler(res, error);
//     }

//     const allowedCarriers = ['USPS', 'UPS'];

//     if (data.details.carrier === 'BOTH') {
//       data.details.carrier = allowedCarriers; // Set carrier to an array of allowed carriers
//     } else if (!allowedCarriers.includes(data.details.carrier)) {
//       return res.status(400).json({
//         message: 'Invalid carrier specified'
//       });
//     }

//     const shipments = [];
//     for (const carrier of Array.isArray(data.details.carrier) ? data.details.carrier : [data.details.carrier]) {
//       let carrierID;

//       if (carrier === 'USPS') {
//         carrierID = process.env.USPS_CARRIER_ACCOUNT_ID;
//       } else if (carrier === 'UPS') {
//         carrierID = process.env.UPS_CARRIER_ACCOUNT_ID;
//       }

//       if (data.units !== 'oz') {
//         data.details.weight =
//           convertToOz(data.details.weight, data.details.units) || 1;
//       }

//       const { carrier: currentCarrier, ...parcel } = data.details;

//       const shipment = await client.Shipment.create({
//         carrier_accounts: [carrierID],
//         from_address: data.sender,
//         to_address: data.receiver,
//         parcel
//       });

//       if (shipment.rates.length > 0) {
//         shipments.push({
//           carrier: currentCarrier,
//           rates: shipment.rates.map(rate => ({
//             service: rate.service,
//             rate: parseFloat(rate.rate),
//             carrier: currentCarrier // Include carrier information with each rate
//           }))
//         });
//       }
//     }

//     if (shipments.length === 0) {
//       return res.status(400).json({
//         message: 'No rates found for the given shipment'
//       });
//     }

//     const services = {};

//     shipments.forEach(shipment => {
//       shipment.rates.forEach(rate => {
//         console.log(rate)
//         console.log("rate")
//         // Format service key with carrier prefix
//         rate.carrier.map((val,i)=>{
//           const serviceKey = `${val} ${rate.service}`;
//           services[serviceKey] = parseFloat(rate.rate);
//         })
       
//       });
//     });

//     if (Object.keys(services).length === 0) {
//       return res.status(400).json({
//         message: 'No matching service found for the given shipment'
//       });
//     }

//     const rate = await new Rate({
//       user: req.user._id,
//       sender: data.sender,
//       receiver: data.receiver,
//       details: data.details,
//       rates: services // Use formatted services with carrier prefixes
//     }).save();

//     return res.json({
//       rates: services,
//       carrier: data.details.carrier,
//       rateID: rate._id
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

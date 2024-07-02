const generateLabel = require('./generate')

const LABEL_UPS_SERVICES = {
  Ground: 'ups_ground',
  NextDayAir: 'ups_next_day_air',
  '2ndDayAir': 'ups_2nd_day_air',
  '3DaySelect': 'ups_3_day_select',
  NextDayAirEarlyAM: 'ups_next_day_air_early'
}

const LABEL_USPS_SERVICES = {
  Priority: 'priority',
  Express: 'express',
  First: 'firstclass'
}

const STANDARD_SERVICES = [
  LABEL_UPS_SERVICES.Ground,
  LABEL_UPS_SERVICES['3DaySelect']
]

const FAST_SERVICES = [
  LABEL_USPS_SERVICES.Priority,
  LABEL_UPS_SERVICES.NextDayAir,
  LABEL_UPS_SERVICES.NextDayAirEarlyAM
]

const EXPRESS_SERVICES = [
  LABEL_UPS_SERVICES['2ndDayAir'],
  LABEL_USPS_SERVICES.First,
  LABEL_USPS_SERVICES.Express
]

module.exports = {
  LABEL_UPS_SERVICES,
  getUPSParcelService: parcelService => LABEL_UPS_SERVICES[parcelService],
  LABEL_USPS_SERVICES,
  getUSPSParcelService: parcelService => LABEL_USPS_SERVICES[parcelService],
  STANDARD_SERVICES,
  FAST_SERVICES,
  EXPRESS_SERVICES,
  generateLabel
}

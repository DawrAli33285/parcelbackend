const nodemailer = require('nodemailer')
const ejs = require('ejs')

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    })
  }

  sendEmail(email, subject, html) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject,
      html
    }

    return this.transporter.sendMail(mailOptions)
  }

  async sendVerificationEmail(email, token) {
    const subject = 'Email Verification'
    const html = await ejs.renderFile(`${__dirname}/templates/verify.ejs`, {
      link: `${process.env.BACKEND_URL}/api/v1/users/verify-email/${token}`
    })
    return this.sendEmail(email, subject, html)
  }

  async sendPasswordResetEmail(email, token) {
    const subject = 'Password Reset'
    const html = await ejs.renderFile(
      `${__dirname}/templates/resetPassword.ejs`,
      {
        link: `${process.env.FRONTEND_URL}/new-password/${token}`
      }
    )

    return this.sendEmail(email, subject, html)
  }

  async sendLabelEmail(email, pdfURL) {
    const subject = 'Your Shipping Label'
    const html = await ejs.renderFile(`${__dirname}/templates/label.ejs`, {
      link: pdfURL
    })

    return this.sendEmail(email, subject, html)
  }
}

const Email = new EmailService()

module.exports = Email

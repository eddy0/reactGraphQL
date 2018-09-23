const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

const emailTemplate = ({email, token}) => {
    const html = `
        <div className="email" style="border: 1px solid black; padding: 20px; font-family: sans-serif; line-height: 2; font-size: 20px">
            <p>this is the email</p>
            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${token}">link to reset the password</a>
            
        </div>
    `
    return {
        from: 'eddyinfe@gmail.com',
        to: email,
        subject: 'reset the Token',
        html: html,
    }
}

module.exports = {
    transport,
    emailTemplate,
}
// const nodeMailer = require('nodemailer');
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (options: any) => {
  // const transporter = nodeMailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     service: process.env.SMTP_SERVICE,
  //     auth: {
  //         user: process.env.SMTP_MAIL,
  //         pass: process.env.SMTP_PASSWORD,
  //     },
  // });

  // const mailOptions = {
  //     from: process.env.SMTP_MAIL,
  //     to: options.email,
  //     subject: options.subject,
  //     html: options.message,
  // };

  // await transporter.sendMail(mailOptions);

  const msg = {
    to: options.email as string,
    from: process.env.SENDGRID_MAIL!,
    templateId: options.templateId as string,
    dynamic_template_data: options.data,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email Sent");
    })
    .catch((error: any) => {
      console.error(error);
    });
};



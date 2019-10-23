import nodemailer from "nodemailer";

const transport =
  process.env.NODE_ENV === "production"
    ? {
        service: "gmail",
        auth: {
          user: process.env.MAILER_EMAIL,
          pass: process.env.MAILER_PASSWORD
        }
      }
    : {
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "larissa65@ethereal.email",
          pass: "CuvV5QeSvn3s8VWmwc"
        }
      };

export const transporter = nodemailer.createTransport(transport);

export const fromEmail = `Do Not Reply <${process.env.MAILER_EMAIL}>`;

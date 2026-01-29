import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
//   await transporter.sendMail({
//     from: `"FLOWEX Agent" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   });
await transporter.sendMail({
    to: to,
    subject: subject,
    html: text
}).then(()=>{
    console.log("message has been sent")
}).catch((err:any)=>{
    console.log("there is error:", err)
})
}

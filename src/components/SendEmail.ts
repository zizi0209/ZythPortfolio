import { Resend } from "resend";
import {redirect} from  'next/navigation'


// EMAIL SENDGING FUCTIONALITY 
// ADD RESEND_API_KEY IN YOUR .ENV FILE 
const resend = new Resend(process.env.RESEND_API_KEY);
export const SendEmail = async (formdata: FormData) => {
  const message = formdata.get("message");
  const name = formdata.get("name");
  const SenderEmail = formdata.get("SenderEmail");
  if (!message) {
    return {
      error: "Invalid message",
    };
  }
  await resend.emails.send({
    from: "Contact Form <onboarding@resend.dev>",
    to: `trantuongvy131@gmail.com`,
    subject: `${name} sent a message via contact form`,
    reply_to: `${SenderEmail}`,
    html: `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #333;">📩 New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${SenderEmail}">${SenderEmail}</a></p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #fff; padding: 15px; border-left: 4px solid #4f46e5; margin: 10px 0;">
        ${message}
      </blockquote>
      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #888;">This message was sent from your portfolio contact form.</p>
    </div>
  `,
  });

return redirect('/')
 
  
};

import nodemailer from "nodemailer";

export const runtime = "nodejs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending "${subject}" email to ${to}:`, error);
    throw new Error(`Unable to send "${subject}" email`);
  }
}

function baseTemplate(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(to right, #ff6f00, #ff8f00); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Farhan's E-Commerce</h1>
        </div>
        <div style="padding: 20px; color: #333;">
          ${content}
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 20px;">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 1. Order Created (with OTP)
export async function sendOrderCreatedEmail(to: string, orderId: string, otp: string): Promise<void> {
  const subject = `Order Confirmation: ${orderId}`;
  const content = `
    <h2 style="color: #ff6f00;">Order Created Successfully ✅</h2>
    <p>Your order ID: <strong>${orderId}</strong></p>
    <p><strong>Order OTP:</strong> <span style="font-size: 18px; color: #d84315;">${otp}</span></p>
    <p>Use this OTP to verify your order at the time of delivery.</p>
  `;
  await sendEmail(to, subject, baseTemplate(content, subject));
}

// 2. Order Shipped
export async function sendOrderShippedEmail(to: string, orderId: string, ): Promise<void> {
  const subject = `Your Order ${orderId} is On the Way 🚚`;
  const content = `
    <h2 style="color: #43a047;">Good News! Your Order is Shipped</h2>
    <p>Order ID: <strong>${orderId}</strong></p>
    <p>You will shortly recieve your product.</p>
  `;
  await sendEmail(to, subject, baseTemplate(content, subject));
}

// 3. Order Delivered
export async function sendOrderDeliveredEmail(to: string, orderId: string): Promise<void> {
  const subject = `Order Delivered: ${orderId} 🎉`;
  const content = `
    <h2 style="color: #00897b;">Your Order has been Delivered!</h2>
    <p>Order ID: <strong>${orderId}</strong></p>
    <p>We hope you enjoy your purchase! Thank you for shopping with us.</p>
  `;
  await sendEmail(to, subject, baseTemplate(content, subject));
}

// 4. Delivery OTP Reminder (Optional)
export async function sendOrderDeliveryOtpReminder(to: string, orderId: string, otp: string): Promise<void> {
  const subject = `Delivery OTP for Order ${orderId}`;
  const content = `
    <h2 style="color: #d32f2f;">Your Delivery OTP 🔑</h2>
    <p>Order ID: <strong>${orderId}</strong></p>
    <p><strong>Delivery OTP:</strong> <span style="font-size: 18px; color: #c62828;">${otp}</span></p>
    <p>Kindly share this OTP with our delivery agent at the time of delivery.</p>
  `;
  await sendEmail(to, subject, baseTemplate(content, subject));
}


// 5. Order Cancelled
export async function sendOrderCancelledEmail(to: string, orderId: string, reason?: string): Promise<void> {
  const subject = `Order Cancelled: ${orderId}`;
  const content = `
    <h2 style="color: #e53935;">Order Cancelled ❌</h2>
    <p>Your order with ID <strong>${orderId}</strong> has been cancelled.</p>
    ${
      reason
        ? `<p><strong>Reason:</strong> ${reason}</p>`
        : `<p>If this was not intentional, please contact our support team immediately.</p>`
    }
    <p>We hope to serve you again soon!</p>
  `;
  await sendEmail(to, subject, baseTemplate(content, subject));
}

// pages/api/report-task.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
  console.log('TO_EMAIL:', process.env.TO_EMAIL);

  if (req.method === 'POST') {
    const { taskId, reason } = req.body;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      logger: true, // Log to console
      debug: true // Include debug information
    });

    try {
      // Verify SMTP connection configuration
      await transporter.verify();
      console.log('SMTP connection verified successfully');

      // Send email
      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: `Row Reported - id: ${taskId}`,
        text: `Row Reported - id: ${taskId}\nReason: ${reason}`,
        html: `<p>Row Reported - id: ${taskId}</p><p>Reason: ${reason}</p>`,
      });

      console.log("Message sent: %s", info.messageId);
      res.status(200).json({ message: 'Task reported successfully', messageId: info.messageId });
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        message: 'Failed to report task', 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
// SvelteKit's secure way to import private environment variables
import { env } from '$env/dynamic/private';

export const actions = {
	sendEmail: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const message = data.get('message') as string;

		if (!name || !email || !message) {
			return fail(400, { error: 'All fields are required.' });
		}

		// =========================================================
		// 2. THE BACKEND EMAIL VALIDATION (The Fortress)
		// =========================================================
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			// This throws a controlled failure back to our Dialog modal!
			return fail(400, { error: 'The email address provided is invalid.' });
		}

		try {
			// 1. Create the Transporter
			// This is the engine that logs into Gmail via SMTP
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: env.GMAIL_USER,
					pass: env.GMAIL_PASS
				}
			});

			// 2. Format the Email
			// This dictates how the email will look when it arrives in your inbox
			const mailOptions = {
				from: env.GMAIL_USER, // Gmail forces the sender to be your authenticated email
				to: env.GMAIL_USER, // You are sending it to yourself
				replyTo: email, // If you hit "Reply" in Gmail, it replies to the user
				subject: `New Portfolio Message from ${name}`,
				text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
				html: `
                    <h3>New Contact Request</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong><br/> ${message.replace(/\n/g, '<br>')}</p>
                `
			};

			// 3. Dispatch the Email
			await transporter.sendMail(mailOptions);

			return { success: true };
		} catch (error) {
			console.error('Nodemailer Error:', error);
			return fail(500, { error: 'Failed to send message. Please try again later.' });
		}
	}
};

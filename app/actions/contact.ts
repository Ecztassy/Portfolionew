"use server"

import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Define the contact form data type
type ContactFormData = {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validate the form data
    if (!formData.name || !formData.email || !formData.message) {
      return { success: false, error: "All fields are required" }
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return { success: false, error: "Invalid email format" }
    }

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Use your verified domain
      to: process.env.CONTACT_EMAIL || "your-email@example.com", // Your email address
      subject: `New Contact Form Submission from ${formData.name}`,
      text: `
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
      `,
      // You can also use HTML for a nicer email
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #00ff9d; border-bottom: 1px solid #00ff9d; padding-bottom: 10px;">
    New Contact Form Submission
  </h2>
  <p><strong>Name:</strong> ${formData.name}</p>
  <p><strong>Email:</strong> ${formData.email}</p>
  <div style="margin-top: 20px;">
    <strong>Message:</strong>
    <p style="white-space: pre-line; background: #f5f5f5; padding: 15px; border-radius: 4px;">
      ${formData.message}
    </p>
  </div>
  <p style="color: #666; font-size: 12px; margin-top: 30px;">
    This message was sent from your portfolio website contact form.
  </p>
</div>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in sendContactEmail:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}


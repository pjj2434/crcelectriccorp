// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  serviceType: z.enum(['landscape-outdoor-lighting', 'pool-sauna-electrical', 'residential-electrical-services', 'commercial-electrical-solutions']),
  propertyType: z.enum(['residential', 'commercial']),
  wiringType: z.enum(['existing', 'new']).optional(),
  description: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedFields = formSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    const { name, email, phone, address, serviceType, propertyType, wiringType, description } = validatedFields.data

    // Create more readable service names
    const serviceNames = {
      'landscape-outdoor-lighting': 'Landscape & Outdoor Lighting',
      'pool-sauna-electrical': 'Pool & Sauna Electrical',
      'residential-electrical-services': 'Residential Electrical Services',
      'commercial-electrical-solutions': 'Commercial Electrical Solutions'
    }
    const readableService = serviceNames[serviceType]

    const wiringTypeNames = {
      'existing': 'Existing Wiring',
      'new': 'New Wiring'
    }
    const readableWiringType = wiringType ? wiringTypeNames[wiringType] : 'Not specified'

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Email content for the customer
    const customerMailOptions = {
      from: process.env.SMTP_USER, // Host email as sender
      to: email, // Customer's email from the form
      bcc: process.env.SMTP_USER, // BCC to host email
      subject: `Thank you for contacting CRC Electrical, ${name}!`,
      text: `
        Dear ${name},

        Thank you for reaching out to CRC Electrical. We have received your request for a free estimate and will get back to you shortly.

        Here's a copy of your request:

        Phone: ${phone}
        Address: ${address}
        Service Requested: ${readableService}
        Property Type: ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
        Wiring Type: ${readableWiringType}
        ${description ? `Project Description: ${description}` : ''}

        We look forward to helping you with your electrical needs!

        Best regards,
        CRC Electrical
        (631) 764-1577
        crcelectriccorp@gmail.com
        Serving Long Island, NY - Suffolk & Nassau County
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background-color: #000000; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 36px; font-weight: bold; margin: 0;">
              CRC <span style="color: #ef4444;">ELECTRICAL</span>
            </h1>
            <p style="color: #d1d5db; font-size: 18px; margin: 10px 0 0 0;">Professional electrical services across Long Island</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #ef4444; font-size: 24px; margin-bottom: 20px;">Thank You for Your Request!</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear ${name},</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to CRC Electrical. We have received your request for a free estimate and will get back to you shortly.
            </p>
            
            <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
              <h3 style="color: #ef4444; margin-top: 0; font-size: 18px;">Your Request Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 140px;">Phone:</td>
                  <td style="padding: 8px 0; color: #374151;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Address:</td>
                  <td style="padding: 8px 0; color: #374151;">${address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Service:</td>
                  <td style="padding: 8px 0; color: #374151;">${readableService}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Property Type:</td>
                  <td style="padding: 8px 0; color: #374151;">${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Wiring Type:</td>
                  <td style="padding: 8px 0; color: #374151;">${readableWiringType}</td>
                </tr>
                ${description ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Description:</td>
                  <td style="padding: 8px 0; color: #374151; white-space: pre-wrap;">${description}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background-color: #1f2937; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #ffffff; margin-top: 0; font-size: 16px;">Why Choose CRC Electrical?</h4>
              <ul style="color: #d1d5db; margin: 0; padding-left: 20px;">
                <li>Licensed & Insured</li>
                <li>24/7 Emergency Service</li>
                <li>Free Estimates</li>
                <li>Residential & Commercial</li>
              </ul>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              We look forward to helping you with your electrical needs!
            </p>
          </div>

          <div style="background-color: #ef4444; padding: 20px; text-align: center;">
            <p style="color: #ffffff; font-weight: bold; margin: 5px 0; font-size: 18px;">(631) 764-1577</p>
            <p style="color: #ffffff; margin: 5px 0;">crcelectriccorp@gmail.com</p>
            <p style="color: #fecaca; margin: 5px 0; font-size: 14px;">Serving Long Island, NY - Suffolk & Nassau County</p>
          </div>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(customerMailOptions)

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
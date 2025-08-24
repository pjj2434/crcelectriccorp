// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Enhanced form schema with stricter validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s\-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(20, "Phone must be less than 20 characters").regex(/^[\d\s\(\)\-\+\.]+$/, "Phone can only contain numbers, spaces, parentheses, hyphens, and plus signs"),
  address: z.string().min(5, "Address must be at least 5 characters").max(500, "Address must be less than 500 characters"),
  serviceType: z.enum(['landscape-outdoor-lighting', 'pool-sauna-electrical', 'residential-electrical-services', 'commercial-electrical-solutions', 'ev-Charger-Installation', 'residential-commercial-generator-installation']),
  propertyType: z.enum(['residential', 'commercial']),
  wiringType: z.enum(['existing', 'new']).optional(),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
})

// Rate limiting in memory (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_MAX = 3 // Max requests per window
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute window

// Input sanitization function
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Enhanced logging function
function logContactAttempt(data: {
  ip: string;
  userAgent: string;
  email: string;
  name: string;
  serviceType: string;
  success: boolean;
  error?: string;
  timestamp: string;
}) {
  const logEntry = {
    ...data,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  }
  
  // Log to console with structured format
  console.log('[CONTACT_FORM]', JSON.stringify(logEntry, null, 2))
  
  // In production, you might want to send this to a logging service
  // or database for monitoring and analytics
}

// Rate limiting function
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime: now + RATE_LIMIT_WINDOW }
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetTime: record.resetTime }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      logContactAttempt({
        ip,
        userAgent,
        email: 'unknown',
        name: 'unknown',
        serviceType: 'unknown',
        success: false,
        error: 'Rate limit exceeded',
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      logContactAttempt({
        ip,
        userAgent,
        email: 'unknown',
        name: 'unknown',
        serviceType: 'unknown',
        success: false,
        error: 'Invalid JSON payload',
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(
        { error: 'Invalid request format. Please check your input.' },
        { status: 400 }
      )
    }
    
    // Validate the request body
    const validatedFields = formSchema.safeParse(body)
    
    if (!validatedFields.success) {
      const errors = validatedFields.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      
      logContactAttempt({
        ip,
        userAgent,
        email: body.email || 'unknown',
        name: body.name || 'unknown',
        serviceType: body.serviceType || 'unknown',
        success: false,
        error: `Validation failed: ${errors.join(', ')}`,
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors,
          field: validatedFields.error.issues[0]?.path[0] || 'unknown'
        },
        { status: 400 }
      )
    }

    const { name, email, phone, address, serviceType, propertyType, wiringType, description } = validatedFields.data

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      phone: sanitizeInput(phone),
      address: sanitizeInput(address),
      serviceType,
      propertyType,
      wiringType,
      description: description ? sanitizeInput(description) : undefined
    }

    // Validate SMTP configuration
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      logContactAttempt({
        ip,
        userAgent,
        email: sanitizedData.email,
        name: sanitizedData.name,
        serviceType: sanitizedData.serviceType,
        success: false,
        error: `Missing environment variables: ${missingVars.join(', ')}`,
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(
        { error: 'Email service is currently unavailable. Please try again later or contact us directly.' },
        { status: 503 }
      )
    }

    // Create more readable service names
    const serviceNames = {
      'landscape-outdoor-lighting': 'Landscape & Outdoor Lighting',
      'pool-sauna-electrical': 'Pool & Sauna Electrical',
      'residential-electrical-services': 'Residential Electrical Services',
      'commercial-electrical-solutions': 'Commercial Electrical Solutions',
      'ev-Charger-Installation': 'EV Charger Installation',
      'residential-commercial-generator-installation': 'Residential & Commercial Generator Installation'
    }
    const readableService = serviceNames[serviceType]

    const wiringTypeNames = {
      'existing': 'Existing Wiring',
      'new': 'New Wiring'
    }
    const readableWiringType = wiringType ? wiringTypeNames[wiringType] : 'Not specified'

    // Create transporter with enhanced error handling
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Add timeout and connection settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })

    // Verify SMTP connection
    try {
      await transporter.verify()
    } catch (verifyError) {
      logContactAttempt({
        ip,
        userAgent,
        email: sanitizedData.email,
        name: sanitizedData.name,
        serviceType: sanitizedData.serviceType,
        success: false,
        error: `SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(
        { error: 'Email service is currently unavailable. Please try again later or contact us directly.' },
        { status: 503 }
      )
    }

    // Email content for the customer
    const customerMailOptions = {
      from: process.env.SMTP_USER,
      to: sanitizedData.email,
      bcc: process.env.SMTP_USER,
      subject: `Thank you for contacting CRC Electrical, ${sanitizedData.name}!`,
      text: `
        Dear ${sanitizedData.name},

        Thank you for reaching out to CRC Electrical. We have received your request for a free estimate and will get back to you shortly.

        Here's a copy of your request:

        Phone: ${sanitizedData.phone}
        Address: ${sanitizedData.address}
        Service Requested: ${readableService}
        Property Type: ${sanitizedData.propertyType.charAt(0).toUpperCase() + sanitizedData.propertyType.slice(1)}
        Wiring Type: ${readableWiringType}
        ${sanitizedData.description ? `Project Description: ${sanitizedData.description}` : ''}

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
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear ${sanitizedData.name},</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to CRC Electrical. We have received your request for a free estimate and will get back to you shortly.
            </p>
            
            <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
              <h3 style="color: #ef4444; margin-top: 0; font-size: 18px;">Your Request Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 140px;">Phone:</td>
                  <td style="padding: 8px 0; color: #374151;">${sanitizedData.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Address:</td>
                  <td style="padding: 8px 0; color: #374151;">${sanitizedData.address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Service:</td>
                  <td style="padding: 8px 0; color: #374151;">${readableService}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Property Type:</td>
                  <td style="padding: 8px 0; color: #374151;">${sanitizedData.propertyType.charAt(0).toUpperCase() + sanitizedData.propertyType.slice(1)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Wiring Type:</td>
                  <td style="padding: 8px 0; color: #374151;">${readableWiringType}</td>
                </tr>
                ${sanitizedData.description ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Description:</td>
                  <td style="padding: 8px 0; color: #374151; white-space: pre-wrap;">${sanitizedData.description}</td>
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

    // Send email with timeout
    const emailPromise = transporter.sendMail(customerMailOptions)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout')), 30000)
    )
    
    await Promise.race([emailPromise, timeoutPromise])

    const processingTime = Date.now() - startTime
    
    // Log successful submission
    logContactAttempt({
      ip,
      userAgent,
      email: sanitizedData.email,
      name: sanitizedData.name,
      serviceType: sanitizedData.serviceType,
      success: true,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        processingTime: `${processingTime}ms`
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString()
        }
      }
    )
    
  } catch (error) {
    const processingTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    // Log the error
    logContactAttempt({
      ip,
      userAgent,
      email: 'unknown',
      name: 'unknown',
      serviceType: 'unknown',
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    })

    // Return appropriate error response
    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 408 }
      )
    }
    
    if (errorMessage.includes('SMTP') || errorMessage.includes('email')) {
      return NextResponse.json(
        { error: 'Email service is currently unavailable. Please try again later or contact us directly.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again later.',
        processingTime: `${processingTime}ms`
      },
      { status: 500 }
    )
  }
}

// Clean up rate limit map periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip)
      }
    }
  }, 5 * 60 * 1000)
}
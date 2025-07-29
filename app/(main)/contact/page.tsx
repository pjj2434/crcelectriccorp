"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Service types from components/serivice-section.tsx
const services = [
  { title: "LANDSCAPE & OUTDOOR LIGHTING", slug: "landscape-outdoor-lighting" },
  { title: "POOL & SAUNA ELECTRICAL", slug: "pool-sauna-electrical" },
  { title: "RESIDENTIAL ELECTRICAL SERVICES", slug: "residential-electrical-services" },
  { title: "COMMERCIAL ELECTRICAL SOLUTIONS", slug: "commercial-electrical-solutions" },
];

// Normalize a string to a slug (lowercase, dashes, no special chars)
function normalizeSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function ContactFormContent() {
  const searchParams = useSearchParams();
  const urlService = searchParams.get("service") || "";
  const normalizedUrlService = normalizeSlug(urlService);
  const matchedService = services.find(s => normalizeSlug(s.title) === normalizedUrlService);
  const initialService = matchedService ? matchedService.slug : "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: initialService,
    wiringType: "",
    description: "",
    propertyType: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialService && form.serviceType !== initialService) {
      setForm((prev) => ({ ...prev, serviceType: initialService }));
    }
    // Auto-set propertyType based on serviceType
    if (
      (initialService === 'residential-electrical-services' && form.propertyType !== 'residential') ||
      (initialService === 'commercial-electrical-solutions' && form.propertyType !== 'commercial')
    ) {
      setForm((prev) => ({
        ...prev,
        propertyType:
          initialService === 'residential-electrical-services'
            ? 'residential'
            : initialService === 'commercial-electrical-solutions'
            ? 'commercial'
            : prev.propertyType,
      }));
    }
  }, [initialService, form.serviceType, form.propertyType]);

  // Also update propertyType if user changes serviceType manually
  useEffect(() => {
    if (
      form.serviceType === 'residential-electrical-services' && form.propertyType !== 'residential'
    ) {
      setForm((prev) => ({ ...prev, propertyType: 'residential' }));
    } else if (
      form.serviceType === 'commercial-electrical-solutions' && form.propertyType !== 'commercial'
    ) {
      setForm((prev) => ({ ...prev, propertyType: 'commercial' }));
    }
  }, [form.serviceType]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelect(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Client-side validation
  function validateForm() {
    const errors = [];

    if (!form.name || form.name.length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) {
      errors.push("Please enter a valid phone number with at least 10 digits");
    }

    if (!form.address || form.address.length < 5) {
      errors.push("Please enter a valid address");
    }

    if (!form.serviceType) {
      errors.push("Please select a service type");
    }

    if (!form.propertyType) {
      errors.push("Please select a property type");
    }

    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Thank you! Your request has been submitted successfully. We'll get back to you shortly.", {
          duration: 5000,
        });
        
        // Reset form
        setForm({
          name: "",
          email: "",
          phone: "",
          address: "",
          serviceType: "",
          wiringType: "",
          description: "",
          propertyType: "",
        });
      } else {
        // Handle validation errors from server
        if (data.error === 'Invalid form data') {
          toast.error("Please check your form data and try again.");
        } else {
          toast.error("Something went wrong. Please try again or call us directly.");
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Business Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                CRC
                <br />
                <span className="text-red-500">ELECTRICAL</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Professional electrical services across Long Island
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-500 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Call Us</p>
                  <p className="text-white text-xl font-semibold">(631) 764-1577</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-red-500 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email Us</p>
                  <p className="text-white text-xl font-semibold">crcelectriccorp@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-red-500 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Service Area</p>
                  <p className="text-white text-xl font-semibold">Long Island, NY</p>
                  <p className="text-gray-400">Suffolk & Nassau County</p>
                </div>
              </div>
            </div>

            {/* Service Hours or Additional Info */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="text-white text-lg font-semibold mb-3">Why Choose CRC Electrical?</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Licensed & Insured</li>
                <li>• 24/7 Emergency Service</li>
                <li>• Free Estimates</li>
                <li>• Residential & Commercial</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-500">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Get Your Free <span className="text-red-500">Estimate</span>
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Your Name"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Phone Number *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  placeholder="(555) 555-5555"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Address *</label>
                <Input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  autoComplete="street-address"
                  placeholder="123 Main St, City, State"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Service Type *</label>
                <Select 
                  value={form.serviceType} 
                  onValueChange={(v: string) => handleSelect("serviceType", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.slug} value={service.slug}>{service.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Property Type *</label>
                <Select 
                  value={form.propertyType} 
                  onValueChange={(v: string) => handleSelect("propertyType", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Wiring Type</label>
                <Select 
                  value={form.wiringType} 
                  onValueChange={(v: string) => handleSelect("wiringType", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select wiring type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">Existing Wiring</SelectItem>
                    <SelectItem value="new">New Wiring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Project Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell us more about your electrical project..."
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-4 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Get My Free Estimate →"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactFormContent />
    </Suspense>
  );
}
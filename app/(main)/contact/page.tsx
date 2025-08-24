"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Phone, Mail, MapPin, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Service types from components/serivice-section.tsx
const services = [
  { title: "LANDSCAPE & OUTDOOR LIGHTING", slug: "landscape-outdoor-lighting" },
  { title: "POOL & SAUNA ELECTRICAL", slug: "pool-sauna-electrical" },
  { title: "RESIDENTIAL ELECTRICAL SERVICES", slug: "residential-electrical-services" },
  { title: "COMMERCIAL ELECTRICAL SOLUTIONS", slug: "commercial-electrical-solutions" },
  { title: "EV Charger Installation", slug: "ev-Charger-Installation" },
  { title: "Residential & Commercial Generator Installation", slug: "residential-commercial-generator-installation" },
];

// Normalize a string to a slug (lowercase, dashes, no special chars)
function normalizeSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Field validation interface
interface FieldErrors {
  [key: string]: string;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

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

  // Clear field errors when form changes
  useEffect(() => {
    const newErrors: FieldErrors = {};
    Object.keys(fieldErrors).forEach(field => {
      if (form[field as keyof typeof form] && fieldErrors[field]) {
        delete newErrors[field];
      }
    });
    if (Object.keys(newErrors).length !== Object.keys(fieldErrors).length) {
      setFieldErrors(newErrors);
    }
  }, [form, fieldErrors]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(name));
    
    // Clear field error if it exists
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  function handleSelect(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(name));
    
    // Clear field error if it exists
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  // Enhanced client-side validation with field-level errors
  function validateForm(): { isValid: boolean; errors: FieldErrors } {
    const errors: FieldErrors = {};

    // Name validation
    if (!form.name.trim()) {
      errors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (form.name.trim().length > 100) {
      errors.name = "Name must be less than 100 characters";
    } else if (!/^[a-zA-Z\s\-']+$/.test(form.name.trim())) {
      errors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email validation
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    } else if (form.email.trim().length > 255) {
      errors.email = "Email must be less than 255 characters";
    }

    // Phone validation
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      errors.phone = "Phone must be at least 10 digits";
    } else if (form.phone.trim().length > 20) {
      errors.phone = "Phone must be less than 20 characters";
    } else if (!/^[\d\s\(\)\-\+\.]+$/.test(form.phone.trim())) {
      errors.phone = "Phone can only contain numbers, spaces, parentheses, hyphens, and plus signs";
    }

    // Address validation
    if (!form.address.trim()) {
      errors.address = "Address is required";
    } else if (form.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters";
    } else if (form.address.trim().length > 500) {
      errors.address = "Address must be less than 500 characters";
    }

    // Service type validation
    if (!form.serviceType) {
      errors.serviceType = "Please select a service type";
    }

    // Property type validation
    if (!form.propertyType) {
      errors.propertyType = "Please select a property type";
    }

    // Description validation (optional but with length check)
    if (form.description && form.description.length > 2000) {
      errors.description = "Description must be less than 2000 characters";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // Validate individual field
  function validateField(fieldName: string, value: string): string | null {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters long";
        if (value.trim().length > 100) return "Name must be less than 100 characters";
        if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) return "Name can only contain letters, spaces, hyphens, and apostrophes";
        break;
      case 'email':
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please enter a valid email address";
        if (value.trim().length > 255) return "Email must be less than 255 characters";
        break;
      case 'phone':
        if (!value.trim()) return "Phone number is required";
        if (value.replace(/\D/g, '').length < 10) return "Phone must be at least 10 digits";
        if (value.trim().length > 20) return "Phone must be less than 20 characters";
        if (!/^[\d\s\(\)\-\+\.]+$/.test(value.trim())) return "Phone can only contain numbers, spaces, parentheses, hyphens, and plus signs";
        break;
      case 'address':
        if (!value.trim()) return "Address is required";
        if (value.trim().length < 5) return "Address must be at least 5 characters";
        if (value.trim().length > 500) return "Address must be less than 500 characters";
        break;
      case 'serviceType':
        if (!value) return "Please select a service type";
        break;
      case 'propertyType':
        if (!value) return "Please select a property type";
        break;
      case 'description':
        if (value && value.length > 2000) return "Description must be less than 2000 characters";
        break;
    }
    return null;
  }

  // Handle field blur for real-time validation
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    } else if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      
      // Show first error in toast
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      
      // Scroll to first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (element as HTMLElement).focus();
        }
      }
      
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
        
        // Reset form and errors
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
        setFieldErrors({});
        setTouchedFields(new Set());
      } else {
        // Handle different types of errors
        if (response.status === 429) {
          toast.error(`Too many requests. Please try again in ${data.retryAfter || 'a few minutes'}.`);
        } else if (response.status === 400 && data.details) {
          // Handle validation errors from server
          const serverErrors: FieldErrors = {};
          data.details.forEach((detail: string) => {
            const [field] = detail.split(':');
            if (field) {
              serverErrors[field.trim()] = detail;
            }
          });
          setFieldErrors(serverErrors);
          toast.error("Please check your form data and try again.");
        } else if (data.error) {
          toast.error(data.error);
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

  // Helper function to render field with error state
  function renderField(
    name: keyof typeof form,
    label: string,
    type: string = "text",
    placeholder: string = "",
    required: boolean = true,
    autoComplete?: string,
    isTextarea: boolean = false,
    isSelect: boolean = false,
    selectOptions?: { value: string; label: string }[]
  ) {
    const hasError = fieldErrors[name];
    const isTouched = touchedFields.has(name);
    const showError = hasError && isTouched;
    
    return (
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {isTextarea ? (
          <Textarea
            name={name}
            value={form[name] as string}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`border-gray-300 focus:border-red-500 focus:ring-red-500 min-h-[80px] lg:min-h-[100px] ${
              showError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={isSubmitting}
          />
        ) : isSelect && selectOptions ? (
          <Select 
            value={form[name] as string} 
            onValueChange={(v: string) => handleSelect(name, v)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={`border-gray-300 focus:border-red-500 focus:ring-red-500 ${
              showError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={type}
            name={name}
            value={form[name] as string}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={`border-gray-300 focus:border-red-500 focus:ring-red-500 ${
              showError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            disabled={isSubmitting}
          />
        )}
        
        {showError && (
          <div className="flex items-center mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {hasError}
          </div>
        )}
        
        
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black py-6 lg:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Business Information (Hidden on Mobile) */}
          <div className="space-y-8 hidden lg:block">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                CRC
                <br />
                <span className="text-red-500">ELECTRIC</span>
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
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 border-2 border-red-500">
            {/* Mobile Header with Essential Contact Info */}
            <div className="lg:hidden mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                CRC <span className="text-red-500">ELECTRIC</span>
              </h1>
              
              {/* Essential Contact Info for Mobile */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a href="tel:6317641577" className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold">(631) 764-1577</span>
                </a>
                <a href="mailto:crcelectriccorp@gmail.com" className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="font-semibold">Email</span>
                </a>
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6 lg:mb-8">
              Get Your Free <span className="text-red-500">Estimate</span>
            </h2>
            
            <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
              {renderField('name', 'Name', 'text', 'Your Name', true, 'name')}
              {renderField('email', 'Email', 'email', 'you@email.com', true, 'email')}
              {renderField('phone', 'Phone Number', 'tel', '(555) 555-5555', true, 'tel')}
              {renderField('address', 'Address', 'text', '123 Main St, City, State', true, 'street-address')}
              
              {renderField(
                'serviceType', 
                'Service Type', 
                'text', 
                'Select a service type', 
                true, 
                undefined, 
                false, 
                true, 
                services.map(service => ({ value: service.slug, label: service.title }))
              )}
              
              {renderField(
                'propertyType', 
                'Property Type', 
                'text', 
                'Select property type', 
                true, 
                undefined, 
                false, 
                true, 
                [
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'residential', label: 'Residential' }
                ]
              )}
              
              {renderField(
                'wiringType', 
                'Wiring Type', 
                'text', 
                'Select wiring type (optional)', 
                false, 
                undefined, 
                false, 
                true, 
                [
                  { value: 'existing', label: 'Existing Wiring' },
                  { value: 'new', label: 'New Wiring' }
                ]
              )}
              
              {renderField(
                'description', 
                'Project Description', 
                'text', 
                'Tell us more about your electrical project...', 
                false, 
                undefined, 
                true
              )}

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
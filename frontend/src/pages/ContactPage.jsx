import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useForm } from '../hooks/useForm';
import { contactService } from '../services/api';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const { formData, handleChange, handleSubmit, reset } = useForm(
    { name: '', email: '', subject: '', message: '' },
    async (data) => {
      try {
        await contactService.sendMessage(data);
        toast.success('Thank you for your message! We\'ll get back to you soon.');
        reset();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send message');
      }
    }
  );

  return (
    <div className="section-container">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

          {/* Phone */}
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <FaPhone className="text-3xl text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+91 (98) 7654-3210</p>
              <p className="text-gray-600">+91 (99) 8765-4321</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <FaEnvelope className="text-3xl text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@shivamresort.com</p>
              <p className="text-gray-600">bookings@shivamresort.com</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <FaMapMarkerAlt className="text-3xl text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-600">Luxury Resort Lane</p>
              <p className="text-gray-600">Ooty, Tamil Nadu 643001</p>
              <p className="text-gray-600">India</p>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-light p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Monday - Friday:</strong> 9:00 AM - 9:00 PM (IST)</p>
              <p><strong>Saturday - Sunday:</strong> 10:00 AM - 8:00 PM (IST)</p>
              <p><strong>Emergency:</strong> 24/7 Available</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white card-shadow p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input-field"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="input-field"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                rows="5"
                className="input-field"
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

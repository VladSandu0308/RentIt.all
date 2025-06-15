import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const InvoiceRequestModal = ({ booking, location, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    company_name: '',
    cui: '',
    reg_com: '',
    address: '',
    bank_name: '',
    bank_account: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    
    if (!formData.cui.trim()) {
      newErrors.cui = 'CUI is required';
    } else if (!/^RO\d{8,10}$/.test(formData.cui.replace(/\s+/g, ''))) {
      newErrors.cui = 'Invalid CUI format (ex: RO12345678)';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting invoice request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDays = () => {
    const start = new Date(booking.from);
    const end = new Date(booking.to);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Icon icon="material-symbols:receipt-long" className="mr-2" height="24" />
              Request Fiscal Invoice
            </h2>
            <p className="text-sm text-gray-600">
              For booking at {location?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="material-symbols:close" height="24" />
          </button>
        </div>

        {/* Booking Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="font-medium text-gray-800 mb-2">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Period:</span>
              <div className="font-medium">
                {new Date(booking.from).toLocaleDateString('en-US')} - {new Date(booking.to).toLocaleDateString('en-US')}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Number of nights:</span>
              <div className="font-medium">{calculateDays()} nights</div>
            </div>
            <div>
              <span className="text-gray-600">Total amount:</span>
              <div className="font-medium text-green-600">{booking.total_amount} RON</div>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <div className="font-medium">{location?.location}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Company Information */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Icon icon="material-symbols:business" className="mr-2" height="18" />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.company_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="SC Example SRL"
                />
                {errors.company_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CUI *
                </label>
                <input
                  type="text"
                  name="cui"
                  value={formData.cui}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cui ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="RO12345678"
                />
                {errors.cui && (
                  <p className="text-red-500 text-xs mt-1">{errors.cui}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="reg_com"
                  value={formData.reg_com}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="J40/1234/2020"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Street, number, sector/city, county, postal code"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Icon icon="material-symbols:account-balance" className="mr-2" height="18" />
              Banking Information (optional)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Banca Transilvania"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account (IBAN)
                </label>
                <input
                  type="text"
                  name="bank_account"
                  value={formData.bank_account}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="RO49 AAAA 1B31 0075 9384 0000"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Icon icon="material-symbols:contact-mail" className="mr-2" height="18" />
              Invoice Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Responsible person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contact_email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="accounting@company.ro"
                />
                {errors.contact_email && (
                  <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+40 722 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Special mentions for invoice..."
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <Icon icon="material-symbols:info" className="text-blue-400 mr-2 mt-0.5" height="16" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important Information:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Invoice will be issued by the property host</li>
                  <li>You will receive the invoice via email within 3-5 business days</li>
                  <li>Make sure company details are correct</li>
                  <li>For changes, contact the host directly</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Icon icon="eos-icons:loading" className="mr-2" height="16" />
                Sending...
              </>
            ) : (
              <>
                <Icon icon="material-symbols:send" className="mr-2" height="16" />
                Send Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceRequestModal;
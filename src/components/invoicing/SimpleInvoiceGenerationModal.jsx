import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SimpleInvoiceGenerationModal = ({ booking, user, location, onClose, onGenerate }) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
  });

  const calculateDays = () => {
    const start = new Date(booking.from);
    const end = new Date(booking.to);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload only PDF files');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Firebase
      const fileName = `invoices/invoice_${booking._id}_${Date.now()}.pdf`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'application/pdf'
      });
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setUploadedFile({
        name: file.name,
        url: downloadURL,
        size: file.size
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!invoiceData.invoice_number.trim()) {
      alert('Please enter the invoice number');
      return;
    }

    if (!uploadedFile) {
      alert('Please upload the invoice PDF file');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate({
        method: 'manual',
        invoice_number: invoiceData.invoice_number,
        invoice_file_url: uploadedFile.url,
        invoice_date: invoiceData.invoice_date
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Icon icon="material-symbols:receipt-long-add" className="mr-2" height="24" />
              Generate Fiscal Invoice
            </h2>
            <p className="text-sm text-gray-600">
              For {user.first_name} {user.last_name} - {location.title}
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
          <h3 className="font-medium text-gray-800 mb-2">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Client:</span>
              <div className="font-medium">
                {booking.invoice_details?.company_name || `${user.first_name} ${user.last_name}`}
              </div>
              {booking.invoice_details?.cui && (
                <div className="text-xs text-gray-500">CUI: {booking.invoice_details.cui}</div>
              )}
            </div>
            <div>
              <span className="text-gray-600">Period:</span>
              <div className="font-medium">
                {new Date(booking.from).toLocaleDateString('en-US')} - {new Date(booking.to).toLocaleDateString('en-US')}
              </div>
              <div className="text-xs text-gray-500">{calculateDays()} nights</div>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <div className="font-medium text-green-600 text-lg">{booking.total_amount} RON</div>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <div className="font-medium text-sm">{booking.invoice_details?.contact_email || user.email}</div>
            </div>
          </div>
        </div>

        {/* Manual Invoice Upload */}
        <div className="px-6 py-4 space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <Icon icon="material-symbols:warning" className="text-yellow-400 mr-2 mt-0.5" height="16" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Manual Processing</p>
                <p>Generate the invoice with your accountant/system and upload the PDF here.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number *
              </label>
              <input
                type="text"
                value={invoiceData.invoice_number}
                onChange={(e) => setInvoiceData(prev => ({
                  ...prev,
                  invoice_number: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date *
              </label>
              <input
                type="date"
                value={invoiceData.invoice_date}
                onChange={(e) => setInvoiceData(prev => ({
                  ...prev,
                  invoice_date: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* File Upload Area */}
          {isUploading ? (
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
              <Icon icon="eos-icons:loading" className="mx-auto text-blue-500 mb-2" height="32" />
              <p className="text-sm text-blue-600">Uploading file...</p>
            </div>
          ) : uploadedFile ? (
            <div className="border border-green-300 bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon icon="material-symbols:picture-as-pdf" className="text-red-500 mr-2" height="20" />
                  <div>
                    <span className="text-sm font-medium text-green-700">
                      {uploadedFile.name}
                    </span>
                    <div className="text-xs text-green-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Icon icon="material-symbols:close" height="16" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Icon icon="material-symbols:cloud-upload" className="mx-auto text-gray-400 mb-2" height="32" />
              <p className="text-sm text-gray-600 mb-2">Upload generated invoice PDF</p>
              <p className="text-xs text-gray-500 mb-3">PDF files only, max 5MB</p>
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Select PDF File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!invoiceData.invoice_number || !uploadedFile || isGenerating}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Icon icon="eos-icons:loading" className="mr-2" height="16" />
                Processing...
              </>
            ) : (
              <>
                <Icon icon="material-symbols:upload" className="mr-2" height="16" />
                Upload Invoice
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isGenerating}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleInvoiceGenerationModal;
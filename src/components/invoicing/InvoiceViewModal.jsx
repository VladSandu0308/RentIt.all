import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { server } from '../../services/axios';

const InvoiceViewModal = ({ booking, location, onClose }) => {
  const [activeTab, setActiveTab] = useState('status');

  const getInvoiceStatus = () => {
    if (!booking.invoicing) return 'no_data';
    
    if (booking.invoicing.fiscalInvoiceStatus === 'completed') {
      return 'completed';
    } else if (booking.invoicing.fiscalInvoiceStatus === 'in_progress') {
      return 'in_progress';
    } else if (booking.invoicing.fiscalInvoiceRequested) {
      return 'requested';
    }
    
    return 'not_requested';
  };

  const downloadFiscalInvoice = async () => {
    try {
      const response = await server.get(`/booking/${booking._id}/fiscal-invoice`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${booking._id}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading fiscal invoice:', error);
      alert('Eroare la descărcarea facturii fiscale');
    }
  };

  const downloadReceipt = async () => {
    try {
      const response = await server.get(`/booking/${booking._id}/receipt`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `chitanta-${booking._id}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Eroare la descărcarea chitanței');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  const status = getInvoiceStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Documente Rezervare
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon icon="material-symbols:close" height="24" />
          </button>
        </div>

        {/* Booking Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">Rezervare:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Proprietate:</strong> {location?.title}</p>
            <p><strong>Perioada:</strong> {booking.from?.split('T')[0]} - {booking.to?.split('T')[0]}</p>
            <p><strong>Suma:</strong> {booking.total_amount} RON</p>
            <p><strong>ID Rezervare:</strong> {booking._id}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button 
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'status' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Status Facturare
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'documents' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documente
          </button>
          {booking.invoicing?.guestFiscalData && (
            <button 
              onClick={() => setActiveTab('fiscal-data')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'fiscal-data' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Date Fiscale
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            {status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon icon="material-symbols:check-circle" height="20" className="text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">Factură disponibilă</h4>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Factura fiscală a fost generată și este gata pentru descărcare.
                </p>
                <div className="text-xs text-green-600 space-y-1">
                  <p>Procesată: {formatDate(booking.invoicing?.fiscalInvoiceProcessedAt)}</p>
                  <p>Metodă: {booking.invoicing?.fiscalInvoiceMethod || 'N/A'}</p>
                  {booking.invoicing?.permit_number && (
                    <p>Număr factură: {booking.invoicing.permit_number}</p>
                  )}
                </div>
              </div>
            )}

            {status === 'in_progress' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon icon="material-symbols:pending" height="20" className="text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-800">În procesare</h4>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Host-ul procesează cererea dvs. de factură fiscală.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>Estimare: 1-3 zile lucrătoare</p>
                  <p>Metodă selectată: {booking.invoicing?.fiscalInvoiceMethod || 'În așteptare'}</p>
                  <p>Trimisă: {formatDate(booking.invoicing?.fiscalInvoiceRequestedAt)}</p>
                </div>
              </div>
            )}

            {status === 'requested' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon icon="material-symbols:schedule" height="20" className="text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-800">Cerere trimisă</h4>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  Cererea pentru factură fiscală a fost trimisă către host. Așteptăm confirmarea.
                </p>
                <div className="text-xs text-yellow-600 space-y-1">
                  <p>Trimisă: {formatDate(booking.invoicing?.fiscalInvoiceRequestedAt)}</p>
                  <p>Status: Așteptăm ca host-ul să aleagă metoda de facturare</p>
                </div>
              </div>
            )}

            {status === 'not_requested' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon icon="material-symbols:info" height="20" className="text-gray-600 mr-2" />
                  <h4 className="font-medium text-gray-800">Factură fiscală</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Nu ați solicitat încă o factură fiscală pentru această rezervare.
                </p>
              </div>
            )}

            {/* Receipt Status - Always show for completed bookings */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Icon icon="material-symbols:description" height="20" className="text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-800">
                  {booking.invoicing?.receiptGenerated ? 'Chitanță disponibilă' : 'Chitanță'}
                </h4>
              </div>
              <p className="text-sm text-blue-700">
                {booking.invoicing?.receiptGenerated 
                  ? 'Chitanța pentru această rezervare este disponibilă pentru descărcare.'
                  : 'Chitanța poate fi generată pentru această rezervare confirmată.'
                }
              </p>
              {booking.invoicing?.receiptGeneratedAt && (
                <p className="text-xs text-blue-600 mt-1">
                  Generată: {formatDate(booking.invoicing.receiptGeneratedAt)}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            {/* Receipt Download */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon icon="material-symbols:description" height="24" className="text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">Chitanță rezervare</h4>
                    <p className="text-sm text-gray-600">Document informativ pentru evidența personală</p>
                  </div>
                </div>
                <button 
                  onClick={downloadReceipt}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <Icon icon="material-symbols:download" height="16" className="inline mr-1" />
                  Descarcă
                </button>
              </div>
            </div>

            {/* Fiscal Invoice Download */}
            {status === 'completed' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon icon="material-symbols:receipt-long" height="24" className="text-green-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Factură fiscală</h4>
                      <p className="text-sm text-gray-600">Document oficial cu valoare fiscală</p>
                      {booking.invoicing?.permit_number && (
                        <p className="text-xs text-gray-500">Nr: {booking.invoicing.permit_number}</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={downloadFiscalInvoice}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    <Icon icon="material-symbols:download" height="16" className="inline mr-1" />
                    Descarcă
                  </button>
                </div>
              </div>
            )}

            {/* Fiscal Invoice Pending */}
            {(status === 'requested' || status === 'in_progress') && (
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center">
                  <Icon icon="material-symbols:pending" height="24" className="text-yellow-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Factură fiscală</h4>
                    <p className="text-sm text-yellow-700">
                      {status === 'in_progress' 
                        ? 'În curs de procesare de către host' 
                        : 'Cerere trimisă, așteptăm răspunsul host-ului'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <p><strong>Notă:</strong> Chitanța este un document informativ. Pentru deducere fiscală, aveți nevoie de factura fiscală oficială.</p>
            </div>
          </div>
        )}

        {activeTab === 'fiscal-data' && booking.invoicing?.guestFiscalData && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Date pentru facturare fiscală:</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium text-gray-600">Companie:</span>
                  <span className="col-span-2 text-gray-800">{booking.invoicing.guestFiscalData.companyName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium text-gray-600">CUI:</span>
                  <span className="col-span-2 text-gray-800">{booking.invoicing.guestFiscalData.cui}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium text-gray-600">Adresa:</span>
                  <span className="col-span-2 text-gray-800">{booking.invoicing.guestFiscalData.address}</span>
                </div>
                {booking.invoicing.guestFiscalData.contactPerson && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-600">Contact:</span>
                    <span className="col-span-2 text-gray-800">{booking.invoicing.guestFiscalData.contactPerson}</span>
                  </div>
                )}
                {booking.invoicing.guestFiscalData.email && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="col-span-2 text-gray-800">{booking.invoicing.guestFiscalData.email}</span>
                  </div>
                )}
                {booking.invoicing.guestFiscalData.phone && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-medium text-gray-600">Telefon:</span>
                    <span className="col-span-2 text-gray-800">{booking.invoicing.guestFiscalData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice History */}
            {booking.invoicing?.fiscalInvoiceHistory && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Istoric factură:</h4>
                <div className="space-y-2">
                  {booking.invoicing.fiscalInvoiceHistory.map((entry, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">{formatDate(entry.date)}</span>
                      <span className="mx-2">-</span>
                      <span className="text-gray-800">{entry.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
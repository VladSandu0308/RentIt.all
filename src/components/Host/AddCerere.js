import React, { useState, useEffect } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { server } from '../../services/axios';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import { storage } from '../../services/firebase';

const AddCerere = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  // State pentru permise multiple
  const [permits, setPermits] = useState({});
  const [requiredPermits, setRequiredPermits] = useState([]);
  const [currentPermitIndex, setCurrentPermitIndex] = useState(0);
  const [error, setError] = useState('');
  const [existingPermits, setExistingPermits] = useState([]);

  const isUpdatingPermits = state?.isUpdatingPermits || false;

  // Fetch required permits când componenta se încarcă
  useEffect(() => {
    if (state.body.location) {
      if (isUpdatingPermits) {
        fetchExistingPermits();
      } else {
        fetchRequiredPermits();
      }
    }
  }, []);

  useEffect(() => {
    if (isUpdatingPermits && existingPermits.length > 0) {
      fetchRequiredPermits();
    }
  }, [existingPermits]);

  const fetchExistingPermits = async () => {
    try {
      const response = await server.get(`/location/${state.body._id}/permits`);
      setExistingPermits(response.data.permits || []);
    } catch (error) {
      console.log('Error fetching existing permits:', error);
      setExistingPermits([]);
    }
  };

  const fetchRequiredPermits = async () => {
    try {
      const response = await server.post('/getPermitRequirements', {
        address: state.body.location,
        mode: state.body.mode
      });
      
      let requiredPermitTypes = response.data.requiredPermits;
      
      // If updating permits, only show rejected and pending permits (exclude approved)
      if (isUpdatingPermits && existingPermits.length > 0) {
        const rejectedPermits = existingPermits.filter(p => p.status === 'rejected').map(p => p.permit_type);
        const pendingPermits = existingPermits.filter(p => p.status === 'pending').map(p => p.permit_type);
        const existingPermitTypes = existingPermits.map(p => p.permit_type);
        const missingPermits = requiredPermitTypes.filter(type => !existingPermitTypes.includes(type));
        
        // Only require rejected, pending and missing permits (NOT approved ones)
        requiredPermitTypes = [...rejectedPermits, ...pendingPermits, ...missingPermits];
      }
      
      setRequiredPermits(requiredPermitTypes);
      
      // Inițializează state-ul pentru fiecare permis
      const initialPermits = {};
      requiredPermitTypes.forEach(permitType => {
        initialPermits[permitType] = null;
      });
      setPermits(initialPermits);
      
    } catch (error) {
      console.log('Error fetching permit requirements:', error);
      // Fallback la permisele de bază
      setRequiredPermits(['businessLicense']);
      setPermits({ businessLicense: null });
    }
  };

  const handleFileUpload = (permitType, file) => {
    setPermits(prev => ({
      ...prev,
      [permitType]: file
    }));
  };

  const removeFile = (permitType) => {
    setPermits(prev => ({
      ...prev,
      [permitType]: null
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();

    // Verifică dacă toate permisele necesare au fost încărcate
    const missingPermits = requiredPermits.filter(permitType => !permits[permitType]);
    if (missingPermits.length > 0) {
      setError(`Lipsesc documente pentru: ${missingPermits.join(', ')}`);
      return;
    }

    try {
      setError('');
      const uploadedPermits = {};

      // Upload toate documentele
      for (const [permitType, file] of Object.entries(permits)) {
        if (file) {
          const storageRef = ref(storage, `/${state.body.title}/permits/${permitType}_updated_${Date.now()}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          uploadedPermits[permitType] = url;
        }
      }

      if (isUpdatingPermits) {
        // Submit new permits for existing location
        await submitUpdatedPermits(uploadedPermits);
      } else {
        // Original flow - păstrează backward compatibility cu cerere field
        const mainCerere = uploadedPermits.businessLicense || Object.values(uploadedPermits)[0];

        state.body = {
          ...state.body, 
          cerere: mainCerere, // Pentru compatibilitatea cu codul existent
          permits: uploadedPermits // Noile permise
        };
        
        navigate("/host/add/review", {state});
      }
      
    } catch (e) {
      setError(e.message);
    }
  };

  const submitUpdatedPermits = async (uploadedPermits) => {
    try {
      // Submit each new permit to backend
      for (const [permitType, documentUrl] of Object.entries(uploadedPermits)) {
        await server.post('/permits', {
          location_id: state.body._id,
          permit_type: permitType,
          document_url: documentUrl,
          status: 'pending'
        });
      }

      // Navigate back to host main with success message
      navigate("/host", {
        state: {
          ...state,
          successMessage: `${Object.keys(uploadedPermits).length} permise actualizate cu succes și trimise pentru aprobare!`
        }
      });
      
    } catch (error) {
      setError('Eroare la trimiterea permiselor. Vă rugăm să încercați din nou.');
      console.error('Error submitting updated permits:', error);
    }
  };

  const getPermitTitle = (permitType) => {
    const titles = {
      businessLicense: t("business-license") || "Licență de afaceri",
      shortTermRental: t("short-term-rental") || "Permis închiriere pe termen scurt", 
      mountainTourism: t("mountain-tourism") || "Turism montan",
      ecotourism: t("ecotourism") || "Ecoturism",
      culturalHeritage: t("cultural-heritage") || "Patrimoniu cultural",
      ruralTourism: t("rural-tourism") || "Turism rural"
    };
    return titles[permitType] || permitType;
  };

  const getPermitDescription = (permitType) => {
    const descriptions = {
      businessLicense: "Document necesar pentru desfășurarea activității comerciale",
      shortTermRental: "Autorizație pentru închirierea pe perioade sub 30 de zile",
      mountainTourism: "Permis pentru activități turistice în zone montane",
      ecotourism: "Certificare pentru turism ecologic în zone protejate", 
      culturalHeritage: "Aviz pentru turism în zone de patrimoniu cultural",
      ruralTourism: "Certificare pentru pensiuni și turism rural"
    };
    return descriptions[permitType] || "Document oficial necesar";
  };

  const getPermitStatusMessage = (permitType) => {
    if (!isUpdatingPermits) return null;
    
    const existingPermit = existingPermits.find(p => p.permit_type === permitType);
    if (!existingPermit) {
      return { type: 'missing', message: 'Permis lipsă - necesar pentru completare' };
    }
    
    if (existingPermit.status === 'rejected') {
      return { 
        type: 'rejected', 
        message: `Respins: ${existingPermit.rejection_reason || 'Document necorespunzător'}` 
      };
    }
    
    if (existingPermit.status === 'pending') {
      return { 
        type: 'pending', 
        message: 'Permis în așteptare - reupload pentru actualizare' 
      };
    }
    
    return null;
  };

  const currentPermitType = requiredPermits[currentPermitIndex];
  const currentFile = permits[currentPermitType];
  const isLastPermit = currentPermitIndex === requiredPermits.length - 1;
  const canProceed = currentFile !== null;
  const statusMessage = getPermitStatusMessage(currentPermitType);

  const nextPermit = () => {
    if (currentPermitIndex < requiredPermits.length - 1) {
      setCurrentPermitIndex(currentPermitIndex + 1);
    }
  };

  const prevPermit = () => {
    if (currentPermitIndex > 0) {
      setCurrentPermitIndex(currentPermitIndex - 1);
    }
  };

  const goBack = () => {
    if (isUpdatingPermits) {
      navigate("/host", {state: {user: state.user}});
    } else {
      navigate(-1, {state});
    }
  };

  if (isUpdatingPermits && requiredPermits.length === 0) {
    return (
      <div className='min-w-screen min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white rounded-lg p-8 shadow-md text-center max-w-md'>
          <Icon icon="material-symbols:check-circle" height="64" className='text-green-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>Toate permisele sunt în regulă!</h2>
          <p className='text-gray-600 mb-6'>Nu sunt necesare actualizări pentru această proprietate.</p>
          <button 
            onClick={() => navigate("/host", {state: {user: state.user}})}
            className='bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg'
          >
            Înapoi la proprietăți
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-w-screen min-h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='my-auto mx-8 text-5xl font-serif font-bold text-textMain'>
          {isUpdatingPermits ? "Actualizează permisele" : t("add-required-permits")}
        </div>
      </div>
      
      <div className='bg-stone-100 flex flex-col relative'>
        <div className='relative top-4 right-8 flex items-center gap-3'>
          <button className="absolute px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 right-24 top-0" onClick={goBack}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
          </button>
          
          <button className="absolute px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 right-0 top-0" onClick={() => navigate("/host", {state: {user: state.user}})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("exit")}</span>
          </button>
          
          { error && 
            <div className="mx-auto mt-14 bg-red-100 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md h-20 absolute inset-x-56 top-0" role="alert">
              <p className="font-bold">{t("error")}</p>
              <p className="text-sm">{error}</p>
            </div>
          }
        </div>

        {requiredPermits.length > 0 && (
          <div className={`h-128 2xl:h-256 ml-8 2xl:mx-auto ${error ? 'mt-1': 'mt-20'} mb-40 flex flex-col overflow-y-auto scrollbar-hide 2xl:px-36`}>
            
            {/* Progress indicator */}
            <div className='mb-6 bg-white rounded-lg p-4 shadow-sm'>
              <div className='flex justify-between items-center mb-2'>
                <h3 className='font-semibold text-gray-800'>
                  {isUpdatingPermits ? 'Progres actualizare' : 'Progres permise'} ({currentPermitIndex + 1}/{requiredPermits.length})
                </h3>
                <span className='text-sm text-gray-600'>
                  {Math.round(((currentPermitIndex + 1) / requiredPermits.length) * 100)}%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div 
                  className='bg-primary h-2 rounded-full transition-all duration-300' 
                  style={{width: `${((currentPermitIndex + 1) / requiredPermits.length) * 100}%`}}
                ></div>
              </div>
            </div>

            {/* Current permit upload */}
            {currentPermitType && (
              <div className='bg-white rounded-lg p-6 shadow-sm mb-6'>
                <div className='flex items-center mb-4'>
                  <Icon icon="material-symbols:description" className="mr-3 text-blue-600" height="32" />
                  <div className='flex-1'>
                    <h2 className='text-xl font-bold text-gray-800'>
                      {getPermitTitle(currentPermitType)}
                    </h2>
                    <p className='text-sm text-gray-600'>
                      {getPermitDescription(currentPermitType)}
                    </p>
                  </div>
                </div>

                {/* Status message for rejected/missing/pending permits */}
                {statusMessage && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    statusMessage.type === 'rejected' 
                      ? 'bg-red-50 border border-red-200' 
                      : statusMessage.type === 'pending'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className='flex items-center'>
                      <Icon 
                        icon={statusMessage.type === 'rejected' ? "material-symbols:cancel" : 
                              statusMessage.type === 'pending' ? "material-symbols:pending" :
                              "material-symbols:warning"} 
                        height="20" 
                        className={statusMessage.type === 'rejected' ? 'text-red-600 mr-2' : 
                                  statusMessage.type === 'pending' ? 'text-blue-600 mr-2' :
                                  'text-yellow-600 mr-2'} 
                      />
                      <span className={`text-sm font-medium ${
                        statusMessage.type === 'rejected' ? 'text-red-800' : 
                        statusMessage.type === 'pending' ? 'text-blue-800' :
                        'text-yellow-800'
                      }`}>
                        {statusMessage.message}
                      </span>
                    </div>
                  </div>
                )}

                {/* File upload area */}
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                  {currentFile ? (
                    <div className='flex flex-col items-center'>
                      <iframe
                        src={URL.createObjectURL(currentFile)}
                        width="300px"
                        height="200px"
                        title={`${getPermitTitle(currentPermitType)} Preview`}
                        style={{ border: 'none' }}
                        className='rounded mb-4'
                      />
                      <p className='text-sm text-gray-600 mb-4'>{currentFile.name}</p>
                      <button 
                        onClick={() => removeFile(currentPermitType)}
                        className='bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center'
                      >
                        <Icon icon="material-symbols:delete" className="mr-2" height="16" />
                        Șterge fișier
                      </button>
                    </div>
                  ) : (
                    <label className='cursor-pointer'>
                      <Icon icon="material-symbols:cloud-upload" className="mx-auto mb-4 text-gray-400" height="48" />
                      <p className='text-lg font-medium text-gray-700 mb-2'>
                        {isUpdatingPermits ? 
                          (statusMessage?.type === 'pending' ? 'Actualizează' : 'Încarcă noul') 
                          : 'Încarcă'} {getPermitTitle(currentPermitType)}
                      </p>
                      <p className='text-sm text-gray-500 mb-4'>
                        Selectează fișierul PDF cu documentul
                      </p>
                      <input 
                        type="file" 
                        accept='.pdf,.jpg,.jpeg,.png' 
                        className='hidden' 
                        onChange={(e) => handleFileUpload(currentPermitType, e.target.files[0])} 
                      />
                      <span className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
                        Selectează fișier
                      </span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className='flex justify-between items-center bg-white rounded-lg p-4 shadow-sm'>
              <button
                onClick={prevPermit}
                disabled={currentPermitIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPermitIndex === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <Icon icon="material-symbols:arrow-back" className="mr-2" height="16" />
                Anterior
              </button>

              {isLastPermit ? (
                <button
                  onClick={onSubmit}
                  disabled={!canProceed}
                  className={`flex items-center px-6 py-2 rounded-lg ${
                    canProceed 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon icon="material-symbols:check" className="mr-2" height="16" />
                  {isUpdatingPermits ? 'Trimite pentru aprobare' : 'Finalizează'}
                </button>
              ) : (
                <button
                  onClick={nextPermit}
                  disabled={!canProceed}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    canProceed 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Următorul
                  <Icon icon="material-symbols:arrow-forward" className="ml-2" height="16" />
                </button>
              )}
            </div>

            {/* Permit overview */}
            <div className='mt-6 bg-white rounded-lg p-4 shadow-sm'>
              <h3 className='font-semibold text-gray-800 mb-3'>
                {isUpdatingPermits ? 'Permise pentru actualizare:' : 'Toate permisele necesare:'}
              </h3>
              <div className='grid grid-cols-2 gap-2'>
                {requiredPermits.map((permitType, index) => {
                  const status = getPermitStatusMessage(permitType);
                  return (
                    <div 
                      key={permitType}
                      className={`flex items-center p-2 rounded text-sm ${
                        index === currentPermitIndex 
                          ? 'bg-blue-100 border border-blue-300' 
                          : permits[permitType] 
                            ? 'bg-green-100 text-green-800' 
                            : status?.type === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : status?.type === 'pending'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon 
                        icon={permits[permitType] ? "material-symbols:check-circle" : 
                              status?.type === 'rejected' ? "material-symbols:cancel" :
                              status?.type === 'pending' ? "material-symbols:pending" :
                              "material-symbols:radio-button-unchecked"} 
                        className="mr-2" 
                        height="16" 
                      />
                      {getPermitTitle(permitType)}
                      {status?.type === 'pending' && (
                        <span className='ml-1 text-xs'>(actualizare)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-200 h-2 relative inset-x-0 bottom-20">
          <div className="bg-primary h-2" style={{width: isUpdatingPermits ? "100%" : "95%"}}></div>
        </div>
      </div>
    </div>
  )
}

export default AddCerere
import React from 'react';
import Navbar from '../components/common/Navbar';

const EmergencyContacts = () => {
  const emergencyContacts = [
    { id: 1, name: 'Police', number: '100' },
    { id: 2, name: 'Ambulance', number: '102' },
    { id: 3, name: 'Fire Brigade', number: '101' },
    { id: 4, name: 'Women Helpline', number: '1091' },
    { id: 5, name: 'Disaster Management', number: '108' },
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <>
    <Navbar />
    <div className="pt-20 pb-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Emergency Contacts</h1>
      <div className="space-y-4">
        {emergencyContacts.map((contact) => (
          <div 
            key={contact.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{contact.name}</h3>
              <p className="text-gray-600">{contact.number}</p>
            </div>
            <button
              onClick={() => handleCall(contact.number)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default EmergencyContacts;

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Tent, MapPin } from "lucide-react";

const FreeCamps = () => {
  const camps = [
    {
      title: "Health Check-up Camp",
      location: "City Community Center",
      date: "April 18, 2024",
      services: ["General Health", "Eye Check-up", "Dental Care"],
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=2000",
    },
    {
      title: "Vaccination Drive",
      location: "District Hospital",
      date: "April 22, 2024",
      services: ["COVID-19", "Flu", "Regular Vaccinations"],
      image: "https://images.unsplash.com/photo-1587385789097-0197a7fbd179?auto=format&fit=crop&q=80&w=2000",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Tent className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Nearby Free Camps</h2>
      </div>

      {/* Accordion Container */}
      <Accordion.Root type="multiple" className="w-full space-y-3">
        {camps.map((camp, index) => (
          <Accordion.Item key={index} value={`camp-${index}`} className="bg-gray-50 rounded-lg shadow-sm">
            <Accordion.Header>
              <Accordion.Trigger className="group w-full flex justify-between items-center px-4 py-3 text-lg font-semibold text-gray-800 bg-white hover:bg-gray-100 rounded-lg transition-all duration-200">
                <span>{camp.title}</span>
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 text-green-600" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="p-4 border-t bg-gray-50 rounded-b-lg">
              <img src={camp.image} alt={camp.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{camp.location}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{camp.date}</p>
              <div className="mt-2">
                <p className="font-medium text-gray-700">Services:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {camp.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
};

export default FreeCamps;

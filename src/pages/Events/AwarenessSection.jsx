import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Droplet, Heart } from "lucide-react";

const AwarenessSection = () => {
  const waterQualityTips = [
    "Boil water for at least one minute before drinking",
    "Store water in clean, covered containers",
    "Use water purifiers or RO systems if available",
    "Regular cleaning of water storage tanks",
  ];

  const womenHealthTips = [
    "Regular health check-ups and screenings",
    "Balanced nutrition and iron-rich diet",
    "Regular exercise and physical activity",
    "Mental health awareness and support",
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Awareness Section</h2>

      {/* Accordion Container */}
      <Accordion.Root type="multiple" className="w-full space-y-3">
        {/* Water Quality Measures */}
        <Accordion.Item value="water-quality" className="bg-gray-50 rounded-lg shadow-sm">
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex justify-between items-center px-4 py-3 text-lg font-semibold text-gray-800 bg-white hover:bg-gray-100 rounded-lg transition-all duration-200">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-600" />
                <span>Water Quality Measures</span>
              </div>
              <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 text-blue-600" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="p-4 border-t bg-gray-50 rounded-b-lg">
            <ul className="space-y-2">
              {waterQualityTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>

        {/* Women Health Measures */}
        <Accordion.Item value="women-health" className="bg-gray-50 rounded-lg shadow-sm">
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex justify-between items-center px-4 py-3 text-lg font-semibold text-gray-800 bg-white hover:bg-gray-100 rounded-lg transition-all duration-200">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span>Women Health Measures</span>
              </div>
              <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 text-pink-600" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="p-4 border-t bg-gray-50 rounded-b-lg">
            <ul className="space-y-2">
              {womenHealthTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-pink-500">•</span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};

export default AwarenessSection;

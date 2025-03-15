import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Building2, ExternalLink } from "lucide-react";

const GovernmentSchemes = () => {
  const schemes = [
    {
      title: "PM Kisan Samman Nidhi",
      description: "Direct benefit transfer scheme for farmers.",
      eligibility: "Small and marginal farmers",
      link: "https://pmkisan.gov.in",
    },
    {
      title: "Ayushman Bharat",
      description: "Healthcare scheme providing coverage up to ₹5 lakhs.",
      eligibility: "Economically weaker sections",
      link: "https://pmjay.gov.in",
    },
    {
      title: "PM Awas Yojana",
      description: "Housing scheme for urban and rural areas.",
      eligibility: "Low and middle-income groups",
      link: "https://pmaymis.gov.in",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Government Schemes</h2>
      </div>

      {/* Accordion Container */}
      <Accordion.Root type="multiple" className="w-full space-y-3">
        {schemes.map((scheme, index) => (
          <Accordion.Item key={index} value={`scheme-${index}`} className="bg-gray-50 rounded-lg shadow-sm">
            <Accordion.Header>
              <Accordion.Trigger className="group w-full flex justify-between items-center px-4 py-3 text-lg font-semibold text-gray-800 bg-white hover:bg-gray-100 rounded-lg transition-all duration-200">
                <span>{scheme.title}</span>
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 text-purple-600" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="p-4 border-t bg-gray-50 rounded-b-lg">
              <p className="text-gray-600">{scheme.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Eligibility:</span> {scheme.eligibility}
              </p>
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 mt-2"
              >
                Learn More <ExternalLink className="w-4 h-4" />
              </a>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
};

export default GovernmentSchemes;

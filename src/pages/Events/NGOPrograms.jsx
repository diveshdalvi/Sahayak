import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Users, Heart } from 'lucide-react';

const NGOPrograms = () => {
  const programs = [
    {
      title: "Education for All",
      organization: "Global Education Trust",
      date: "April 15, 2024",
      description: "Free education program for underprivileged children",
    },
    {
      title: "Food Distribution Drive",
      organization: "Helping Hands NGO",
      date: "April 20, 2024",
      description: "Weekly food distribution in local communities",
    },
    {
      title: "Skill Development Workshop",
      organization: "Youth Empowerment Foundation",
      date: "April 25, 2024",
      description: "Free vocational training for young adults",
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">NGO Programs</h2>
      </div>

      {/* Accordion for NGO Programs */}
      <Accordion.Root type="multiple" className="w-full space-y-2">
        {programs.map((program, index) => (
          <Accordion.Item key={index} value={`program-${index}`} className="bg-gray-50 rounded-lg shadow-sm">
            <Accordion.Header>
              <Accordion.Trigger className="group w-full flex justify-between items-center px-4 py-3 text-lg font-semibold text-gray-800 bg-white hover:bg-gray-100 rounded-lg transition-all duration-200">
                <span>{program.title}</span>
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 text-blue-600" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="p-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-medium">{program.organization}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{program.date}</p>
              <p className="text-gray-600 mt-2">{program.description}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
};

export default NGOPrograms;

import React from 'react';
import NGOPrograms from "./NGOPrograms.jsx";
import FreeCamps from "./FreeCamps.jsx";
import GovernmentSchemes from "./GovernmentSchemes.jsx";
import AwarenessSection from "./AwarenessSection.jsx";

export default function Events() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-amber-50 white mb-6 text-center">
                    Community Resources & Events
                </h1>

                {/* Responsive grid layout */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    <NGOPrograms />
                    <FreeCamps />
                    <GovernmentSchemes />
                    <AwarenessSection />
                </div>
            </div>
        </div>
    );
};
import React from 'react';
import CropTokenizationComponent from '@/components/crop-tokenization/CropTokenization';

const CropTokenizationPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Crop Tokenization</h1>
      
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          Track and manage your crops on the blockchain for transparent supply chain verification and secure record keeping.
          Each token represents a unique growth cycle, from planting to harvest, with all environmental and genetic data immutably recorded.
        </p>
      </div>
      
      <CropTokenizationComponent />
    </div>
  );
};

export default CropTokenizationPage;
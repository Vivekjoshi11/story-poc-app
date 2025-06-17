'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import WalletProvider from './components/WalletProvider';
import RegisterForm from './components/registrationForm';
import RegisterDerivativeForm from './components/RegisterDerivativeCommercialForm';
import MintLicenseForm from './components/MintLicenseForm';
import ImageGenerator from './components/imageGenerator';
import RegisterDerivativeNonCommercial from './components/RegisterDerivativeNonCommercial';
import EditIpForm from './components/EditIpForm';
// import TransferRoyaltyForm from './components/transfer-royalty';
import ClaimRevenueForm from './components/claimRevenue';
// import RegisterCustom from './components/RegisterCustom';

export default function Home() {
  const [activeTab, setActiveTab] = useState('register');

  const tabs = [
    { id: 'register', label: 'Register IP Asset', component: <RegisterForm /> },
    { id: 'edit-ip', label: 'Edit IP Asset', component: <EditIpForm /> },
    // { id: 'register-custom', label: 'Register IP Asset custom', component: <RegisterCustom /> },
    { id: 'mint-license', label: 'Mint License', component: <MintLicenseForm /> },
    // { id: 'transfer-royalty', label: 'transfer-royalty', component: <TransferRoyaltyForm /> },
    {id: 'derivative-noncom', label: 'Register Derivative non com', component: <RegisterDerivativeNonCommercial />},
    { id: 'derivative', label: 'Register Derivative', component: <RegisterDerivativeForm /> },
    // { id: 'mint-derivative', label: 'Mint Derivative', component: <MintDerivativeForm /> },
     { id: 'claim-revenue', label: 'claim revenue', component: <ClaimRevenueForm /> },
    { id: 'image', label: 'Generate Image', component: <ImageGenerator /> },
  ];

  return (
    <WalletProvider>
      <main className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Story Protocol PoC</h1>
            <ConnectButton />
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className=" p-6 rounded-lg shadow-md">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </main>
    </WalletProvider>
  );
}
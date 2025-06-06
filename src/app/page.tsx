// app/page.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import WalletProvider from './components/WalletProvider';
import UploadAndRegister from './components/UploadAndRegister';
import ImageGenerator from './components/imageGenerator';

export default function Home() {
  return (
    <WalletProvider>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Story Protocol PoC</h1>
        <ConnectButton />
        <UploadAndRegister />
        <ImageGenerator />
      </main>
    </WalletProvider>
  );
}

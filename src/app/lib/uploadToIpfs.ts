/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/uploadToIpfs.ts
export async function uploadFileToIpfs(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`IPFS upload failed: ${errorText}`);
  }

  const json = await res.json();
  console.log('File uploaded to IPFS:', json);
  return `https://ipfs.io/ipfs/${json.IpfsHash}`;
}

export async function uploadJSONToIpfs(metadata: any): Promise<string> {
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `metadata-${Date.now()}.json`,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`JSON upload to IPFS failed: ${errorText}`);
  }

  const json = await res.json();
  console.log('JSON uploaded to IPFS:', json);
  return `https://ipfs.io/ipfs/${json.IpfsHash}`;
}
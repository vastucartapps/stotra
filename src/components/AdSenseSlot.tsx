"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseProps {
  slotId: string;
}

export default function AdSenseSlot({ slotId }: AdSenseProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense slot update caught safely:', err);
    }
  }, [pathname]);

  return (
    <div style={{ display: 'block', margin: '20px auto', textAlign: 'center', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1411902986257886"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
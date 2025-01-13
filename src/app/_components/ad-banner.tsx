'use client'

import Script from 'next/script';

export default function AdBanner() {
    return (
        <span className="text-xs w-full max-w-xl">

                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5162263720207671"
                    crossOrigin="anonymous"
                />
                <ins className="adsbygoogle"
                    data-ad-client="ca-pub-5162263720207671"
                    data-ad-slot="8164271956"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <Script id="adsbygoogle-push">
                    {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                </Script>
         
        </span>
    );
}
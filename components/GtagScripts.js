import Script from 'next/script';

export function GtagScripts() {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-Z12LCY13ES"
        strategy="beforeInteractive"
      />
      <Script id="gtag-init" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Z12LCY13ES');`}
      </Script>
      <Script id="yandex-metrika" strategy="beforeInteractive">
        {`(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=113085104', 'ym');
ym(113085104, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`}
      </Script>
    </>
  );
}

export function YandexNoscript() {
  return (
    <noscript>
      <div>
        <img src="https://mc.yandex.ru/watch/113085104" style={{ position: 'absolute', left: '-9999px' }} alt="" />
      </div>
    </noscript>
  );
}

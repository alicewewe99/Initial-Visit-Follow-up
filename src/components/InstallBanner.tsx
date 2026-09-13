import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(iosDevice);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (isStandalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General prompt tip
      alert('請點擊瀏覽器網址列右側的「安裝」圖示，或選單中的「新增至主畫面」即可安裝！');
    }
  };

  return (
    <>
      <div
        id="installBanner"
        className="max-w-2xl mx-auto mb-4 bg-yellow-400 border-4 border-red-600 p-3 sm:p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-3 text-red-900 font-bold"
      >
        <div className="flex items-center gap-3 text-sm sm:text-base">
          <img
            src="/5BBD3C72-1E50-4DFF-AEEA-B806F2CB0B91.png"
            alt="熊貓醫師桌面圖示"
            className="w-12 h-12 rounded-full border-2 border-red-800 shadow-md shrink-0 bg-yellow-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="font-extrabold text-red-950 flex items-center gap-1">
              <span>🐼 熊貓醫師 PWA 桌面圖示</span>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-full">已套用原圖</span>
            </div>
            <span className="text-xs sm:text-sm text-red-900 font-semibold">
              將本系統安裝至手機或電腦，桌面上將顯示可愛熊貓醫師圖示！
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="installBtn"
            onClick={handleInstallClick}
            className="bg-red-600 text-white px-4 py-2 rounded-lg border-2 border-red-800 shadow hover:bg-red-700 active:scale-95 transition cursor-pointer text-sm"
          >
            立即安裝
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-red-800 hover:text-red-950 p-1 text-sm font-normal underline cursor-pointer"
            title="稍後再說"
          >
            ✕
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-amber-50 border-4 border-red-600 p-6 shadow-2xl text-stone-900 font-sans">
            <div className="flex items-center gap-3 text-red-700 font-bold text-lg mb-3">
              <img
                src="/5BBD3C72-1E50-4DFF-AEEA-B806F2CB0B91.png"
                alt="熊貓醫師"
                className="w-10 h-10 rounded-full border-2 border-red-700 shadow"
                referrerPolicy="no-referrer"
              />
              <span>iOS 主畫面安裝教學</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 mb-3 text-xs text-stone-600 flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>加入主畫面後，桌面圖示為專屬「熊貓醫師」！</span>
            </div>
            <p className="text-sm text-stone-700 space-y-2 mb-4 leading-relaxed">
              1. 點擊 Safari 瀏覽器底部的 <strong>「分享」</strong> 按鈕（向上箭頭圖示）。
              <br />
              2. 向上滑動清單，選擇 <strong>「加入主畫面」</strong>。
              <br />
              3. 點選右上角 <strong>「新增」</strong>，即可在桌面直接啟動！
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl border-2 border-red-800 shadow cursor-pointer"
            >
              我知道了！
            </button>
          </div>
        </div>
      )}
    </>
  );
};

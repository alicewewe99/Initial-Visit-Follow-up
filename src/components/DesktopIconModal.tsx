import React, { useState } from 'react';
import { Download, Monitor, Smartphone, Apple, Check, Info, Sparkles, X } from 'lucide-react';

interface DesktopIconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopIconModal: React.FC<DesktopIconModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'windows' | 'mobile' | 'mac'>('preview');
  const [copiedHint, setCopiedHint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedHint('網址已複製！');
    setTimeout(() => setCopiedHint(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#fffdf0] border-4 border-[#2e7d32] shadow-2xl text-stone-900 font-sans relative flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-amber-200 bg-amber-100/70 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <img
              src="/5BBD3C72-1E50-4DFF-AEEA-B806F2CB0B91.png"
              alt="熊貓醫師桌面圖示"
              className="w-10 h-10 rounded-full border-2 border-emerald-700 shadow-sm bg-yellow-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 flex items-center gap-1.5">
                <span>🐼 專屬熊貓醫師桌面 Icon</span>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                  原圖製作完成
                </span>
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                依據上傳原圖製作・支援 Windows、iOS、Android 與 Mac 桌面
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center font-bold text-lg cursor-pointer border border-stone-300 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-amber-200 bg-amber-50 px-4 pt-2 gap-1 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 rounded-t-xl border-t-2 border-x-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-[#fffdf0] border-[#2e7d32] text-emerald-900 font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-amber-100/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>圖示預覽與下載</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('windows')}
            className={`px-3 py-2 rounded-t-xl border-t-2 border-x-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'windows'
                ? 'bg-[#fffdf0] border-[#2e7d32] text-emerald-900 font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-amber-100/50'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-blue-600" />
            <span>Windows 設定教學</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            className={`px-3 py-2 rounded-t-xl border-t-2 border-x-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mobile'
                ? 'bg-[#fffdf0] border-[#2e7d32] text-emerald-900 font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-amber-100/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>手機主畫面教學</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mac')}
            className={`px-3 py-2 rounded-t-xl border-t-2 border-x-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mac'
                ? 'bg-[#fffdf0] border-[#2e7d32] text-emerald-900 font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-amber-100/50'
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-stone-800" />
            <span>Mac 設定教學</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {activeTab === 'preview' && (
            <>
              {/* Platform Simulation Showcase */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-inner">
                <div className="text-xs font-bold text-stone-600 mb-3 text-center">
                  ✨ 各裝置桌面實機呈現效果（依原圖 1:1 比例製作）：
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* Windows simulation */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100 rounded-xl p-2 flex items-center justify-center border border-sky-300 shadow-sm relative group">
                      <img
                        src="/5BBD3C72-1E50-4DFF-AEEA-B806F2CB0B91.png"
                        alt="Windows 桌面圖示"
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain filter drop-shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-white/90 text-[9px] px-1 rounded font-bold text-sky-800 border border-sky-400">
                        .ico
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 mt-1.5">Windows 桌面</span>
                    <span className="text-[10px] text-stone-500">快捷捷徑樣式</span>
                  </div>

                  {/* iOS simulation */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#fbf5dc] rounded-[22%] p-0 flex items-center justify-center border border-amber-300 shadow-md overflow-hidden relative">
                      <img
                        src="/apple-touch-icon.png"
                        alt="iOS 主畫面圖示"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-white/90 text-[9px] px-1 rounded font-bold text-emerald-800 border border-emerald-400">
                        iOS
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 mt-1.5">iPhone 主畫面</span>
                    <span className="text-[10px] text-stone-500">無黑角全滿版</span>
                  </div>

                  {/* Android simulation */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full p-0 flex items-center justify-center border-2 border-amber-300 shadow-md overflow-hidden relative">
                      <img
                        src="/icon-maskable-192.png"
                        alt="Android 桌面圖示"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-white/90 text-[9px] px-1 rounded font-bold text-amber-800 border border-amber-400">
                        圓形
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 mt-1.5">Android 桌面</span>
                    <span className="text-[10px] text-stone-500">自適應圓形圖標</span>
                  </div>
                </div>
              </div>

              {/* Direct Download Action Grid */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1 px-1">
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>一鍵下載您所需要的桌面圖示格式：</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Windows .ICO download */}
                  <a
                    href="/panda-doctor.ico"
                    download="熊貓醫師_Windows桌面捷徑圖示.ico"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-950 font-bold text-xs shadow-xs hover:shadow transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      ICO
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-extrabold text-sky-900 group-hover:text-blue-900 flex items-center gap-1">
                        <span>Windows 捷徑圖示 (.ico)</span>
                      </div>
                      <div className="text-[10px] text-sky-700 font-normal">
                        多解析度 (256/128/64/48/32/16)
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-sky-700 group-hover:translate-y-0.5 transition shrink-0" />
                  </a>

                  {/* iOS / Full-bleed PNG download */}
                  <a
                    href="/apple-touch-icon.png"
                    download="熊貓醫師_iOS主畫面圖示_180x180.png"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-bold text-xs shadow-xs hover:shadow transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      iOS
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-extrabold text-amber-900 group-hover:text-amber-950 flex items-center gap-1">
                        <span>手機主畫面圖示 (.png)</span>
                      </div>
                      <div className="text-[10px] text-amber-700 font-normal">
                        180x180 滿版溫暖黃底（防黑角）
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-amber-700 group-hover:translate-y-0.5 transition shrink-0" />
                  </a>

                  {/* High-res 512x512 PNG download */}
                  <a
                    href="/icon-512.png"
                    download="熊貓醫師_高清桌面圖示_512x512.png"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-bold text-xs shadow-xs hover:shadow transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      512
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-extrabold text-emerald-900 group-hover:text-emerald-950 flex items-center gap-1">
                        <span>Mac / 高清透明徽章 (.png)</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-normal">
                        512x512 高清無失真透明背景
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-emerald-700 group-hover:translate-y-0.5 transition shrink-0" />
                  </a>

                  {/* Original image */}
                  <a
                    href="/5BBD3C72-1E50-4DFF-AEEA-B806F2CB0B91.png"
                    download="熊貓醫師_原圖.png"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-purple-950 font-bold text-xs shadow-xs hover:shadow transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      原圖
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-extrabold text-purple-900 group-hover:text-purple-950 flex items-center gap-1">
                        <span>下載上傳原始圖檔 (.png)</span>
                      </div>
                      <div className="text-[10px] text-purple-700 font-normal">
                        100% 一模一樣原圖檔
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-purple-700 group-hover:translate-y-0.5 transition shrink-0" />
                  </a>
                </div>
              </div>

              {/* Status callout */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>系統已自動套用：</strong>
                  本系統的 PWA 應用程式清單（`manifest.json`）與網頁標籤（`favicon`、`apple-touch-icon`）均已全面啟用熊貓醫師圖示。只要使用瀏覽器點選「安裝」或「加入主畫面」，桌面上就會直接出現熊貓醫師！
                </div>
              </div>
            </>
          )}

          {activeTab === 'windows' && (
            <div className="space-y-3 text-xs text-stone-700 leading-relaxed bg-white p-4 rounded-2xl border-2 border-sky-200">
              <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm pb-1 border-b border-sky-100">
                <Monitor className="w-4 h-4 text-sky-700" />
                <span>Windows 電腦：更換桌面捷徑圖示步驟</span>
              </div>
              <ol className="space-y-2.5 list-decimal list-inside text-stone-700">
                <li className="pl-1">
                  <strong>下載圖示檔：</strong>
                  先在「圖示預覽與下載」分頁點擊下載{' '}
                  <span className="bg-sky-100 text-sky-900 font-bold px-1.5 py-0.5 rounded border border-sky-300">
                    Windows 捷徑圖示 (.ico)
                  </span>
                  ，儲存至您的「下載」或「圖片」資料夾中。
                </li>
                <li className="pl-1">
                  <strong>在桌面建立捷徑：</strong>
                  在桌面空白處按<strong>右鍵</strong> ➡️ 選擇<strong>「新增」</strong> ➡️{' '}
                  <strong>「捷徑」</strong>。
                </li>
                <li className="pl-1">
                  <strong>貼上本系統網址：</strong>
                  <div className="my-1.5 flex items-center gap-2 bg-stone-100 p-2 rounded-lg border border-stone-300">
                    <code className="text-[11px] text-stone-800 select-all font-mono break-all flex-1">
                      {window.location.href}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer shrink-0"
                    >
                      {copiedHint || '複製網址'}
                    </button>
                  </div>
                </li>
                <li className="pl-1">
                  <strong>輸入捷徑名稱：</strong>例如「初診未規則返診分析」，點選「完成」。
                </li>
                <li className="pl-1">
                  <strong>變更為熊貓醫師圖示：</strong>
                  在剛建好的桌面捷徑上按<strong>右鍵</strong> ➡️ 選擇<strong>「內容」</strong> ➡️ 切換到<strong>「Web 文件」</strong>或<strong>「捷徑」</strong>頁籤 ➡️ 點擊<strong>「變更圖示 (Change Icon)」</strong> ➡️ 瀏覽並選取剛剛下載的{' '}
                  <code className="bg-stone-200 px-1 rounded text-stone-900 font-bold">.ico</code> 檔案 ➡️ 點擊「確定」即大功告成！
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-3 text-xs text-stone-700 leading-relaxed bg-white p-4 rounded-2xl border-2 border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm pb-1 border-b border-emerald-100">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>手機 / 平板（iPhone、iPad、Android）加到桌面步驟</span>
              </div>
              <div className="space-y-3">
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                  <div className="font-bold text-amber-950 mb-1 flex items-center gap-1">
                    <span>🍎 iPhone / iPad (Safari)：</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-stone-700">
                    <li>使用 <strong>Safari 瀏覽器</strong> 開啟本網頁。</li>
                    <li>點選螢幕下方工具列的 <strong>「分享」</strong> 按鈕（方框加向上箭頭）。</li>
                    <li>在選單中向上滑動，點選 <strong>「加入主畫面 (Add to Home Screen)」</strong>。</li>
                    <li>點選右上角的 <strong>「新增」</strong>。</li>
                    <li>回到手機主螢幕，即可看到圓潤無黑角的可愛熊貓醫師 App 圖示！</li>
                  </ol>
                </div>

                <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                  <div className="font-bold text-emerald-950 mb-1 flex items-center gap-1">
                    <span>🤖 Android 手機 (Chrome)：</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-stone-700">
                    <li>使用 <strong>Chrome 瀏覽器</strong> 開啟本網頁。</li>
                    <li>點擊右上角選單（三個直立點點 ⋮）。</li>
                    <li>點選 <strong>「安裝應用程式」</strong> 或 <strong>「新增至主螢幕」</strong>。</li>
                    <li>確認後，手機桌面就會建立具備熊貓醫師圖示的獨立 App！</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mac' && (
            <div className="space-y-3 text-xs text-stone-700 leading-relaxed bg-white p-4 rounded-2xl border-2 border-stone-300">
              <div className="flex items-center gap-2 text-stone-900 font-extrabold text-sm pb-1 border-b border-stone-200">
                <Apple className="w-4 h-4 text-stone-800" />
                <span>Mac 蘋果電腦：設定桌面圖示步驟</span>
              </div>
              <ol className="space-y-2 list-decimal list-inside text-stone-700">
                <li className="pl-1">
                  下載「<strong>Mac / 高清透明徽章 (.png)</strong>」檔案。
                </li>
                <li className="pl-1">
                  使用 Safari 點選頂端選單 <strong>「檔案」</strong> ➡️ <strong>「加入 Dock」</strong>（macOS Sonoma 以上），系統會直接以熊貓醫師圖示常駐在 Dock 與啟動台中！
                </li>
                <li className="pl-1">
                  或對桌面上的任何捷徑按快捷鍵 <code className="bg-stone-200 px-1 py-0.5 rounded font-bold">⌘ + I</code>（取得資訊），將下載的 PNG 圖示直接拖拉到左上角的小圖標上即可替換！
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-amber-200 bg-amber-50 flex justify-between items-center text-xs">
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>圖示採用 100% 原始圖片規格產生</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold py-2 px-5 rounded-xl border-2 border-[#1b5e20] shadow-sm cursor-pointer transition text-xs"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};

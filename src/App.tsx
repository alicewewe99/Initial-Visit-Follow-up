import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { BaseStatsMap, ReasonDiagItem } from './types';
import { playEffect } from './utils/audio';
import { InstallBanner } from './components/InstallBanner';
import { PdfReportDocument } from './components/PdfReportDocument';
import { DesktopIconModal } from './components/DesktopIconModal';
import { Copy, Camera, FileDown, Trash2, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

const DIAGNOSIS_OPTIONS = [
  'F01', 'F03', 'F05', 'F32', 'F33', 'F34', 'F41', 'F43', 'F20', 'F10', 'F06', 'F28', 'F51', 'F95'
];

const REASON_OPTIONS = [
  '💡 自覺改善或痊癒',
  '🏥 回原醫院治療',
  '🏡 就近醫院或診所治療',
  '🏃 工作忙碌或有事',
  '🏨 因生理問題至綜合醫院治療',
  '❓ 該詢診',
  '💊 未規則服藥，目前還有剩藥',
  '⚠️ 藥物不適應',
  '🧠 缺乏疾病／藥物認知',
  '⏳ 等待心理測驗或心理治療',
  '📞 電話未接聽',
  '❌ 電話錯號',
  '🦠 因疫情關係不想到醫院',
  '🕊️ 死亡',
  '💭 忘記'
];

// Clean reason text by stripping leading emojis for concise records or matching
function cleanReasonText(str: string) {
  return str.replace(/^[^\w\u4e00-\u9fa5]+\s*/, '').trim();
}

const INITIAL_DEMO_BASE: BaseStatsMap = {
  '3月': { t: 58, reg: 38, nR: 20 },
  '4月': { t: 64, reg: 45, nR: 19 }
};

const INITIAL_DEMO_LIST: ReasonDiagItem[] = [
  { id: 1, r: '自覺改善或痊癒', d: 'F32' },
  { id: 2, r: '自覺改善或痊癒', d: 'F41' },
  { id: 3, r: '工作忙碌或有事', d: 'F32' },
  { id: 4, r: '回原醫院治療', d: 'F20' },
  { id: 5, r: '藥物不適應', d: 'F32' },
  { id: 6, r: '電話未接聽', d: 'F10' }
];

export default function App() {
  const [baseStats, setBaseStats] = useState<BaseStatsMap>(() => {
    try {
      const saved = localStorage.getItem('yoshi_baseStats');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DEMO_BASE;
  });

  const [reasonDiagList, setReasonDiagList] = useState<ReasonDiagItem[]>(() => {
    try {
      const saved = localStorage.getItem('yoshi_reasonDiagList');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DEMO_LIST;
  });

  // Form State
  const [selectedMonth, setSelectedMonth] = useState<string>('5月');
  const [regularCount, setRegularCount] = useState<string>('30');
  const [noReturnCount, setNoReturnCount] = useState<string>('15');
  const [diagnosisChoice, setDiagnosisChoice] = useState<string>('F32');
  const [manualDiag, setManualDiag] = useState<string>('');
  const [reasonChoice, setReasonChoice] = useState<string>('💡 自覺改善或痊癒');

  // Preview & Export State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showIconModal, setShowIconModal] = useState<boolean>(false);

  const statsBoardRef = useRef<HTMLDivElement>(null);
  const printableReportRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('yoshi_baseStats', JSON.stringify(baseStats));
    } catch {
      // storage error
    }
  }, [baseStats]);

  useEffect(() => {
    try {
      localStorage.setItem('yoshi_reasonDiagList', JSON.stringify(reasonDiagList));
    } catch {
      // storage error
    }
  }, [reasonDiagList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const fireYoshiConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2e7d32', '#ff5722', '#ffeb3b', '#e53935']
      });
    } catch {
      // ignore
    }
  };

  const regNum = parseInt(regularCount, 10) || 0;
  const nRNum = parseInt(noReturnCount, 10) || 0;
  const autoTotal = regNum + nRNum;

  const handleAddData = () => {
    playEffect();

    if (!selectedMonth) {
      showToast('⚠️ 請選擇月份！');
      return;
    }

    if (autoTotal === 0) {
      showToast('⚠️ 請輸入規則返診或未規則返診人數！');
      return;
    }

    const effectiveDiag = diagnosisChoice === '手動輸入' ? manualDiag.trim().toUpperCase() : diagnosisChoice;
    const effectiveReason = cleanReasonText(reasonChoice);

    // Update monthly base stats
    setBaseStats((prev) => ({
      ...prev,
      [selectedMonth]: {
        t: autoTotal,
        reg: regNum,
        nR: nRNum
      }
    }));

    // If diagnosis and reason are specified, record item
    if (effectiveDiag && effectiveReason) {
      const newItem: ReasonDiagItem = {
        id: Date.now() + Math.random(),
        r: effectiveReason,
        d: effectiveDiag
      };
      setReasonDiagList((prev) => [...prev, newItem]);
    }

    fireYoshiConfetti();
    showToast(`⭐ 已成功新增「${selectedMonth}」統計項目！`);
  };

  const deleteMonth = (monthKey: string) => {
    playEffect();
    setBaseStats((prev) => {
      const copy = { ...prev };
      delete copy[monthKey];
      return copy;
    });
    showToast(`🗑️ 已刪除 ${monthKey} 人數資料`);
  };

  const deleteItem = (id: number) => {
    playEffect();
    setReasonDiagList((prev) => prev.filter((item) => item.id !== id));
    showToast('🗑️ 已刪除該項目');
  };

  const resetAllData = () => {
    if (window.confirm('確定要清空所有統計數據嗎？')) {
      playEffect();
      setBaseStats({});
      setReasonDiagList([]);
      setPreviewImage(null);
      showToast('✨ 已清空所有統計數據');
    }
  };

  const loadSampleData = () => {
    playEffect();
    setBaseStats(INITIAL_DEMO_BASE);
    setReasonDiagList(INITIAL_DEMO_LIST);
    fireYoshiConfetti();
    showToast('🦖 已成功重載耀西範例數據！');
  };

  // Groupings for rankings
  const diagCounts: Record<string, { total: number; items: ReasonDiagItem[] }> = {};
  reasonDiagList.forEach((item) => {
    if (!diagCounts[item.d]) {
      diagCounts[item.d] = { total: 0, items: [] };
    }
    diagCounts[item.d].total += 1;
    diagCounts[item.d].items.push(item);
  });
  const sortedDiags = Object.keys(diagCounts).sort((a, b) => diagCounts[b].total - diagCounts[a].total);

  const reasonCounts: Record<string, { total: number; items: ReasonDiagItem[] }> = {};
  reasonDiagList.forEach((item) => {
    if (!reasonCounts[item.r]) {
      reasonCounts[item.r] = { total: 0, items: [] };
    }
    reasonCounts[item.r].total += 1;
    reasonCounts[item.r].items.push(item);
  });
  const sortedReasons = Object.keys(reasonCounts).sort((a, b) => reasonCounts[b].total - reasonCounts[a].total);

  // Copy Statistics text
  const copyStats = () => {
    playEffect();
    let text = '🦖🥚🍄 === 耀西蘑菇島：初診未規則返診原因分析 === 🍄🥚🦖\n\n【📊 總人數統計】\n';
    const monthKeys = Object.keys(baseStats);
    if (monthKeys.length === 0) {
      text += '✨ 無資料\n';
    } else {
      text +=
        monthKeys
          .map(
            (k) =>
              `📅 ${k} ➡️ 初診總量: ${baseStats[k].t} (🟢 規則返診: ${baseStats[k].reg}, 🔴 未規則返診: ${baseStats[k].nR})`
          )
          .join('\n') + '\n';
    }

    text += '\n【🏆 診斷代碼統計（排名）】\n';
    if (sortedDiags.length === 0) {
      text += '✨ 無資料\n';
    } else {
      sortedDiags.forEach((d, i) => {
        text += `🏅 第 ${i + 1} 名: 代碼 ${d} (${diagCounts[d].total}人)\n`;
      });
    }

    text += '\n【🌟 未返診原因分析（排名）】\n';
    if (sortedReasons.length === 0) {
      text += '✨ 無資料\n';
    } else {
      sortedReasons.forEach((r, i) => {
        text += `⭐ 第 ${i + 1} 名: ${r} (${reasonCounts[r].total}人)\n`;
      });
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          fireYoshiConfetti();
          showToast('✨ 全部統計結果文字已成功複製至剪貼簿！');
        })
        .catch(() => {
          fallbackCopyText(text);
        });
    } else {
      fallbackCopyText(text);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      fireYoshiConfetti();
      showToast('✨ 全部統計結果文字已成功複製至剪貼簿！');
    } catch {
      showToast('❌ 複製失敗，請手動選取複製');
    }
    document.body.removeChild(textArea);
  };

  // Generate Screenshot Preview & Download
  const generatePreview = async (downloadDirectly = false) => {
    playEffect();
    if (!statsBoardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(statsBoardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff8e1',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      setPreviewImage(imgData);

      if (downloadDirectly) {
        const link = document.createElement('a');
        link.download = '初診未規則返診原因分析_耀西快照.png';
        link.href = imgData;
        link.click();
        showToast('📸 耀西快照圖片已下載！');
      } else {
        showToast('📸 快照生成完畢，請檢視下方預覽！');
        // Scroll down slightly to show preview
        setTimeout(() => {
          document.getElementById('previewContainer')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err) {
      console.error(err);
      showToast('❌ 生成快照失敗');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Standard Multi-page Official Medical PDF Report
  const exportPDF = async () => {
    playEffect();
    const targetElement = printableReportRef.current || statsBoardRef.current;
    if (!targetElement) return;
    setIsExporting(true);
    showToast('⏳ 正在生成標準醫療統計 PDF 報表...');

    try {
      // Temporarily reveal the off-screen element if needed so html2canvas renders with full dimensions
      const wasHidden = targetElement.style.display === 'none';
      if (wasHidden) {
        targetElement.style.display = 'block';
      }

      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1024,
      });

      if (wasHidden) {
        targetElement.style.display = 'none';
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210; // A4 mm
      const pageHeight = 297; // A4 mm
      const margin = 12; // 12mm margins
      const contentWidth = pageWidth - margin * 2; // 186mm
      const contentHeight = pageHeight - margin * 2; // 273mm

      const totalHeightMm = (canvas.height * contentWidth) / canvas.width;

      if (totalHeightMm <= contentHeight) {
        // Fits on a single A4 page perfectly
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, totalHeightMm);

        // Footer note
        pdf.setFontSize(8);
        pdf.setTextColor(140, 140, 140);
        pdf.text(
          '初診未規則返診原因分析統計報表・第 1 頁 / 共 1 頁',
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      } else {
        // Multi-page clean slicing: render page-by-page so text and rows are never cut off
        const pxPerMm = canvas.width / contentWidth;
        const pageSliceHeightPx = Math.floor(contentHeight * pxPerMm);
        const totalPages = Math.ceil(canvas.height / pageSliceHeightPx);
        let currentY = 0;
        let pageNum = 1;

        while (currentY < canvas.height) {
          const sliceHeightPx = Math.min(pageSliceHeightPx, canvas.height - currentY);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeightPx;
          const ctx = pageCanvas.getContext('2d');

          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0,
              currentY,
              canvas.width,
              sliceHeightPx,
              0,
              0,
              canvas.width,
              sliceHeightPx
            );
          }

          const pageData = pageCanvas.toDataURL('image/jpeg', 0.98);
          const sliceHeightMm = (sliceHeightPx * contentWidth) / canvas.width;

          if (pageNum > 1) {
            pdf.addPage();
          }

          pdf.addImage(pageData, 'JPEG', margin, margin, contentWidth, sliceHeightMm);

          // Add formal header & footer markers
          pdf.setFontSize(8);
          pdf.setTextColor(140, 140, 140);
          pdf.text(
            `初診未規則返診原因分析統計報表 (第 ${pageNum} 頁 / 共 ${totalPages} 頁)`,
            pageWidth / 2,
            pageHeight - 5,
            { align: 'center' }
          );

          currentY += sliceHeightPx;
          pageNum++;
        }
      }

      // Generate exact timestamped PDF filename
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const fileName = `初診未規則返診原因分析報表_${dateStr}.pdf`;

      // Export as Blob and trigger genuine browser file download
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

      fireYoshiConfetti();
      showToast('📥 已成功轉檔並下載標準 PDF 報表！');
    } catch (err) {
      console.error(err);
      showToast('❌ 轉檔 PDF 失敗，請重試');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-5 flex flex-col items-center">
      {/* PWA Install Banner */}
      <div className="w-full max-w-2xl">
        <InstallBanner />
      </div>

      {/* Main Input Card */}
      <div className="w-full max-w-2xl yoshi-island-card p-4 sm:p-7 mb-6 mt-1 transition-all">
        <div className="text-center mb-4 pt-1">
          {/* Doctor Panda Desktop Icon Badge */}
          <div className="flex justify-center mb-2">
            <button
              type="button"
              onClick={() => setShowIconModal(true)}
              className="group flex items-center gap-2.5 bg-yellow-100/90 hover:bg-yellow-200 border-2 border-amber-400 text-amber-950 px-3.5 py-1.5 rounded-full shadow-xs hover:shadow transition cursor-pointer"
              title="點擊查看與下載專屬熊貓醫師桌面圖示 (.ico / .png)"
            >
              <img
                src="/5BBD3C72-1E50-4DFF-AEEA-B806F2CB0B91.png"
                alt="熊貓醫師桌面圖示"
                className="w-8 h-8 rounded-full border border-amber-600 shadow-xs group-hover:scale-105 transition"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <span>🐼 桌面圖示：熊貓醫師</span>
                <span className="bg-amber-500/20 text-amber-950 text-[10px] px-1.5 py-0.5 rounded font-bold border border-amber-400/60">
                  點擊下載與教學
                </span>
              </span>
            </button>
          </div>

          <span className="text-3xl inline-block animate-bounce select-none">🦖🥚🍄</span>
          <h1 className="text-xl sm:text-2xl text-[#b71c1c] font-bold mt-1 tracking-wide">
            初診未規則返診原因分析
          </h1>
          <p className="text-xs sm:text-sm text-[#2e7d32] font-bold tracking-wider mt-0.5">
            ～ 耀西蘑菇島冒險統計站 (PWA) ～
          </p>
        </div>

        <form
          id="recordForm"
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddData();
          }}
        >
          {/* Month Select */}
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              🗓️ 選擇月份 (Month):
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mario-input text-sm font-bold text-gray-800"
            >
              <option value="">🌟 選擇月份</option>
              {Array.from({ length: 12 }, (_, i) => `${i + 1}月`).map((m) => (
                <option key={m} value={m}>
                  📅 {m}
                </option>
              ))}
            </select>
          </div>

          {/* Counts Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">
                🟢 規則返診人數 (Regular):
              </label>
              <input
                type="number"
                id="regular"
                min="0"
                placeholder="🟢 規則返診人數"
                value={regularCount}
                onChange={(e) => setRegularCount(e.target.value)}
                className="mario-input text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-red-950 mb-1">
                🔴 未規則返診人數 (No Return):
              </label>
              <input
                type="number"
                id="noReturn"
                min="0"
                placeholder="🔴 未規則返診人數"
                value={noReturnCount}
                onChange={(e) => setNoReturnCount(e.target.value)}
                className="mario-input text-sm font-bold"
              />
            </div>
          </div>

          {/* Auto Calculated Yoshi Total */}
          <div className="p-3 bg-amber-100/70 border-2 border-dashed border-amber-400 text-center rounded-xl shadow-inner">
            <span className="text-sm font-bold text-gray-800">🍄 初診總量 (Yoshi Total):</span>{' '}
            <span id="autoTotal" className="font-extrabold text-red-600 text-xl mx-1">
              {autoTotal}
            </span>{' '}
            <span className="text-sm font-bold text-gray-700">人</span>
            {autoTotal > 0 && (
              <span className="text-xs ml-2 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                返診率: {Math.round((regNum / autoTotal) * 100)}%
              </span>
            )}
          </div>

          {/* Diagnosis Code Select */}
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              🔎 選擇診斷代碼 (ICD-10 Code):
            </label>
            <select
              id="diagnosis"
              value={diagnosisChoice}
              onChange={(e) => setDiagnosisChoice(e.target.value)}
              className="mario-input text-sm font-bold text-gray-800"
            >
              <option value="">🔎 選擇診斷代碼</option>
              {DIAGNOSIS_OPTIONS.map((code) => (
                <option key={code} value={code}>
                  代碼 {code}
                </option>
              ))}
              <option value="手動輸入">✍️ 手動輸入代碼</option>
            </select>
          </div>

          {/* Manual input if chosen */}
          {diagnosisChoice === '手動輸入' && (
            <div>
              <input
                type="text"
                id="manualDiag"
                value={manualDiag}
                onChange={(e) => setManualDiag(e.target.value)}
                className="mario-input text-sm font-bold"
                placeholder="請輸入自定義診斷代碼 (例: F40, F31)..."
              />
            </div>
          )}

          {/* Reason Select */}
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1">
              💡 未返診原因 (Irregular Reason):
            </label>
            <select
              id="reason"
              value={reasonChoice}
              onChange={(e) => setReasonChoice(e.target.value)}
              className="mario-input text-sm font-bold text-gray-800"
            >
              {REASON_OPTIONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mario-btn font-bold text-base mt-2 flex items-center justify-center gap-2"
          >
            <span>⭐ 新增統計項目 (Yoshi!) ⭐</span>
          </button>
        </form>

        {/* Data Tools: Demo & Clear */}
        <div className="flex justify-between items-center text-xs mt-3 pt-2 border-t border-amber-300 text-stone-600 font-bold">
          <button
            type="button"
            onClick={loadSampleData}
            className="hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> 載入範例資料
          </button>
          <button
            type="button"
            onClick={resetAllData}
            className="hover:text-red-700 flex items-center gap-1 cursor-pointer text-stone-500"
          >
            <Trash2 className="w-3.5 h-3.5" /> 清空全部資料
          </button>
        </div>
      </div>

      {/* Statistics Board Card (Export Target) */}
      <div
        id="statsBoardArea"
        ref={statsBoardRef}
        className="w-full max-w-2xl yoshi-island-card p-4 sm:p-7 mb-6"
      >
        <div className="text-center font-extrabold text-amber-950 text-base sm:text-lg border-b-2 border-amber-300 pb-2 mb-3 tracking-wide">
          🏝️ 初診未返診原因統計 🏝️
        </div>

        {/* 1. Monthly Base Stats */}
        <div className="section-title">
          <span className="mushroom-icon" />
          <span>總人數統計：</span>
        </div>
        <div id="baseStatsList">
          {Object.keys(baseStats).length === 0 ? (
            <div className="text-xs text-gray-500 py-3 text-center font-bold bg-white/60 rounded-xl border border-dashed border-gray-300">
              ✨ 尚未新增月份統計資料 🦖
            </div>
          ) : (
            Object.keys(baseStats).map((k) => {
              const stat = baseStats[k];
              const returnRate = stat.t > 0 ? Math.round((stat.reg / stat.t) * 100) : 0;
              return (
                <div key={k} className="stat-item border-l-8 border-l-green-600">
                  <div className="font-bold text-gray-800">
                    <span className="text-base text-emerald-900 font-extrabold">📅 {k}</span>
                    <br />
                    <span className="text-xs font-normal text-gray-700">
                      - 初診總量: <strong className="text-red-600">{stat.t}</strong> | 規則返診:{' '}
                      <strong className="text-emerald-700">{stat.reg}</strong> | 未規則返診:{' '}
                      <strong className="text-amber-700">{stat.nR}</strong> (返診率: {returnRate}%)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="delete-btn shrink-0"
                    onClick={() => deleteMonth(k)}
                  >
                    刪除月份
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* 2. Diagnosis Rankings */}
        <div className="section-title">
          <span className="mushroom-icon" />
          <span>診斷代碼統計（排名）：</span>
        </div>
        <div id="diagStatsList">
          {sortedDiags.length === 0 ? (
            <div className="text-xs text-gray-500 py-3 text-center font-bold bg-white/60 rounded-xl border border-dashed border-gray-300">
              ✨ 尚未新增診斷代碼項目 🦖
            </div>
          ) : (
            sortedDiags.map((d, i) => (
              <div key={d} className="stat-item flex-col items-start border-l-8 border-l-red-500">
                <div className="font-bold w-full flex justify-between text-red-800 text-sm">
                  <span>
                    🏆 第 {i + 1} 名: 代碼 <span className="text-base font-extrabold">{d}</span>{' '}
                    ({diagCounts[d].total}人)
                  </span>
                </div>
                <div className="w-full mt-1.5 space-y-1">
                  {diagCounts[d].items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center ml-1 sm:ml-2 text-[12px] text-gray-700 bg-green-50/90 p-1.5 px-2.5 rounded-lg border border-green-200 shadow-xs"
                    >
                      <span className="font-medium">🥚 原因: {item.r}</span>
                      <button
                        type="button"
                        className="delete-btn shrink-0"
                        onClick={() => deleteItem(item.id)}
                      >
                        刪除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 3. Reasons Rankings */}
        <div className="section-title">
          <span className="mushroom-icon" />
          <span>未返診原因分析（排名）：</span>
        </div>
        <div id="reasonStatsList">
          {sortedReasons.length === 0 ? (
            <div className="text-xs text-gray-500 py-3 text-center font-bold bg-white/60 rounded-xl border border-dashed border-gray-300">
              ✨ 尚未新增未返診原因項目 🦖
            </div>
          ) : (
            sortedReasons.map((r, i) => (
              <div
                key={r}
                className="stat-item flex-col items-start border-l-8 border-l-amber-500"
              >
                <div className="font-bold w-full flex justify-between text-amber-900 text-sm">
                  <span>
                    🌟 第 {i + 1} 名: <span className="font-extrabold">{r}</span>{' '}
                    ({reasonCounts[r].total}人)
                  </span>
                </div>
                <div className="w-full mt-1.5 space-y-1">
                  {reasonCounts[r].items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center ml-1 sm:ml-2 text-[12px] text-gray-700 bg-amber-50/90 p-1.5 px-2.5 rounded-lg border border-amber-200 shadow-xs"
                    >
                      <span className="font-medium">🍄 代碼: {item.d}</span>
                      <button
                        type="button"
                        className="delete-btn shrink-0"
                        onClick={() => deleteItem(item.id)}
                      >
                        刪除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-2xl space-y-3 pb-12">
        <button
          type="button"
          onClick={copyStats}
          className="bg-[#2e7d32] text-white p-4 font-bold border-4 border-[#1b5e20] w-full text-sm rounded-xl shadow-lg hover:bg-[#388e3c] active:translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          <span>📋 複製全部統計文字 (含 Emoji)</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isExporting}
            onClick={() => generatePreview(false)}
            className="bg-[#1976d2] text-white p-4 font-bold border-4 border-[#0d47a1] w-full text-sm rounded-xl shadow-lg hover:bg-[#2196f3] active:translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Camera className="w-4 h-4" />
            <span>📸 預覽全部結果與快照</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={exportPDF}
            className="bg-[#d32f2f] text-white p-4 font-bold border-4 border-[#b71c1c] w-full text-sm rounded-xl shadow-lg hover:bg-[#e53935] active:translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <FileDown className="w-4 h-4" />
            <span>📥 正確轉檔成 PDF 報表 (A4 格式)</span>
          </button>
        </div>

        {/* Snapshot Preview Container */}
        {previewImage && (
          <div id="previewContainer" className="mt-4 text-center animate-fadeIn">
            <div className="flex justify-between items-center mb-2 px-1">
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5 drop-shadow">
                <span>📸 完整統計預覽快照：</span>
              </h3>
              <button
                type="button"
                onClick={() => generatePreview(true)}
                className="text-xs bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-3 py-1.5 rounded-lg border-2 border-amber-600 shadow cursor-pointer flex items-center gap-1"
              >
                <span>💾 下載 PNG 圖檔</span>
              </button>
            </div>
            <img
              id="resultImage"
              className="w-full border-4 border-amber-300 shadow-2xl rounded-xl bg-white"
              src={previewImage}
              alt="統計預覽快照"
            />
          </div>
        )}
      </div>

      {/* Doctor Panda Desktop Icon Modal */}
      <DesktopIconModal
        isOpen={showIconModal}
        onClose={() => setShowIconModal(false)}
      />

      {/* Floating Animated Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl border-3 border-yellow-300 z-50 animate-bounce flex items-center gap-2 select-none">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden Offscreen Printable PDF Document Element */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div ref={printableReportRef}>
          <PdfReportDocument
            baseStats={baseStats}
            reasonDiagList={reasonDiagList}
            diagCounts={diagCounts}
            sortedDiags={sortedDiags}
            reasonCounts={reasonCounts}
            sortedReasons={sortedReasons}
          />
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { BaseStatsMap, ReasonDiagItem } from '../types';

interface PdfReportDocumentProps {
  baseStats: BaseStatsMap;
  reasonDiagList: ReasonDiagItem[];
  diagCounts: Record<string, { total: number; items: ReasonDiagItem[] }>;
  sortedDiags: string[];
  reasonCounts: Record<string, { total: number; items: ReasonDiagItem[] }>;
  sortedReasons: string[];
}

export const PdfReportDocument: React.FC<PdfReportDocumentProps> = ({
  baseStats,
  reasonDiagList,
  diagCounts,
  sortedDiags,
  reasonCounts,
  sortedReasons,
}) => {
  const currentDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Calculate summary metrics
  const monthKeys = Object.keys(baseStats);
  const totalFirstVisits = monthKeys.reduce((acc, k) => acc + (baseStats[k]?.t || 0), 0);
  const totalRegular = monthKeys.reduce((acc, k) => acc + (baseStats[k]?.reg || 0), 0);
  const totalIrregular = monthKeys.reduce((acc, k) => acc + (baseStats[k]?.nR || 0), 0);
  const overallReturnRate =
    totalFirstVisits > 0 ? Math.round((totalRegular / totalFirstVisits) * 100) : 0;

  return (
    <div
      id="pdf-printable-report"
      style={{
        width: '794px', // Standard A4 at 96 DPI
        minHeight: '1123px',
        backgroundColor: '#ffffff',
        color: '#1c1917',
        fontFamily: "'M PLUS Rounded 1c', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '36px 40px',
        boxSizing: 'border-box',
        lineHeight: 1.5,
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          borderBottom: '3px solid #2e7d32',
          paddingBottom: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/5BBD3C72-1E50-4DFF-AEEA-B806F2CB0B91.png"
            alt="熊貓醫師"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '2px solid #2e7d32',
            }}
          />
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 900,
                color: '#1b5e20',
                letterSpacing: '0.5px',
              }}
            >
              初診未規則返診原因分析統計報表
            </h1>
            <p
              style={{
                margin: '3px 0 0 0',
                fontSize: '12px',
                color: '#57534e',
                fontWeight: 600,
              }}
            >
              精神醫療與門診個案返診追蹤暨原因質性分析報告・耀西蘑菇島系統
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '11px', color: '#78716c' }}>
          <div><strong>列印日期：</strong>{currentDate}</div>
          <div><strong>報表編號：</strong>REP-{Date.now().toString().slice(-6)}</div>
          <div style={{ marginTop: '2px', color: '#2e7d32', fontWeight: 700 }}>● 正式分析報告</div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '22px',
        }}
      >
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '10px',
            padding: '10px 14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>初診總人次</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#14532d', marginTop: '2px' }}>
            {totalFirstVisits} <span style={{ fontSize: '11px', fontWeight: 500 }}>人</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #93c5fd',
            borderRadius: '10px',
            padding: '10px 14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700 }}>規則返診總計</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', marginTop: '2px' }}>
            {totalRegular} <span style={{ fontSize: '11px', fontWeight: 500 }}>人</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '10px',
            padding: '10px 14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 700 }}>未規則返診總計</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#78350f', marginTop: '2px' }}>
            {totalIrregular} <span style={{ fontSize: '11px', fontWeight: 500 }}>人</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '10px 14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 700 }}>平均返診率</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#7f1d1d', marginTop: '2px' }}>
            {overallReturnRate}%
          </div>
        </div>
      </div>

      {/* Section 1: Monthly Statistics Table */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            borderLeft: '4px solid #16a34a',
            paddingLeft: '10px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#166534' }}>
            一、月份初診與返診人數統計總表
          </h2>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#334155' }}>月份區間</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#334155', textAlign: 'center' }}>初診總人次</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#15803d', textAlign: 'center' }}>規則返診</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#b91c1c', textAlign: 'center' }}>未規則返診</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#334155', textAlign: 'center' }}>返診率 (%)</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#334155' }}>狀態備註</th>
            </tr>
          </thead>
          <tbody>
            {monthKeys.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '14px', textAlign: 'center', color: '#94a3b8' }}>
                  尚無月份統計資料
                </td>
              </tr>
            ) : (
              monthKeys.map((k, index) => {
                const stat = baseStats[k];
                const rate = stat.t > 0 ? Math.round((stat.reg / stat.t) * 100) : 0;
                return (
                  <tr
                    key={k}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                    }}
                  >
                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{k}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700 }}>{stat.t}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#15803d', fontWeight: 700 }}>
                      {stat.reg}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#b91c1c', fontWeight: 700 }}>
                      {stat.nR}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: rate >= 60 ? '#dcfce7' : '#fee2e2',
                          color: rate >= 60 ? '#15803d' : '#991b1b',
                        }}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b' }}>
                      {rate >= 60 ? '返診良好' : '需加強電訪關懷'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Section 2: Diagnosis Code Rankings Table */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            borderLeft: '4px solid #dc2626',
            paddingLeft: '10px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#991b1b' }}>
            二、診斷代碼（ICD-10 Code）統計與排名分析
          </h2>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#fef2f2', borderBottom: '2px solid #fecaca' }}>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#991b1b', width: '70px' }}>名次</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#991b1b', width: '120px' }}>診斷代碼</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#991b1b', textAlign: 'center', width: '90px' }}>
                人數
              </th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#991b1b', textAlign: 'center', width: '90px' }}>
                佔比
              </th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#991b1b' }}>個案主要未返診原因明細</th>
            </tr>
          </thead>
          <tbody>
            {sortedDiags.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '14px', textAlign: 'center', color: '#94a3b8' }}>
                  尚無診斷代碼資料
                </td>
              </tr>
            ) : (
              sortedDiags.map((code, index) => {
                const count = diagCounts[code].total;
                const totalItems = reasonDiagList.length || 1;
                const pct = Math.round((count / totalItems) * 100);
                const reasonsList = diagCounts[code].items.map((it) => it.r);
                const distinctReasons = Array.from(new Set(reasonsList));

                return (
                  <tr
                    key={code}
                    style={{
                      borderBottom: '1px solid #fee2e2',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fffafb',
                    }}
                  >
                    <td style={{ padding: '8px 12px', fontWeight: 800, color: '#b91c1c' }}>
                      第 {index + 1} 名
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 800, color: '#1e293b' }}>
                      {code}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>
                      {count} 人
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#64748b' }}>
                      {pct}%
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '11px', color: '#475569' }}>
                      {distinctReasons.join('、 ')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Section 3: Reason Analysis Rankings Table */}
      <div style={{ marginBottom: '26px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            borderLeft: '4px solid #d97706',
            paddingLeft: '10px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#92400e' }}>
            三、未規則返診主要原因分析排名
          </h2>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#fffbeb', borderBottom: '2px solid #fde68a' }}>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#92400e', width: '70px' }}>名次</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#92400e' }}>未規則返診原因項目</th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#92400e', textAlign: 'center', width: '90px' }}>
                人數
              </th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#92400e', textAlign: 'center', width: '90px' }}>
                佔比
              </th>
              <th style={{ padding: '8px 12px', fontWeight: 800, color: '#92400e' }}>分佈診斷代碼</th>
            </tr>
          </thead>
          <tbody>
            {sortedReasons.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '14px', textAlign: 'center', color: '#94a3b8' }}>
                  尚無未返診原因項目
                </td>
              </tr>
            ) : (
              sortedReasons.map((reason, index) => {
                const count = reasonCounts[reason].total;
                const totalItems = reasonDiagList.length || 1;
                const pct = Math.round((count / totalItems) * 100);
                const diagsList = reasonCounts[reason].items.map((it) => it.d);
                const distinctDiags = Array.from(new Set(diagsList));

                return (
                  <tr
                    key={reason}
                    style={{
                      borderBottom: '1px solid #fef3c7',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fffdf7',
                    }}
                  >
                    <td style={{ padding: '8px 12px', fontWeight: 800, color: '#b45309' }}>
                      第 {index + 1} 名
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1e293b' }}>
                      {reason}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#b45309' }}>
                      {count} 人
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#64748b' }}>
                      {pct}%
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: '11px', color: '#475569' }}>
                      {distinctDiags.map((d) => `代碼 ${d}`).join('、 ')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Signature & Note Footer */}
      <div
        style={{
          borderTop: '2px dashed #cbd5e1',
          paddingTop: '16px',
          marginTop: 'auto',
          fontSize: '11px',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div>※ 本報表由「耀西蘑菇島・初診未規則返診原因分析系統」自動計算生成。</div>
          <div>※ 數據僅供醫療個案管理、臨床品質改善及追蹤關懷之參考用途。</div>
        </div>

        <div style={{ display: 'flex', gap: '30px' }}>
          <div>
            製表人簽章：__________________
          </div>
          <div>
            單位主管審核：__________________
          </div>
        </div>
      </div>
    </div>
  );
};

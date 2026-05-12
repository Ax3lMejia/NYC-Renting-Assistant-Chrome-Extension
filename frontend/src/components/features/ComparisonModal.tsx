import React from 'react';
import { Bookmark } from '../../types/api';
import { calculateBuildingGrade } from '../../utils/buildingGrade';
import { pickComparisonWinner, getWorstIndex } from '../../utils/comparisonHelpers';

interface ComparisonModalProps {
  bookmarks: Bookmark[];
  onClose: () => void;
}

interface Row {
  label: string;
  getValue: (b: Bookmark) => number | null;
  higherIsBetter: boolean;
  winnerLabel: string;
  format?: (v: number) => string;
  accentRow?: boolean;
}

const ROWS: Row[] = [
  {
    label: '💰 Listed Rent',
    getValue: b => b.listed_price,
    higherIsBetter: false,
    winnerLabel: 'lower',
    format: v => `$${v.toLocaleString()}`,
    accentRow: true,
  },
  {
    label: 'HPD Complaints',
    getValue: b => b.building_data?.complaints ?? null,
    higherIsBetter: false,
    winnerLabel: 'fewer',
  },
  {
    label: 'HPD Violations',
    getValue: b => b.building_data?.violations ?? null,
    higherIsBetter: false,
    winnerLabel: 'fewer',
  },
  {
    label: 'Open ECB Violations',
    getValue: b => b.building_data?.openEcbViolations ?? null,
    higherIsBetter: false,
    winnerLabel: 'fewer',
  },
  {
    label: 'Bedbug Reports',
    getValue: b => b.building_data?.bedbugReports ?? null,
    higherIsBetter: false,
    winnerLabel: 'fewer',
  },
  {
    label: 'Rodent Failures',
    getValue: b => b.building_data?.rodentFailures ?? null,
    higherIsBetter: false,
    winnerLabel: 'fewer',
  },
  {
    label: 'Safety Score',
    getValue: b => b.building_data?.safetyScore ?? null,
    higherIsBetter: true,
    winnerLabel: 'higher',
    format: v => `${v} / 100`,
  },
];

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: '#4D6B47', text: '#fff' },
  B: { bg: '#4D6B47', text: '#fff' },
  C: { bg: '#F5C747', text: '#14110D' },
  D: { bg: '#E84A1F', text: '#fff' },
  F: { bg: '#E84A1F', text: '#fff' },
};

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ bookmarks, onClose }) => {
  const grades = bookmarks.map(b => calculateBuildingGrade(b.building_data));

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(92,61,46,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#F4EDDD', borderRadius: 16, width: '100%', maxWidth: 780,
        maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(92,61,46,.35)',
      }}>
        <div style={{
          background: '#C49F6D', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontSize: 18, fontStyle: 'italic', color: '#14110D',
          }}>
            Comparing {bookmarks.length} listing{bookmarks.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(20,17,13,.15)', border: 'none',
              cursor: 'pointer', fontSize: 14, color: '#14110D',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Geist, system-ui, sans-serif',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{
                  width: '28%', padding: '14px 16px', textAlign: 'left',
                  position: 'sticky', top: 0, zIndex: 5, background: '#F4EDDD',
                }} />
                {bookmarks.map((b, i) => {
                  const grade = grades[i];
                  const gc = grade ? (GRADE_COLORS[grade.grade] ?? GRADE_COLORS.F) : null;
                  return (
                    <th key={b.id} style={{
                      padding: '14px 16px', textAlign: 'center',
                      borderLeft: '1px solid rgba(20,17,13,.08)',
                      background: '#fff',
                      position: 'sticky', top: 0, zIndex: 5,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#14110D' }}>
                        {b.address.split(',')[0]}
                      </div>
                      <div style={{ fontSize: 10, color: '#8a8377', marginTop: 1 }}>
                        {b.address.split(',').slice(1).join(',').trim()}
                      </div>
                      {gc && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 36, height: 36, borderRadius: 10, margin: '6px auto 0',
                          background: gc.bg, color: gc.text,
                          fontFamily: 'Instrument Serif, Georgia, serif',
                          fontSize: 22, fontStyle: 'italic', fontWeight: 700,
                        }}>
                          {grade!.grade}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, rowIdx) => {
                const values = bookmarks.map(b => row.getValue(b));
                const winnerIdx = pickComparisonWinner(values, row.higherIsBetter);
                const worstIdx = getWorstIndex(values, row.higherIsBetter);
                const isEven = rowIdx % 2 === 1;

                return (
                  <tr key={row.label}>
                    <td style={{
                      padding: '11px 16px', fontSize: 11, color: '#8a8377',
                      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em',
                      borderTop: '1px solid rgba(20,17,13,.07)',
                      background: row.accentRow
                        ? 'rgba(77,107,71,.07)'
                        : isEven ? 'rgba(20,17,13,.025)' : undefined,
                    }}>
                      {row.label}
                    </td>
                    {bookmarks.map((b, colIdx) => {
                      const val = values[colIdx];
                      const isWinner = winnerIdx === colIdx;
                      const isWorst = worstIdx === colIdx;
                      const color = isWinner ? '#4D6B47' : isWorst ? '#E84A1F' : '#14110D';
                      const displayed = val === null
                        ? '—'
                        : row.format ? row.format(val) : String(val);
                      const winnerTag = isWinner && val !== 0 ? row.winnerLabel : null;

                      return (
                        <td key={b.id} style={{
                          padding: '11px 16px', textAlign: 'center',
                          borderLeft: '1px solid rgba(20,17,13,.08)',
                          borderTop: '1px solid rgba(20,17,13,.07)',
                          background: row.accentRow
                            ? 'rgba(77,107,71,.07)'
                            : isEven ? 'rgba(255,255,255,.55)' : '#fff',
                        }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color }}>
                            {displayed}
                          </div>
                          {winnerTag && (
                            <div style={{
                              fontSize: 10, color: '#4D6B47',
                              fontWeight: 600, marginTop: 2,
                            }}>
                              ✓ {winnerTag}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '12px 20px', borderTop: '1px solid rgba(20,17,13,.08)',
          display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0,
          background: '#F4EDDD',
        }}>
          <button
            disabled
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'not-allowed', border: '1px solid rgba(20,17,13,.15)',
              background: '#fff', color: '#8a8377', opacity: .6,
              fontFamily: 'Geist, system-ui, sans-serif',
            }}
          >
            Export CSV
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: 'none',
              background: '#5C3D2E', color: '#F4EDDD',
              fontFamily: 'Geist, system-ui, sans-serif',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

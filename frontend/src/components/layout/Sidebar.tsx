import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';
import { isExtensionPopup } from '../../utils/context';
import { GradeResult, getGradeBlurb, getGradeQuote } from '../../utils/buildingGrade';
import { Mascot } from '../ui/Mascot';

interface SidebarProps {
  showSettings: boolean;
  onToggleSettings: () => void;
  address: string | null;
  isLoading: boolean;
  grade: GradeResult | null;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  showSettings,
  onToggleSettings,
  address,
  isLoading,
  grade,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isPopup = isExtensionPopup();

  const g = grade?.grade ?? null;
  const isGood = g === 'A' || g === 'B';
  const isMid = g === 'C';

  const gradeCardBg = isGood ? '#4D6B47' : isMid ? '#F5C747' : '#E84A1F';
  const gradeCardShadow = isGood ? '0 6px 0 #3a5236' : isMid ? '0 6px 0 #c89e23' : '0 6px 0 #b53718';
  const gradeCardText = '#fff';

  const shortAddress = address ? address.split(',')[0] : null;
  const loaded = !isLoading && grade !== null;

  return (
    <>
      <div className={cn(
        "z-[9999] w-full flex flex-col",
        !isPopup && "fixed top-4 right-4 bottom-4 w-90 rounded-2xl shadow-floating overflow-hidden border border-black/8",
        !isPopup && (isOpen
          ? "opacity-100 translate-x-0 scale-100 transition-[transform,opacity] duration-300 ease-out"
          : "opacity-0 translate-x-full scale-95 pointer-events-none transition-[transform,opacity] duration-200 ease-in"),
        isPopup && "min-h-screen"
      )} style={{ background: '#C49F6D', fontFamily: 'Geist, system-ui, sans-serif', color: '#14110D' }}>

        {/* === HEADER (warm tan) === */}
        <div className="shrink-0 px-4 pt-3.5 pb-3" style={{ background: '#C49F6D' }}>

          {/* Top bar: RENT ASSISTANT label + Settings + X */}
          <div className="flex items-center justify-between mb-2">
            <span style={{
              fontFamily: 'Geist Mono, ui-monospace, monospace',
              fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65,
              color: '#14110D'
            }}>
              RENT ASSISTANT
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleSettings}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  showSettings ? "bg-black/20 text-white" : "text-black/50 hover:text-black/80 hover:bg-black/10"
                )}
                aria-label="Toggle settings"
                aria-pressed={showSettings}
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
              {!isPopup && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-black/50 hover:text-black/80 hover:bg-black/10 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mascot + quote row */}
          <div className="flex items-center gap-3 mb-3">
            {g && <Mascot grade={g} loaded={loaded} size={56} />}
            <div className="flex-1 min-w-0">
              {shortAddress && (
                <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.3, color: '#14110D' }}>
                  {shortAddress} says…
                </div>
              )}
              <div style={{
                fontFamily: 'Instrument Serif, Georgia, serif',
                fontSize: 18, lineHeight: 1.1, fontStyle: 'italic', marginTop: 2, color: '#14110D'
              }}>
                {isLoading
                  ? 'Checking the building…'
                  : g ? getGradeQuote(g) : 'Looking up your address…'}
              </div>
            </div>
          </div>

          {/* Grade card */}
          {isLoading ? (
            <div className="rounded-xl h-16 animate-pulse" style={{ background: 'rgba(20,17,13,0.15)' }} />
          ) : g ? (
            <div style={{
              background: '#fff',
              borderRadius: 14,
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 12,
              transform: loaded ? 'translateY(0)' : 'translateY(8px)',
              opacity: loaded ? 1 : 0,
              transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.15s'
            }}>
              {/* Grade letter box */}
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: gradeCardBg,
                color: gradeCardText,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Instrument Serif, Georgia, serif',
                fontSize: 38, fontWeight: 400, lineHeight: 1, fontStyle: 'italic',
                boxShadow: gradeCardShadow,
              }}>
                {g}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#14110D', lineHeight: 1.2 }}>
                  {grade!.label} Condition
                </div>
                <div style={{ fontSize: 11, color: '#3A3530', lineHeight: 1.4, marginTop: 2 }}>
                  {getGradeBlurb(g)}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* === BODY (cream background) === */}
        <div
          className={cn("flex-1 overflow-y-auto hide-scroll p-2 space-y-1.5", isPopup && "pb-20")}
          style={{ background: '#F4EDDD' }}
        >
          {children}
        </div>

        {/* === FOOTER === */}
        <div style={{
          padding: '6px 16px', borderTop: '1px solid rgba(20,17,13,0.10)',
          background: '#FFFFFF',
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 9, letterSpacing: '0.14em', color: '#8a8377',
          textAlign: 'center', textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          NYC Open Data · HPD · DOB · 311
        </div>
      </div>
    </>
  );
};

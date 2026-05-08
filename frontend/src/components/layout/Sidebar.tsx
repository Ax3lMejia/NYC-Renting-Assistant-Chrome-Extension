import React, { useState } from 'react';
import { X, Settings, PanelRightClose, MapPin, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { isExtensionPopup } from '../../utils/context';
import { GradeResult } from '../../utils/buildingGrade';

const GRADE_STYLES: Record<string, { strip: string; letter: string; sub: string; divider: string }> = {
  A: { strip: 'bg-green-900/25 border-green-700/35', letter: 'text-green-300', sub: 'text-green-500/80', divider: 'bg-green-700/35' },
  B: { strip: 'bg-teal-900/25 border-teal-700/35', letter: 'text-teal-300', sub: 'text-teal-500/80', divider: 'bg-teal-700/35' },
  C: { strip: 'bg-amber-900/25 border-amber-700/35', letter: 'text-amber-300', sub: 'text-amber-500/80', divider: 'bg-amber-700/35' },
  D: { strip: 'bg-orange-900/25 border-orange-700/35', letter: 'text-orange-300', sub: 'text-orange-500/80', divider: 'bg-orange-700/35' },
  F: { strip: 'bg-red-900/25 border-red-700/35', letter: 'text-red-300', sub: 'text-red-500/80', divider: 'bg-red-700/35' },
};

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

  return (
    <>
      <div
        className={cn(
          "z-[9999] w-full flex flex-col",
          !isPopup && "fixed top-4 right-4 bottom-4 w-90 bg-white/90 backdrop-blur-xl rounded-2xl shadow-floating border border-primary-200/50 origin-right overflow-hidden",
          !isPopup && (isOpen
            ? "opacity-100 translate-x-0 scale-100 transition-[transform,opacity] duration-300 ease-out"
            : "opacity-0 translate-x-full scale-95 pointer-events-none transition-[transform,opacity] duration-200 ease-in"),
          isPopup && "min-h-screen"
        )}
      >
        {/* Dark header */}
        <div className="bg-primary-950 px-4 pt-4 pb-3 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PanelRightClose className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-serif font-semibold text-white tracking-wide">
                Renting Assistant
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={onToggleSettings}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  showSettings
                    ? "bg-teal-700 text-teal-100"
                    : "text-primary-500 hover:text-primary-200 hover:bg-primary-800"
                )}
                aria-label="Toggle settings"
                aria-pressed={showSettings}
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
              {!isPopup && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-primary-500 hover:text-primary-200 hover:bg-primary-800 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Address strip */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-primary-900/50 rounded-lg border border-primary-800/40">
            <MapPin className="h-3 w-3 text-teal-400 shrink-0" />
            {isLoading ? (
              <div className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 text-primary-500 animate-spin" />
                <span className="text-[11px] text-primary-500">Detecting address...</span>
              </div>
            ) : (
              <span className="text-[11px] text-primary-200 leading-tight font-medium truncate">
                {address || 'No listing detected'}
              </span>
            )}
          </div>

          {/* Building grade strip */}
          {isLoading ? (
            <div className="mt-2 h-10 bg-primary-800/40 rounded-lg animate-pulse" />
          ) : grade ? (
            <div className={cn(
              'mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg border',
              GRADE_STYLES[grade.grade].strip
            )}>
              <span className={cn('text-2xl font-bold font-serif leading-none tabular-nums', GRADE_STYLES[grade.grade].letter)}>
                {grade.grade}
              </span>
              <div className={cn('w-px h-6 shrink-0', GRADE_STYLES[grade.grade].divider)} />
              <div className="flex flex-col min-w-0">
                <span className={cn('text-[11px] font-semibold leading-tight', GRADE_STYLES[grade.grade].letter)}>
                  {grade.label} Condition
                </span>
                <span className={cn('text-[9px] leading-tight mt-0.5', GRADE_STYLES[grade.grade].sub)}>
                  Building Safety Score
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Scroll body */}
        <div
          className={cn(
            "flex-1 overflow-y-auto custom-scrollbar bg-transparent p-2 space-y-1.5",
            isPopup && "pb-20"
          )}
        >
          {children}
        </div>

        {/* Minimal footer */}
        <div className="shrink-0 py-1.5 px-4 bg-white/80 border-t border-primary-50">
          <p className="text-[9px] text-primary-300 text-center tracking-wide">
            NYC Open Data · HPD · DOB · 311
          </p>
        </div>
      </div>
    </>
  );
};

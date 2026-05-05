import React from 'react';
import { ChevronRight, X, Settings, PanelRightClose, MapPin, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { isExtensionPopup } from '../../utils/context';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  address: string | null;
  isLoading: boolean;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  showSettings,
  onToggleSettings,
  address,
  isLoading,
  children,
}) => {
  const isPopup = isExtensionPopup();

  return (
    <>
      {!isOpen && !isPopup && (
        <button
          onClick={onClose}
          className="fixed top-24 right-0 z-[9999] bg-primary-950 text-white p-3 rounded-l-2xl shadow-floating hover:bg-primary-800 transition-colors active:scale-95 group border-y border-l border-primary-800"
        >
          <div className="flex items-center space-x-1.5">
            <ChevronRight className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
            <span className="text-[11px] font-bold pr-0.5 tracking-widest uppercase">NYC RA</span>
          </div>
        </button>
      )}

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
                  onClick={onClose}
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

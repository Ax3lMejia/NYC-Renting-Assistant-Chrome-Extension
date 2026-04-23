import React from 'react';
import { X, ChevronRight, PanelRightClose } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Typography';
import { isExtensionPopup } from '../../utils/context';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
  const isPopup = isExtensionPopup();

  return (
    <>
      {!isOpen && !isPopup && (
        <button
          onClick={onClose}
          className="fixed top-24 right-0 z-[9999] bg-primary-900 text-white p-3 rounded-l-2xl shadow-floating hover:bg-primary-800 transition-all active:scale-95 group border-y border-l border-primary-700"
        >
          <div className="flex items-center space-x-2">
            <ChevronRight className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif font-bold text-sm pr-1">NYC RA</span>
          </div>
        </button>
      )}

      <div
        className={cn(
          "z-[9999] w-full flex flex-col transition-all duration-300 ease-in-out",
          !isPopup && "fixed top-4 right-4 bottom-4 w-85 bg-white/95 backdrop-blur-md rounded-3xl shadow-floating border border-primary-100 origin-right",
          !isPopup && (isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95 pointer-events-none"),
          isPopup && "min-h-screen bg-white"
        )}
      >

        <div className="p-6 flex items-center justify-between border-b border-primary-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-950 rounded-xl shadow-elegant">
              <PanelRightClose className="h-5 w-5 text-white" />
            </div>
            <Heading level={3} className="text-primary-950">Renting Assistant</Heading>
          </div>
          {!isPopup && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-primary-100"
            >
              <X className="h-5 w-5 text-primary-500" />
            </Button>
          )}
        </div>

        <div className={cn(
          "flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6",
          isPopup && "pb-24"
        )}>
          {children}
        </div>

        <div className="p-6 border-t border-primary-50 bg-primary-50/30">
          <p className="text-[10px] text-primary-400 leading-relaxed italic text-center">
            Aggregating NYC Open Data, HPD & 311 records.<br />
            Data is provided for informational purposes only.
          </p>
        </div>
      </div>
    </>
  );
};

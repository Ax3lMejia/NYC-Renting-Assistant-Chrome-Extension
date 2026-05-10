import React, { useState } from 'react';

interface SectionCardProps {
  emoji: string;
  subjectName: string;
  headline: string;
  severity: 'low' | 'med' | 'high';
  isLoading?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const SEV_GRADE = { low: 'A', med: 'C', high: 'F' } as const;
const SEV_BG = { low: '#4D6B47', med: '#F5C747', high: '#E84A1F' };
const SEV_SHADOW = { low: '0 3px 0 #3a5236', med: '0 3px 0 #9c7a1c', high: '0 3px 0 #b53718' };
const SEV_TEXT: Record<string, string> = { low: '#fff', med: '#14110D', high: '#fff' };

export const SectionCard: React.FC<SectionCardProps> = ({
  emoji,
  subjectName,
  headline,
  severity,
  isLoading = false,
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const gradeLabel = SEV_GRADE[severity];
  const gradeBg = SEV_BG[severity];
  const gradeShadow = SEV_SHADOW[severity];
  const gradeText = SEV_TEXT[severity];

  return (
    <div style={{
      marginBottom: 6,
      background: '#FFFFFF',
      borderRadius: 14,
      border: '1px solid rgba(20,17,13,0.10)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        aria-expanded={open}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: '#14110D' }}>
              {subjectName}
            </div>
            {isLoading ? (
              <div style={{ height: 10, width: 120, background: 'rgba(20,17,13,0.08)', borderRadius: 4, marginTop: 4 }} />
            ) : (
              <div style={{ fontSize: 11, color: '#3A3530', marginTop: 2, lineHeight: 1.3 }}>
                {headline}
              </div>
            )}
          </div>
          {isLoading ? (
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(20,17,13,0.08)' }} />
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: gradeBg, color: gradeText,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Instrument Serif, Georgia, serif',
              fontSize: 20, fontStyle: 'italic', lineHeight: 1,
              boxShadow: gradeShadow,
            }}>
              {gradeLabel}
            </div>
          )}
        </div>
      </button>

      <div style={{
        maxHeight: open ? 480 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s ease',
      }}>
        <div style={{
          padding: '0 14px 12px',
          borderTop: '1px solid rgba(20,17,13,0.10)',
          paddingTop: 10,
        }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ height: 32, background: 'rgba(20,17,13,0.06)', borderRadius: 8 }} />
              <div style={{ height: 32, background: 'rgba(20,17,13,0.06)', borderRadius: 8 }} />
            </div>
          ) : children}
        </div>
      </div>
    </div>
  );
};

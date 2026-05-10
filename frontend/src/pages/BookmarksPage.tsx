import React, { useState } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBookmarks } from '../hooks/useBookmarks';
import { AuthPanel } from '../components/features/AuthPanel';
import { calculateBuildingGrade } from '../utils/buildingGrade';
import { Bookmark, BuildingData } from '../types/api';

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#F4EDDD', fontFamily: 'Geist, system-ui, sans-serif', color: '#14110D' }}>
    <div style={{ background: '#C49F6D', padding: '14px 24px' }}>
      <span style={{
        fontFamily: 'Geist Mono, monospace',
        fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65,
      }}>
        NYC RENTING ASSISTANT
      </span>
    </div>
    {children}
  </div>
);

const StatBadge: React.FC<{ label: string; value: number | string; warn?: boolean }> = ({ label, value, warn }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: warn ? '#FFF3F0' : 'rgba(20,17,13,0.06)', borderRadius: 8, padding: '5px 10px',
  }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: warn ? '#E84A1F' : '#14110D' }}>{value}</span>
    <span style={{ fontSize: 9, color: '#8a8377', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 1 }}>{label}</span>
  </div>
);

const BookmarkCard: React.FC<{
  bookmark: Bookmark;
  onRemove: () => void;
  onUpdateNotes: (notes: string) => void;
}> = ({ bookmark, onRemove, onUpdateNotes }) => {
  const grade = calculateBuildingGrade(bookmark.building_data);
  const gradeColor = !grade ? '#8a8377'
    : grade.grade === 'A' || grade.grade === 'B' ? '#4D6B47'
    : grade.grade === 'C' ? '#F5C747'
    : '#E84A1F';
  const gradeTextColor = grade?.grade === 'C' ? '#14110D' : '#fff';

  const [notes, setNotes] = useState(bookmark.notes ?? '');
  const [editing, setEditing] = useState(false);

  const handleBlur = () => {
    setEditing(false);
    if (notes !== (bookmark.notes ?? '')) onUpdateNotes(notes);
  };

  const bd: BuildingData | null = bookmark.building_data;

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      border: '1px solid rgba(20,17,13,0.10)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ background: '#C49F6D', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {grade && (
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: gradeColor, color: gradeTextColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 28, fontStyle: 'italic',
          }}>
            {grade.grade}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#14110D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {bookmark.address.split(',')[0]}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(20,17,13,0.55)', marginTop: 2 }}>
            {bookmark.address.split(',').slice(1).join(',').trim()}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(20,17,13,0.4)', marginTop: 2 }}>
            Saved {new Date(bookmark.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(20,17,13,0.08)' }}>
        {bd ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {bd.complaints !== null && <StatBadge label="HPD" value={bd.complaints} warn={bd.complaints > 15} />}
            {bd.violations !== null && <StatBadge label="Violations" value={bd.violations} warn={bd.violations > 8} />}
            {bd.bedbugReports !== null && <StatBadge label="Bedbugs" value={bd.bedbugReports} warn={bd.bedbugReports > 0} />}
            {bd.safetyScore !== null && <StatBadge label="Safety" value={`${bd.safetyScore}/100`} />}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: '#8a8377' }}>No building data saved</div>
        )}
      </div>

      <div style={{ padding: '8px 14px', flex: 1 }}>
        <div style={{ fontSize: 10, color: '#8a8377', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Notes</div>
        {editing ? (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            placeholder="Add your notes…"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'none',
              border: '1px solid rgba(20,17,13,0.20)', borderRadius: 8,
              padding: '6px 8px', fontSize: 12, color: '#14110D',
              background: '#F4EDDD', fontFamily: 'Geist, system-ui, sans-serif', outline: 'none',
            }}
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            style={{
              fontSize: 12, color: notes ? '#14110D' : '#8a8377',
              cursor: 'text', lineHeight: 1.5, minHeight: 28,
            }}
          >
            {notes || 'Click to add notes…'}
          </div>
        )}
      </div>

      <div style={{ padding: '0 14px 12px', display: 'flex', gap: 8 }}>
        <a
          href={bookmark.listing_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '8px 0', borderRadius: 8, background: '#14110D', color: '#F4EDDD',
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
            fontFamily: 'Geist, system-ui, sans-serif',
          }}
        >
          <ExternalLink size={12} /> View Listing
        </a>
        <button
          onClick={onRemove}
          title="Remove bookmark"
          style={{
            width: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, border: '1px solid rgba(232,74,31,0.30)', background: '#fff',
            color: '#E84A1F', cursor: 'pointer',
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export const BookmarksPage: React.FC = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { bookmarks, isLoading, removeBookmark, updateNotes } = useBookmarks(!authLoading && !!user);

  if (authLoading) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: 60, color: '#8a8377', fontSize: 13 }}>Loading…</div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div style={{ maxWidth: 380, margin: '48px auto', padding: '0 20px' }}>
          <div style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontSize: 26, fontStyle: 'italic', textAlign: 'center',
            marginBottom: 20, color: '#14110D',
          }}>
            Sign in to view bookmarks
          </div>
          <AuthPanel />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{
              fontFamily: 'Instrument Serif, Georgia, serif',
              fontSize: 30, fontStyle: 'italic', color: '#14110D',
            }}>
              My Bookmarks
            </div>
            <div style={{ fontSize: 12, color: '#8a8377', marginTop: 3 }}>
              {user.email} · {bookmarks.length} saved
            </div>
          </div>
          <button
            onClick={signOut}
            style={{
              fontSize: 12, color: '#8a8377',
              background: 'none', border: '1px solid rgba(20,17,13,0.15)',
              borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
              fontFamily: 'Geist, system-ui, sans-serif',
            }}
          >
            Sign out
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 220, background: 'rgba(20,17,13,0.06)', borderRadius: 14 }} />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#8a8377', fontSize: 13, lineHeight: 1.6 }}>
            No bookmarks yet.<br />
            Visit a listing on Zillow, StreetEasy, or Apartments.com and click Save.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {bookmarks.map(b => (
              <BookmarkCard
                key={b.id}
                bookmark={b}
                onRemove={() => removeBookmark(b.id)}
                onUpdateNotes={(notes) => updateNotes(b.id, notes)}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

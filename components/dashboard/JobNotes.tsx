'use client';
import { useState } from 'react';

interface JobNotesProps {
  notes: string;
}

export default function JobNotes({ notes }: JobNotesProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const isLong = notes.length > 100;

  return (
    <div className="mb-3">
      {expanded ? (
        <div className="max-h-50 overflow-y-auto text-xs text-text-muted leading-[1.6] pr-1">
          {notes}
        </div>
      ) : (
        <p className="text-xs text-text-muted leading-[1.6] line-clamp-2">
          {notes}
        </p>
      )}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-brand font-medium cursor-pointer bg-transparent border-none mt-1 hover:opacity-80 transition-opacity p-0"
        >
          {expanded ? 'Show less ↑' : 'Show more ↓'}
        </button>
      )}
    </div>
  );
}



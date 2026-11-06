import React from 'react';

// One optical size, rounded joins and two inks across all six project symbols.
export function ProjectSymbol({kind}){
 const shapes={
  character:<><path fill="var(--symbol-light)" d="M12 20 10 8l13 7a22 22 0 0 1 18 0l13-7-2 12a22 22 0 1 1-40 0Z"/><path d="M12 20 10 8l13 7a22 22 0 0 1 18 0l13-7-2 12"/><ellipse cx="24" cy="30" rx="2.5" ry="3.5" fill="currentColor" stroke="none"/><ellipse cx="40" cy="30" rx="2.5" ry="3.5" fill="currentColor" stroke="none"/><path d="M25 40q7 7 14 0"/></>,
  comic:<><rect x="9" y="12" width="46" height="40" rx="5" fill="var(--symbol-light)"/><path d="M9 35h46M32 12v23"/><path d="M17 21h8M17 26h4M39 21h8M17 43h20"/><path fill="white" d="M38 37h14v9h-6l-5 5v-5h-3Z"/></>,
  world:<><circle cx="44" cy="18" r="8" fill="var(--symbol-light)" stroke="none"/><path fill="var(--symbol-light)" d="m6 50 17-30 13 22 8-13 14 21Z"/><path fill="white" d="m17 31 6-11 7 12-7-3Z"/><path d="M8 54h48"/></>,
  motion:<><rect x="11" y="25" width="44" height="29" rx="5" fill="var(--symbol-light)"/><path fill="var(--symbol-light)" d="m9 16 41-8 3 11-42 8Z"/><path d="m20 14 7 9m7-12 7 9"/><path fill="currentColor" stroke="none" d="M29 33v14l12-7Z"/></>,
  stickers:<><path d="M15 14h36v36H15Z" fill="var(--symbol-light)" stroke="none" transform="rotate(12 33 32)"/><path d="M12 10h36v26L32 52H12Z" fill="var(--symbol-light)"/><path d="M32 52V36h16" fill="white"/><circle cx="23" cy="23" r="2" fill="currentColor" stroke="none"/><circle cx="36" cy="23" r="2" fill="currentColor" stroke="none"/><path d="M23 30q6 5 12 0"/></>,
  poster:<><rect x="13" y="7" width="38" height="50" rx="4" fill="var(--symbol-light)"/><path d="m32 15 3.5 7 7.5 1-5.5 5.5 1.3 7.5-6.8-3.5-6.8 3.5 1.3-7.5L21 23l7.5-1Z" fill="white"/><path d="M22 44h20M26 49h12"/></>
 };
 return <span className="make-symbol" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{shapes[kind]}</svg></span>
}

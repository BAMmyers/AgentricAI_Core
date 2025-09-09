import React from 'react';

const Panel: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-700 flex flex-col h-full shadow-2xl shadow-black/50 ${className}`}>
        {children}
    </div>
);

export default Panel;
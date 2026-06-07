const parseMarkdownBlocks = (markdown = '') => {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let codeBuffer = [];
  let inCode = false;

  lines.forEach((line) => {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        blocks.push({ type: 'code', content: codeBuffer.join('\n') });
        codeBuffer = [];
      }
      inCode = !inCode;
      return;
    }

    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    if (!line.trim()) {
      blocks.push({ type: 'space' });
      return;
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', content: line.replace(/^##\s+/, '') });
      return;
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.replace(/^###\s+/, '') });
      return;
    }

    if (/^\s*-\s+\[[ xX]\]\s+/.test(line)) {
      blocks.push({ type: 'check', content: line.replace(/^\s*-\s+\[[ xX]\]\s+/, '') });
      return;
    }

    if (/^\s*-\s+/.test(line)) {
      blocks.push({ type: 'li', content: line.replace(/^\s*-\s+/, '') });
      return;
    }

    blocks.push({ type: 'p', content: line });
  });

  if (codeBuffer.length > 0) {
    blocks.push({ type: 'code', content: codeBuffer.join('\n') });
  }

  return blocks;
};

const renderInline = (text) => {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`${part}-${index}`} className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-[#172033]">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-[#172033]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

function MarkdownReview({ content }) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-2 rounded-md bg-[#f5f7fb] p-4 text-sm leading-7 text-[#172033]">
      {blocks.map((block, index) => {
        if (block.type === 'space') return <div key={index} className="h-2" />;
        if (block.type === 'h2') return <h3 key={index} className="pt-1 text-base font-semibold text-[#172033]">{block.content}</h3>;
        if (block.type === 'h3') return <h4 key={index} className="pt-1 text-sm font-semibold text-[#172033]">{block.content}</h4>;
        if (block.type === 'li') return <div key={index} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1e5eff]" /><p>{renderInline(block.content)}</p></div>;
        if (block.type === 'check') return <div key={index} className="flex gap-2"><span className="mt-1 text-[#0f8a5f]">□</span><p>{renderInline(block.content)}</p></div>;
        if (block.type === 'code') return <pre key={index} className="overflow-auto rounded-md bg-[#172033] p-3 text-xs leading-5 text-white"><code>{block.content}</code></pre>;
        return <p key={index}>{renderInline(block.content)}</p>;
      })}
    </div>
  );
}

export function AiSuggestionPanel({ suggestion }) {
  return (
    <section className="panel p-5">
      <h2 className="text-base font-semibold text-[#172033]">AI Review</h2>
      <div className="mt-4">
        <MarkdownReview content={suggestion || 'No AI suggestion available yet.'} />
      </div>
    </section>
  );
}

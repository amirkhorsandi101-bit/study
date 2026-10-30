import React from 'react';

/**
 * نمایش امن متن مارک‌داون ساده (عنوان ###، **پررنگ**، فهرست، خط جداکننده).
 * عمداً HTML خام تولید نمی‌کند، پس برای خروجی مدل هوش مصنوعی امن است.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

export const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!list) return;
    const Tag = list.ordered ? 'ol' : 'ul';
    blocks.push(
      <Tag
        key={key}
        className={`space-y-2 pr-5 ${list.ordered ? 'list-decimal' : 'list-disc'} marker:text-amber-400`}
      >
        {list.items.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {renderInline(item, `${key}-${i}`)}
          </li>
        ))}
      </Tag>
    );
    list = null;
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    const key = `b${idx}`;

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);

    if (bullet || numbered) {
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flushList(`${key}-l`);
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      return;
    }

    flushList(`${key}-l`);

    if (!line) return;
    if (/^-{3,}$/.test(line)) {
      blocks.push(<hr key={key} className="border-slate-800" />);
    } else if (heading) {
      const level = heading[1].length;
      blocks.push(
        <h4
          key={key}
          className={`font-bold text-white ${level <= 3 ? 'text-base pt-2' : 'text-sm text-amber-300'}`}
        >
          {renderInline(heading[2], key)}
        </h4>
      );
    } else {
      blocks.push(
        <p key={key} className="leading-relaxed">
          {renderInline(line, key)}
        </p>
      );
    }
  });
  flushList('end');

  return <div className="space-y-3">{blocks}</div>;
};

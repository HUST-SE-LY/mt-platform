import React, { useState } from 'react';
import { Tooltip } from '@douyinfe/semi-ui';
import { copyText } from '@/utils/copyText';
import './index.css';
interface Term {
  term: string;
  start: number;
  end: number;
  target: string;
  description: string;
  termbase_id: string;
}

interface SegmentProps {
  sourceText: string;
  terms: Term[];
}

const SegmentView: React.FC<SegmentProps> = ({ sourceText, terms }) => {
  // 将文本分割成带有术语标记的片段
  const renderText = () => {
    if (!terms || terms.length === 0) {
      return sourceText;
    }

    const result: React.ReactNode[] = []; // 明确指定数组类型
    let lastIndex = 0;

    terms.forEach((term, index) => {
      // 添加术语前的普通文本
      if (term.start > lastIndex) {
        result.push(
          <span key={`text-${index}`}>
            {sourceText.substring(lastIndex, term.start)}
          </span>
        );
      }

      // 添加高亮的术语
      result.push(
        <Tooltip
          key={`term-${index}`}
          content={
            <div className="term-tooltip-content">
              <div
                className="term-tooltip-row clickable"
                onClick={() => copyText(term.target)}
              >
                译文：{term.target}
              </div>
              {term.description && (
                <div className="term-tooltip-row">说明：{term.description}</div>
              )}
            </div>
          }
          position="top"
        >
          <span className="highlighted-term">
            {sourceText.substring(term.start, term.end)}
          </span>
        </Tooltip>
      );

      lastIndex = term.end;
    });

    // 添加最后一个术语后的文本
    if (lastIndex < sourceText.length) {
      result.push(
        <span key="text-last">{sourceText.substring(lastIndex)}</span>
      );
    }

    return result;
  };

  return <div className="segment-source">{renderText()}</div>;
};

export default SegmentView;

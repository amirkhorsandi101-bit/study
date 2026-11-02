/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Persian & Multi-Language Fuzzy Search Engine:
 * Implements real-time typo-tolerant, token-based, and subsequence fuzzy matching
 * specifically optimized for Iranian curriculum textbooks, topics, and chapters.
 */

import React from 'react';

/**
 * Normalizes Persian and Arabic text:
 * - Unifies Yeh (ي / ى / ئ -> ی)
 * - Unifies Kaf (ك -> ک)
 * - Normalizes Alef forms (آ, أ, إ, ٱ -> ا)
 * - Normalizes Heh (ۀ -> ه)
 * - Removes Arabic diacritics (Harakat / Tashdeed / Tanween)
 * - Standardizes Zero-Width Non-Joiner (\u200C) and spacing
 */
export function normalizePersian(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove diacritics
    .replace(/[\u200C\u200B\u200E\u200F]/g, ' ') // Replace zero-width non-joiner with space
    .replace(/[يىئ]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[آأإٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[\s\-_]+/g, ' ')
    .trim();
}

/**
 * Strips all spaces and punctuation for compressed character subsequence testing
 */
export function compressPersian(text: string): string {
  return normalizePersian(text).replace(/\s+/g, '');
}

/**
 * Calculate Levenshtein Distance between two normalized short tokens
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export interface FuzzyScoreResult {
  isMatch: boolean;
  score: number; // 0 to 1, where 1 is highest relevance
}

/**
 * Computes a fuzzy match score between search query and target text.
 * High scores are given for:
 * 1. Exact phrase containment
 * 2. All tokens present (token-based fuzzy search)
 * 3. Typo-tolerant token match (Levenshtein distance <= 1 for words >= 4 chars, <= 2 for words >= 7 chars)
 * 4. Subsequence character matching
 */
export function fuzzyMatchScore(query: string, targetText: string, threshold = 0.45): FuzzyScoreResult {
  const normQuery = normalizePersian(query);
  const normTarget = normalizePersian(targetText);

  if (!normQuery) {
    return { isMatch: true, score: 1 };
  }
  if (!normTarget) {
    return { isMatch: false, score: 0 };
  }

  // 1. Direct exact substring match
  if (normTarget.includes(normQuery)) {
    const ratio = normQuery.length / normTarget.length;
    const score = 0.85 + Math.min(0.15, ratio * 0.15);
    return { isMatch: true, score };
  }

  // Also test compressed without spaces (e.g. "همانندسازي" matching "همانند سازی")
  const compQuery = compressPersian(query);
  const compTarget = compressPersian(targetText);
  if (compTarget.includes(compQuery)) {
    return { isMatch: true, score: 0.82 };
  }

  // 2. Multi-token fuzzy match:
  // Split query into distinct tokens (e.g., "زیست" "قلب" "دوازدهم")
  const queryTokens = normQuery.split(' ').filter(t => t.length > 0);
  const targetTokens = normTarget.split(' ').filter(t => t.length > 0);

  if (queryTokens.length > 0) {
    let matchedTokenCount = 0;
    let tokenScoreAcc = 0;

    for (const qToken of queryTokens) {
      let bestTokenScore = 0;

      for (const tToken of targetTokens) {
        // Direct word equality or prefix
        if (tToken === qToken) {
          bestTokenScore = Math.max(bestTokenScore, 1.0);
          break;
        }
        if (tToken.startsWith(qToken) || tToken.includes(qToken)) {
          bestTokenScore = Math.max(bestTokenScore, 0.85);
          continue;
        }

        // Fuzzy Typo Tolerance using Levenshtein distance
        if (qToken.length >= 3 && tToken.length >= 3) {
          const maxDist = qToken.length >= 7 ? 2 : 1;
          const dist = levenshteinDistance(qToken, tToken);
          if (dist <= maxDist) {
            const typoScore = 0.8 - (dist * 0.2);
            bestTokenScore = Math.max(bestTokenScore, typoScore);
          }
        }
      }

      if (bestTokenScore >= 0.55) {
        matchedTokenCount++;
        tokenScoreAcc += bestTokenScore;
      }
    }

    const tokenRatio = matchedTokenCount / queryTokens.length;
    if (tokenRatio >= 0.75) {
      const overallScore = (tokenScoreAcc / queryTokens.length) * tokenRatio;
      if (overallScore >= threshold) {
        return { isMatch: true, score: overallScore };
      }
    }
  }

  // 3. Subsequence fuzzy match (characters appear in order)
  let qIdx = 0;
  let tIdx = 0;
  let consecutiveCount = 0;
  let maxConsecutive = 0;

  while (qIdx < compQuery.length && tIdx < compTarget.length) {
    if (compQuery[qIdx] === compTarget[tIdx]) {
      qIdx++;
      consecutiveCount++;
      if (consecutiveCount > maxConsecutive) maxConsecutive = consecutiveCount;
    } else {
      consecutiveCount = 0;
    }
    tIdx++;
  }

  if (qIdx === compQuery.length) {
    // Characters matched in order
    const spreadPenalty = compQuery.length / tIdx;
    const subseqScore = 0.5 + (0.3 * (maxConsecutive / compQuery.length)) + (0.2 * spreadPenalty);
    if (subseqScore >= threshold) {
      return { isMatch: true, score: subseqScore };
    }
  }

  return { isMatch: false, score: 0 };
}

/**
 * Highlight matched substrings / tokens inside original text
 */
export function highlightFuzzyText(originalText: string, query: string): React.ReactNode {
  if (!query || query.trim().length === 0 || !originalText) {
    return originalText;
  }

  const normQ = normalizePersian(query).trim();
  const qTokens = normQ.split(' ').filter(t => t.length >= 2);

  if (qTokens.length === 0) {
    return originalText;
  }

  // Find intervals to highlight
  const normOriginal = normalizePersian(originalText);
  const intervals: [number, number][] = [];

  // 1. Check exact phrase first
  const fullIdx = normOriginal.indexOf(normQ);
  if (fullIdx !== -1) {
    intervals.push([fullIdx, fullIdx + normQ.length]);
  } else {
    // 2. Check each token
    for (const token of qTokens) {
      let startPos = 0;
      while (startPos < normOriginal.length) {
        const found = normOriginal.indexOf(token, startPos);
        if (found === -1) break;
        intervals.push([found, found + token.length]);
        startPos = found + token.length;
      }
    }
  }

  if (intervals.length === 0) {
    return originalText;
  }

  // Merge overlapping or adjacent intervals
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }

  // Map normalized indices back to approximate original text ranges
  // Since Persian normalization preserves length roughly (1:1 for most characters),
  // we slice originalText cleanly
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  for (let i = 0; i < merged.length; i++) {
    const [start, end] = merged[i];
    const safeStart = Math.min(originalText.length, Math.max(lastIndex, start));
    const safeEnd = Math.min(originalText.length, Math.max(safeStart, end));

    if (safeStart > lastIndex) {
      elements.push(originalText.substring(lastIndex, safeStart));
    }

    if (safeEnd > safeStart) {
      elements.push(
        React.createElement(
          'mark',
          {
            key: `mark-${i}-${safeStart}`,
            className: 'bg-amber-400/35 text-amber-200 font-bold px-0.5 rounded transition-colors'
          },
          originalText.substring(safeStart, safeEnd)
        )
      );
    }

    lastIndex = safeEnd;
  }

  if (lastIndex < originalText.length) {
    elements.push(originalText.substring(lastIndex));
  }

  return React.createElement(React.Fragment, null, ...elements);
}

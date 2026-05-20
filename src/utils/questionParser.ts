import { Question } from '@/types';

export const parseQuestionsTxt = (txtContent: string): Question[] => {
    if (!txtContent.trim()) {
        return [];
    }
    const questions: Question[] = [];
    // Split by one or more blank lines
    const questionBlocks = txtContent.trim().split(/\n\s*\n/);
    for (const block of questionBlocks) {
        const lines = block.trim().split('\n').filter((line: string) => line.trim() !== '');
        if (lines.length < 2)
            continue; // Must have a question and at least one option
        // First line is the question text (e.g., "1. What is...? ")
        const questionText = lines[0].replace(/^\d+\.\s*/, '').trim();
        const options = [];
        // Subsequent lines are the options
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            const isCorrect = line.startsWith('*');
            // e.g., "*a) Correct" or "b) Incorrect"
            const optionText = line.replace(/^\*\s*[a-d]\)\s*|^\s*[a-d]\)\s*/, '').trim();
            if (optionText) {
                options.push({ text: optionText, isCorrect });
            }
        }
        if (questionText && options.length > 0) {
            questions.push({ text: questionText, options });
        }
    }
    return questions;
};


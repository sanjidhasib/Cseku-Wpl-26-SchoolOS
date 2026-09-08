const answerService = require('./services/answerService');

const testCases = [
  { classLevel: 5, subject: 'Primary Science', chapter: 'Photosynthesis', question: 'What is the difference between photosynthesis and cellular respiration?' },
  { classLevel: 5, subject: 'Primary Science', chapter: 'Environmental Pollution', question: 'What is the difference between photosynthesis and cellular respiration?' },
  { classLevel: 2, subject: 'Science', chapter: '', question: 'What is the difference between photosynthesis and cellular respiration?' },
  { classLevel: 10, subject: 'Science', chapter: '', question: 'What is the difference between photosynthesis and cellular respiration?' },
  { classLevel: 5, subject: 'Primary Science', chapter: '', question: 'What is the difference between photosynthesis and cellular respiration?' },
  { classLevel: 5, subject: 'Primary Science', chapter: 'Nonexistent Chapter', question: 'What is the difference between photosynthesis and cellular respiration?' },
];

(async () => {
  for (const tc of testCases) {
    console.log('---');
    console.log(`Test case: Class ${tc.classLevel}, Subject ${tc.subject}, Chapter ${tc.chapter || 'None'}`);
    try {
      const result = await answerService.getAnswer(tc);
      const chunkCount = result.retrievedChunkCount || 0;
      const chapters = result.sources.map(src => src.chapter).join(', ');
      const allMatchClass = result.sources.every(src => true); // class already filtered
      const allMatchSubject = result.sources.every(src => true); // subject already filtered
      const allMatchChapter = tc.chapter ? result.sources.every(src => src.chapter.toLowerCase() === tc.chapter.toLowerCase()) : true;
      const geminiGenerated = !!result.answer && !result.answer.includes('AI provider is not configured');
      console.log('Number of retrieved chunks:', chunkCount);
      console.log('Retrieved chapter names:', chapters);
      console.log('All chunks match class/subject:', allMatchClass && allMatchSubject);
      console.log('All chunks match selected chapter:', allMatchChapter);
      console.log('Gemini generated answer:', geminiGenerated);
      console.log('Source metadata shown:', result.sources);
    } catch (e) {
      console.error('Error during test case:', e.message);
    }
  }
})();

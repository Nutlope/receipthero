import { useState } from 'react';

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [texts, setTexts] = useState<string[]>([]);
  const [base64s, setBase64s] = useState<string[]>([]);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const processFiles = async (filesWithId: { file: File; id: string }[]) => {
    setIsProcessing(true);
    setTexts([]);
    setBase64s([]);
    setProcessingIds(new Set(filesWithId.map(f => f.id)));

    for (const { file, id } of filesWithId) {
      console.log('Processing file:', file.name, file);

      try {
        const base64 = await readFileAsBase64(file);
        console.log('Base64 length:', base64.length);
        setBase64s(prev => [...prev, base64]);

        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: base64 }),
        });

        const data = await response.json();

        if (response.ok) {
          setTexts(prev => [...prev, data.text]);
        } else {
          console.error('Error:', data.error);
          setTexts(prev => [...prev, 'Error extracting text']);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setTexts(prev => [...prev, 'Error processing file']);
      }

      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }

    setIsProcessing(false);
  };

  return { processFiles, texts, base64s, isProcessing, processingIds };
}
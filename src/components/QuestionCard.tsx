'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Question } from '@/types/question';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTestMode } from '@/contexts/TestModeContext';
import { InfoToggle } from './InfoToggle';

interface AnswerOptionProps {
  text: string;
  translatedText?: string;
  isCorrect: boolean;
  index: number;
  onToggle: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onClick: (e: React.MouseEvent) => void;
  };
  isToggled: boolean;
  isTestMode: boolean;
  isSelected?: boolean;
  showFeedback?: boolean;
  testModeContentToggled?: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ 
  text, 
  translatedText, 
  isCorrect, 
  index, 
  onToggle, 
  isToggled,
  isTestMode,
  isSelected = false,
  showFeedback = false,
  testModeContentToggled = false
}) => {
  const getDisplayText = () => {
    // In test mode, show translation if toggled and answer has been selected
    if (isTestMode) {
      if (testModeContentToggled && showFeedback && translatedText) {
        return translatedText;
      }
      return text;
    }
    // In study mode, if toggled and we have a translation, show it
    if (isToggled && translatedText) {
      return translatedText;
    }
    // Otherwise show the German text
    return text;
  };

  const getButtonStyles = () => {
    if (isTestMode) {
      // Test mode styling
      if (showFeedback) {
        if (isSelected && isCorrect) {
          // Selected correct answer
          return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200';
        } else if (isSelected && !isCorrect) {
          // Selected wrong answer
          return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200';
        } else if (!isSelected && isCorrect) {
          // Correct answer when user selected wrong
          return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200';
        }
      } else if (isSelected) {
        // Selected but no feedback yet
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-200';
      }
      // Default test mode style
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100';
    } else {
      // Study mode styling (original)
      return isCorrect
        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200'
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100';
    }
  };

  const getIndicatorStyles = () => {
    if (isTestMode && showFeedback) {
      if (isSelected && isCorrect) {
        return 'bg-green-500 text-white';
      } else if (isSelected && !isCorrect) {
        return 'bg-red-500 text-white';
      } else if (!isSelected && isCorrect) {
        return 'bg-green-500 text-white';
      }
    } else if (isTestMode && isSelected) {
      return 'bg-blue-500 text-white';
    } else if (!isTestMode && isCorrect) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300';
  };

  const showCheckmark = () => {
    if (isTestMode && showFeedback) {
      return (isSelected && isCorrect) || (!isSelected && isCorrect);
    }
    return !isTestMode && isCorrect;
  };

  const showXmark = () => {
    return isTestMode && showFeedback && isSelected && !isCorrect;
  };

  return (
    <button
      onClick={onToggle.onClick}
      onTouchStart={onToggle.onTouchStart}
      onTouchMove={onToggle.onTouchMove}
      onTouchEnd={onToggle.onTouchEnd}
      className={`w-full text-left p-3 rounded-lg border transition-all duration-300 min-h-[60px] select-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${getButtonStyles()}`}
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${getIndicatorStyles()}`}>
            {index + 1}
          </span>
          <span className="transition-all duration-300 transform">
            {getDisplayText()}
          </span>
        </div>
        {showCheckmark() && (
          <svg className="w-6 h-6 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {showXmark() && (
          <svg className="w-6 h-6 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
};

type AnswerKey = 'a' | 'b' | 'c' | 'd';



interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber }) => {
  const { language } = useLanguage();
  const { isTestMode } = useTestMode();
  const [questionToggled, setQuestionToggled] = useState(false);
  const [answerToggles, setAnswerToggles] = useState<Record<string, boolean>>({});
  const [infoToggled, setInfoToggled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [testModeContentToggled, setTestModeContentToggled] = useState(false);

  const translation = question.translation?.[language];

  const [shuffledOptions] = useState(() => {
    const options = [
      { key: 'a', text: question.a, isCorrect: question.solution === 'a' },
      { key: 'b', text: question.b, isCorrect: question.solution === 'b' },
      { key: 'c', text: question.c, isCorrect: question.solution === 'c' },
      { key: 'd', text: question.d, isCorrect: question.solution === 'd' },
    ];

    // In-place shuffle for initial render
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  });

  const optionsWithTranslations = useMemo(() => {
    return shuffledOptions.map(option => {
      // For test mode translations, use the currently selected language
      const selectedLangTranslation = question.translation?.[language]?.[option.key as AnswerKey];
      const fallbackTranslation = question.translation?.en?.[option.key as AnswerKey];
      
      return {
        ...option,
        translatedText: selectedLangTranslation || fallbackTranslation
      };
    });
  }, [shuffledOptions, language, question.translation]);

  useEffect(() => {
    setQuestionToggled(false);
    setAnswerToggles({});
    setInfoToggled(false);
    setImageError(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTestModeContentToggled(false);
  }, [question, translation]);

  const handleAnswerToggle = useCallback((optionKey: string) => {
    if (isTestMode) {
      // Test mode: select answer and show feedback
      setSelectedAnswer(optionKey);
      setShowFeedback(true);
    } else {
      // Study mode: toggle translation
      setAnswerToggles(prev => ({
        ...prev,
        [optionKey]: !prev[optionKey]
      }));
    }
  }, [isTestMode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle number keys in test mode and when not in input fields
      if (!isTestMode || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Handle number keys 1-4 for answer selection
      const keyNumber = parseInt(e.key);
      if (keyNumber >= 1 && keyNumber <= 4) {
        e.preventDefault();
        const optionIndex = keyNumber - 1;
        if (optionIndex < optionsWithTranslations.length && !showFeedback) {
          const selectedOption = optionsWithTranslations[optionIndex];
          handleAnswerToggle(selectedOption.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isTestMode, optionsWithTranslations, showFeedback, handleAnswerToggle]);

  // Handle image loading state when image URL changes
  useEffect(() => {
    if (question.image && question.image !== '-') {
      // Reset image states when image URL changes
      setImageLoaded(false);
      setImageError(false);
      
      // Check if image is already cached by creating a new Image object
      const img = document.createElement('img');
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = question.image;
    } else {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [question.image]);

  const getQuestionDisplayText = () => {
    // In test mode, show translation if toggled and answer has been selected
    if (isTestMode) {
      if (testModeContentToggled && showFeedback && question.translation) {
        // Use the currently selected language for translation
        const selectedLangTranslation = question.translation[language]?.question;
        const fallbackTranslation = question.translation.en?.question;
        return selectedLangTranslation || fallbackTranslation || question.question;
      }
      return question.question;
    }
    
    console.log('Question toggle state:', questionToggled);
    console.log('Current language:', language);
    console.log('Available translation:', translation?.question);
    
    // If toggled and we have a translation, show it
    if (questionToggled && translation?.question) {
      return translation.question;
    }
    // Otherwise show the German text
    return question.question;
  };

  const handleQuestionToggle = () => {
    // Only allow question toggle in study mode
    if (!isTestMode) {
      setQuestionToggled(!questionToggled);
    }
  };

  // Prevent double firing on mobile (both touch and click events)
  const createSafeToggleHandler = (toggleFn: () => void) => {
    let touchStartPos = { x: 0, y: 0 };
    let touchMoved = false;
    let touchStarted = false;
    const MOVEMENT_THRESHOLD = 10; // pixels - anything above this is considered scrolling
    
    return {
      onTouchStart: (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchMoved = false;
        touchStarted = true;
        // Don't prevent default - allow scrolling to work
      },
      onTouchMove: (e: React.TouchEvent) => {
        if (!touchStarted) return;
        
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPos.x);
        const deltaY = Math.abs(touch.clientY - touchStartPos.y);
        
        // If movement exceeds threshold, mark as scroll gesture
        if (deltaX > MOVEMENT_THRESHOLD || deltaY > MOVEMENT_THRESHOLD) {
          touchMoved = true;
        }
      },
      onTouchEnd: (e: React.TouchEvent) => {
        if (!touchStarted) return;
        
        // Only trigger action if no significant movement detected (true tap)
        if (!touchMoved) {
          e.preventDefault();
          e.stopPropagation();
          toggleFn();
        }
        
        // Reset state
        touchStarted = false;
        touchMoved = false;
      },
      onClick: () => {
        // Only handle click if it wasn't a touch event
        if (!touchStarted) {
          toggleFn();
        }
      }
    };
  };

  const handleInfoToggle = () => {
    setInfoToggled(!infoToggled);
  };

  const handleTestModeContentToggle = () => {
    if (isTestMode && showFeedback) {
      setTestModeContentToggled(!testModeContentToggled);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Question {questionNumber}
          </h3>
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            {isTestMode && showFeedback && question.translation && Object.keys(question.translation).length > 0 && language !== 'de' && (
              <button
                {...createSafeToggleHandler(handleTestModeContentToggle)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                title={testModeContentToggled ? "Show German text" : "Show translation"}
                aria-label={testModeContentToggled ? "Show German text" : "Show translation"}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <button
          {...createSafeToggleHandler(handleQuestionToggle)}
          className={`text-left w-full transition-colors group select-none ${
            isTestMode ? '' : 'hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          <p className={`text-gray-800 dark:text-gray-200 transition-all duration-300 transform ${
            isTestMode ? '' : 'group-hover:scale-[1.01]'
          }`}>
            {getQuestionDisplayText()}
          </p>
        </button>
      </div>

      {question.image && question.image !== '-' && (
        <div className="mb-4">
          {!imageError ? (
            <Image
              src={question.image}
              alt={`Question ${questionNumber} illustration`}
              className={`max-w-full h-auto rounded-lg transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              width={800}
              height={600}
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                console.error('Failed to load image:', question.image);
                setImageError(true);
                setImageLoaded(false);
              }}
              unoptimized
              priority
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Image failed to load
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 min-h-[200px]">
        {optionsWithTranslations.map((option, index) => (
          <AnswerOption
            key={option.key}
            text={option.text}
            translatedText={option.translatedText}
            isCorrect={option.isCorrect}
            index={index}
            onToggle={createSafeToggleHandler(() => handleAnswerToggle(option.key))}
            isToggled={answerToggles[option.key] || false}
            isTestMode={isTestMode}
            isSelected={selectedAnswer === option.key}
            showFeedback={showFeedback}
            testModeContentToggled={testModeContentToggled}
          />
        ))}
      </div>

      <InfoToggle
        germanContext={question.context}
        translatedContext={question.translation?.[language]?.context || question.translation?.en?.context}
        onContentToggle={handleInfoToggle}
        isContentToggled={infoToggled}
        isTestMode={isTestMode}
        testModeContentToggled={testModeContentToggled}
        showFeedback={showFeedback}
      />
    </div>
  );
};
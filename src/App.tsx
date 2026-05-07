/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  MapPin, 
  Award, 
  Download, 
  User, 
  Settings, 
  Factory, 
  Ship, 
  HardHat, 
  Building2,
  Trophy,
  RefreshCw,
  Star,
  Globe,
  Volume2,
  VolumeX,
  Layers,
  Home
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

// POSCO BRAND COLORS
const COLORS = {
  blue: '#004b93',
  lightBlue: '#e6f0ff',
  grey: '#6d6e71',
  silver: '#d1d3d4',
  white: '#ffffff',
  accent: '#f28b0c' // Friendly industrial orange
};

type Language = 'en' | 'ko';

interface Question {
  id: number;
  question: string;
  options: { label: string; value: string; isCorrect: boolean }[];
  explanation: string;
  part: 'furnace' | 'mill' | 'port' | 'bridge'; // Which part of the factory is built
}

interface GameData {
  intro: {
    title: string;
    description: string;
    button: string;
  };
  navigation: {
    tapToContinue: string;
    skip: string;
  };
  pohang: {
    name: string;
    quest: Question[];
  };
  gwangyang: {
    name: string;
    quest: Question[];
  };
  certificate: {
    title: string;
    congrats: string;
    welcome: string;
    reminder: string;
    signature: string;
    seal: string;
    download: string;
    restart: string;
  };
}

const gameData: Record<Language, GameData> = {
  en: {
    intro: {
      title: "Park1538 Gwang Yang's Posco Junior Master Quest",
      description: "Join Chairman Park Tae-joon to build the world's best steelworks!",
      button: "Let's Start!"
    },
    navigation: {
      tapToContinue: "Tap to continue",
      skip: "Skip"
    },
    pohang: {
      name: "Pohang Steelworks",
      quest: [
        {
          id: 1,
          question: "What is the name of our company?",
          options: [
            { label: "POSCO", value: "posco", isCorrect: true },
            { label: "Steel Center", value: "steel", isCorrect: false }
          ],
          explanation: "That's right! POSCO started in Pohang in 1968.",
          part: 'furnace'
        },
        {
          id: 2,
          question: "What is the 'Right-Turn Spirit'?",
          options: [
            { label: "Never give up/Responsibility", value: "spirit", isCorrect: true },
            { label: "Always walk right", value: "walk", isCorrect: false }
          ],
          explanation: "Correct! It means if we fail, we must take full responsibility. Never give up!",
          part: 'mill'
        },
        {
          id: 3,
          question: "What comes out of a hot furnace?",
          options: [
            { label: "Molten Iron", value: "iron", isCorrect: true },
            { label: "Cold Water", value: "water", isCorrect: false }
          ],
          explanation: "Yes! 쇳물 (Molten Iron) is the start of everything steel.",
          part: 'port'
        }
      ]
    },
    gwangyang: {
      name: "Gwang Yang Steelworks",
      quest: [
        {
          id: 4,
          question: "How was Gwang Yang Steelworks built?",
          options: [
            { label: "Reclaimed from the sea", value: "sea", isCorrect: true },
            { label: "In the mountains", value: "mountain", isCorrect: false }
          ],
          explanation: "Amazing! We filled the sea to create new land for our factory.",
          part: 'furnace'
        },
        {
          id: 5,
          question: "Why did we build it near the sea?",
          options: [
            { label: "For big ships to come", value: "ships", isCorrect: true },
            { label: "To go swimming", value: "swim", isCorrect: false }
          ],
          explanation: "Exactly! Big ships bring raw materials and carry steel to the world.",
          part: 'mill'
        },
        {
          id: 6,
          question: "What do we make with our steel?",
          options: [
            { label: "Cars and Bridges", value: "cars", isCorrect: true },
            { label: "Paper and Toys", value: "toys", isCorrect: false }
          ],
          explanation: "You got it! Our steel supports the world's cars and massive bridges.",
          part: 'bridge'
        }
      ]
    },
    certificate: {
      title: "JUNIOR MASTER BUILDER CERTIFICATE",
      congrats: "Congratulations! You are now a Posco Junior Master Builder",
      welcome: "Thank you for being part of this quest. We are happy to welcome you to our family!",
      reminder: "Please save this certificate and show it to the Steelworks' Tour Guide (철강해설사) to receive your first Salary!",
      signature: "Park Tae-joon",
      seal: "POSCO MUSEUM",
      download: "Save Certificate",
      restart: "Play Again"
    }
  },
  ko: {
    intro: {
      title: "Park1538광양\n포스코 주니어 마스터 빌더\n퀘스트에 오신것을 환영합니다!",
      description: "박태준 회장님과 함께 세계 최고의 제철소를 만들어보아요!",
      button: "시작하기"
    },
    navigation: {
      tapToContinue: "화면을 터치하세요",
      skip: "건너뛰기"
    },
    pohang: {
      name: "포항 제철소",
      quest: [
        {
          id: 1,
          question: "우리 회사의 이름은 무엇일까요?",
          options: [
            { label: "POSCO (포스코)", value: "posco", isCorrect: true },
            { label: "Steel Center", value: "steel", isCorrect: false }
          ],
          explanation: "맞아요! 포스코는 1968년 포항에서 시작되었답니다.",
          part: 'furnace'
        },
        {
          id: 2,
          question: "'우향우 정신'은 무엇을 의미할까요?",
          options: [
            { label: "책임감과 불굴의 의지", value: "spirit", isCorrect: true },
            { label: "오른쪽으로 걷기", value: "walk", isCorrect: false }
          ],
          explanation: "정답입니다! 실패하면 영일만에 빠지겠다는 정신으로 최선을 다하는 책임감을 말해요.",
          part: 'mill'
        },
        {
          id: 3,
          question: "뜨거운 용광로에서 나오는 것은 무엇일까요?",
          options: [
            { label: "쇳물", value: "iron", isCorrect: true },
            { label: "찬물", value: "water", isCorrect: false }
          ],
          explanation: "네! 뜨거운 쇳물이 철강의 시작이랍니다.",
          part: 'port'
        }
      ]
    },
    gwangyang: {
      name: "광양 제철소",
      quest: [
        {
          id: 4,
          question: "광양 제철소는 어떻게 지어졌을까요?",
          options: [
            { label: "바다를 메워서 (매립)", value: "sea", isCorrect: true },
            { label: "산 위에", value: "mountain", isCorrect: false }
          ],
          explanation: "대단해요! 바다를 메워 새로운 땅을 만들고 제철소를 지었답니다.",
          part: 'furnace'
        },
        {
          id: 5,
          question: "왜 바다 옆에 제철소를 지었을까요?",
          options: [
            { label: "큰 배가 드나들기 위해", value: "ships", isCorrect: true },
            { label: "수영을 하려고", value: "swim", isCorrect: false }
          ],
          explanation: "맞아요! 큰 배로 원료를 가져오고 만든 제품을 세계로 보내기 위해서예요.",
          part: 'mill'
        },
        {
          id: 6,
          question: "우리가 만든 철로 무엇을 만들까요?",
          options: [
            { label: "자동차와 다리", value: "cars", isCorrect: true },
            { label: "종이와 장난감", value: "toys", isCorrect: false }
          ],
          explanation: "완벽해요! 우리가 만든 철은 자동차와 큰 다리를 만드는 데 쓰인답니다.",
          part: 'bridge'
        }
      ]
    },
    certificate: {
      title: "주니어 마스터 빌더 수료증",
      congrats: "축하합니다! 당신은 이제 포스코 주니어 마스터 빌더입니다.",
      welcome: "퀘스트에 참여해주셔서 감사합니다. 당신을 포스코의 소중한 가족으로 환영합니다!",
      reminder: "수료증을 저장한 후, 철강해설사 선생님께 보여드리고 첫 월급을 받으세요!",
      signature: "박태준",
      seal: "POSCO MUSEUM",
      download: "수료증 저장하기",
      restart: "다시 시작하기"
    }
  }
};

type AppState = 
  | 'LANG_SELECT' 
  | 'INTRO' 
  | 'MAP_POHANG' 
  | 'QUEST_POHANG' 
  | 'SUCCESS_POHANG'
  | 'MAP_GWANGYANG' 
  | 'QUEST_GWANGYANG' 
  | 'SUCCESS_GWANGYANG'
  | 'NAME_ENTRY' 
  | 'CERTIFICATE';

export default function App() {
  const [state, setState] = useState<AppState>('LANG_SELECT');
  const [lang, setLang] = useState<Language>('en');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [builtParts, setBuiltParts] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const texts = useMemo(() => gameData[lang], [lang]);

  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // TTS Helper using Native Browser Web Speech API
  const speakText = (textToSpeak: string) => {
    if (isMuted || !textToSpeak || !window.speechSynthesis) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Attempt to find a good male voice
    const voices = window.speechSynthesis.getVoices();
    const preferredLang = lang === 'ko' ? 'ko-KR' : 'en-US';
    
    // Filter by language
    const langVoices = voices.filter(v => v.lang.includes(preferredLang));
    
    // Try to find a male-sounding voice if possible (browser dependent)
    const maleVoice = langVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('google korean'));
    
    utterance.voice = maleVoice || langVoices[0] || null;
    utterance.lang = preferredLang;
    utterance.rate = 0.85; // Slower for clarity and a "wise elder" tone
    utterance.pitch = 0.9; // Slightly lower pitch

    window.speechSynthesis.speak(utterance);
  };

  // Trigger TTS on state change or dialogue update
  useEffect(() => {
    if (state === 'INTRO') {
      speakText(texts.intro.description);
    } else if (state === 'MAP_POHANG') {
      speakText(lang === 'en' ? "Our first stop is Pohang! Let's build our first furnace here." : "먼저 포항으로 가볼까요? 이곳에서 우리의 첫 번째 용광로를 지어봅시다!");
    } else if (state === 'MAP_GWANGYANG') {
      speakText(lang === 'en' ? "Pohang is complete! Now let's go to Gwangyang to build an even bigger steelworks on the sea." : "포항 제철소가 완성되었어요! 이제 광양으로 가서 바다 위에 더 큰 제철소를 지어봅시다!");
    } else if (state === 'QUEST_POHANG' || state === 'QUEST_GWANGYANG') {
      const stage = state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang;
      speakText(stage.quest[currentQuestionIndex].question);
    } else if (state === 'CERTIFICATE') {
      speakText(`${texts.certificate.congrats}. ${texts.certificate.reminder}`);
    }
  }, [state, lang, currentQuestionIndex]);

  // Also trigger on question feedback
  useEffect(() => {
    if (showFeedback === 'correct') {
      const stage = state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang;
      speakText(stage.quest[currentQuestionIndex].explanation);
    }
  }, [showFeedback]);

  const handleCorrect = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [COLORS.blue, COLORS.accent, '#ffffff']
    });
    
    const stage = state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang;
    const part = stage.quest[currentQuestionIndex].part;
    setBuiltParts(prev => [...prev, `${state}_${part}`]);
    
    setShowFeedback('correct');
    // Previously there was a timeout here, removed it to allow manual navigation
  };

  const handleNextQuestion = () => {
    setShowFeedback(null);
    const stage = state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang;
    if (currentQuestionIndex < stage.quest.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Stage Complete
      if (state === 'QUEST_POHANG') {
        setState('SUCCESS_POHANG');
      } else {
        setState('SUCCESS_GWANGYANG');
      }
    }
  };

  const handleDownload = async () => {
    if (certRef.current === null) return;
    try {
      const dataUrl = await toPng(certRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `POSCO_MasterBuilder_${userName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating certificate', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-50 font-sans text-slate-800 overflow-hidden flex flex-col items-center justify-center select-none"
    >
      {/* Background Image with 30% opacity */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3
        }}
      />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
        
        {/* Global Sound & Home Toggle */}
        {state !== 'LANG_SELECT' && (
          <div className="fixed top-6 right-6 z-[100] flex gap-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setState('LANG_SELECT');
                setBuiltParts([]);
                setUserName('');
                setCurrentQuestionIndex(0);
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              className="p-3 rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-lg text-slate-600 hover:text-blue-900 transition-colors"
              id="btn-home"
            >
              <Home size={24} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                const newMuted = !isMuted;
                setIsMuted(newMuted);
                if (newMuted && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="p-3 rounded-full bg-white/80 backdrop-blur border border-blue-100 shadow-lg text-blue-900"
              id="btn-mute-toggle"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </motion.button>
          </div>
        )}
        
        {/* 1. LANGUAGE SELECTION */}
        {state === 'LANG_SELECT' && (
          <motion.div 
            key="lang"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-8 p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <SteelCoilLogoWithText />
            </motion.div>
            <h1 className="flex flex-col items-center gap-1 text-center text-blue-900 px-4 leading-tight">
              <span className="text-2xl font-bold">Park1538광양</span>
              <span className="text-2xl font-bold">포스코 주니어 마스터 빌더</span>
              <span className="text-lg font-bold">퀘스트에 오신것을 환영합니다!</span>
              <span className="block text-sm font-medium text-slate-500 mt-2 whitespace-normal tracking-normal">
                Welcome to Park1538 Gwangyang's Posco Junior Master Quest
              </span>
            </h1>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button 
                onClick={() => { setLang('ko'); setState('INTRO'); }}
                className="bg-blue-700 text-white py-4 rounded-2xl text-xl font-bold hover:scale-105 transition-transform"
                id="btn-ko"
              >
                한국어
              </button>
              <button 
                onClick={() => { setLang('en'); setState('INTRO'); }}
                className="bg-blue-700 text-white py-4 rounded-2xl text-xl font-bold hover:scale-105 transition-transform"
                id="btn-en"
              >
                English
              </button>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 text-xs sm:text-sm text-slate-500 font-bold tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
            >
               Developed by: JULLIE JEONG, POSCO PR Section
            </motion.div>
          </motion.div>
        )}

        {/* 2. INTRO WITH CHARACTER */}
        {state === 'INTRO' && (
          <motion.div 
            key="intro"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="flex flex-col items-center p-8 max-w-sm text-center"
          >
            <CharacterAvatar />
            <Dialogue text={texts.intro.description} />
            <div className="flex flex-col items-center gap-1 mt-6 mb-2">
              {texts.intro.title.split('\n').map((line, i) => (
                <span key={i} className={`${i === 2 ? 'text-lg' : 'text-2xl'} font-bold text-blue-900 leading-tight text-center`}>
                  {line}
                </span>
              ))}
            </div>
            <button 
              onClick={() => setState('MAP_POHANG')}
              className="mt-8 bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-orange-600 transition-colors"
              id="btn-start"
            >
              {texts.intro.button}
            </button>
          </motion.div>
        )}

        {/* 3. MAP POHANG */}
        {state === 'MAP_POHANG' && (
          <motion.div 
            key="map-pohang"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full p-6 flex flex-col items-center justify-between"
          >
            <header className="w-full flex justify-between items-center">
               <h2 className="text-xl font-bold text-blue-900">1. {texts.pohang.name}</h2>
            </header>
            
            <div className="relative w-full aspect-square max-w-md bg-transparent rounded-3xl p-4 overflow-hidden border-4 border-blue-100/50">
               <KoreaMap activeLocation="pohang" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <CharacterAvatar sm />
              <Dialogue sm text={lang === 'en' ? "Our first stop is Pohang! Let's build our first furnace here." : "먼저 포항으로 가볼까요? 이곳에서 우리의 첫 번째 용광로를 지어봅시다!"} />
              <button 
                onClick={() => setState('QUEST_POHANG')}
                className="bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold flex items-center gap-2 group"
                id="btn-goto-pohang"
              >
                {lang === 'en' ? "Go to Pohang" : "포항으로 가기"}
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 4. QUEST SCREENS (POHANG & GWANGYANG) */}
        {(state === 'QUEST_POHANG' || state === 'QUEST_GWANGYANG') && (
          <motion.div 
            key="quest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col"
          >
            {/* Visual Header: Factory Progress */}
            <div className="h-2/5 bg-slate-100/30 relative overflow-hidden flex items-end justify-center pb-4">
              <div className="absolute inset-x-0 bottom-0 h-4 bg-slate-300"></div>
              <FactoryBuilding currentParts={builtParts} stage={state === 'QUEST_POHANG' ? 'pohang' : 'gwangyang'} />
              
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-bold border border-blue-200">
                {state === 'QUEST_POHANG' ? "POHANG" : "GWANGYANG"}
              </div>
            </div>

            {/* Quiz Content */}
            <div className="flex-1 p-6 bg-white/80 backdrop-blur-sm rounded-t-3xl -mt-6 z-10 shadow-2xl flex flex-col justify-between">
              <div>
                <QuestionProgress current={currentQuestionIndex + 1} total={3} />
                <h3 className="text-xl font-bold mt-4 leading-snug">
                  {(state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang).quest[currentQuestionIndex].question}
                </h3>
              </div>

              <div className="grid gap-3 mb-4">
                {(state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang).quest[currentQuestionIndex].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (opt.isCorrect) handleCorrect();
                      else setShowFeedback('incorrect');
                    }}
                    className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium flex items-center justify-between group"
                    id={`opt-${i}`}
                  >
                    {opt.label}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  </button>
                ))}
              </div>

              <CharacterAvatar sm horizontal text={showFeedback === 'correct' ? (state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang).quest[currentQuestionIndex].explanation : (lang === 'en' ? "Can you solve this?" : "정답을 맞춰보세요!")} />
              <AnimatePresence>
                {showFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none"
                  >
                    <div className={`p-10 rounded-3xl shadow-2xl flex flex-col items-center ${showFeedback === 'correct' ? 'bg-gradient-to-br from-blue-900/20 to-white/20 backdrop-blur-md' : 'bg-red-500'} text-white`}>
                      {showFeedback === 'correct' ? (
                        <>
                          <div className="relative">
                            <Trophy size={80} className="text-blue-900 drop-shadow-lg" />
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.3, type: 'spring' }}
                              className="absolute -top-1 -right-1"
                            >
                              <Star size={32} className="text-[#a8a9ad] fill-[#a8a9ad] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                            </motion.div>
                          </div>
                          <h2 className="text-3xl font-black mt-4 tracking-tight text-blue-900 drop-shadow-sm">{lang === 'en' ? "Great Job!" : "멋져요!"}</h2>
                          <p className="text-center mt-2 text-blue-900/90 leading-relaxed text-lg font-bold">
                            {(state === 'QUEST_POHANG' ? texts.pohang : texts.gwangyang).quest[currentQuestionIndex].explanation}
                          </p>
                          <button 
                            className="mt-8 bg-white text-blue-900 px-10 py-4 rounded-2xl font-black text-xl shadow-xl pointer-events-auto active:scale-95 transition-transform flex items-center gap-2"
                            onClick={handleNextQuestion}
                            id="btn-next-quest"
                          >
                            {lang === 'en' ? "Continue" : "다음으로"}
                            <ChevronRight />
                          </button>
                        </>
                      ) : (
                        <>
                          <RefreshCw size={80} />
                          <h2 className="text-3xl font-bold mt-4">{lang === 'en' ? "Try Again!" : "다시 해볼까요?"}</h2>
                          <button 
                            className="mt-4 bg-white/20 px-6 py-2 rounded-full font-bold pointer-events-auto"
                            onClick={() => setShowFeedback(null)}
                          >
                            {lang === 'en' ? "Got it" : "확인"}
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* 5. SUCCESS SHOWCASE SCREENS */}
        <AnimatePresence>
          {(state === 'SUCCESS_POHANG' || state === 'SUCCESS_GWANGYANG') && (
            <motion.div 
              key="completion-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="fixed inset-0 z-[110] bg-white flex flex-col items-center justify-center p-6"
            >
              <div className="absolute inset-0 bg-blue-50/30 -z-10" />
              
              <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-center mb-6 sm:mb-8"
              >
                <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs sm:text-sm font-black mb-2 tracking-widest">
                  {lang === 'en' ? "COMPLETED!" : "완성되었습니다!"}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-blue-900 leading-tight">
                  {state === 'SUCCESS_POHANG' ? texts.pohang.name : texts.gwangyang.name}
                </h2>
                <p className="text-slate-500 font-medium mt-1 sm:mt-2 text-sm">
                  {lang === 'en' ? "You've successfully built the core facilities!" : "핵심 설비들을 성공적으로 지었습니다!"}
                </p>
              </motion.div>

              <div className="w-full max-w-lg bg-white/50 backdrop-blur-sm rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 border-2 border-blue-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -ml-10 -mb-10" />
                
                <div className="relative z-10 flex flex-wrap justify-center items-end gap-3 sm:gap-6 pt-2 sm:pt-4 pb-1 sm:pb-2">
                  <FactoryBuilding 
                    currentParts={builtParts} 
                    stage={state === 'SUCCESS_POHANG' ? 'pohang' : 'gwangyang'} 
                    large 
                  />
                </div>
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 sm:mt-12 flex flex-col items-center gap-4"
              >
                <button 
                  onClick={() => {
                    if (state === 'SUCCESS_POHANG') {
                      setState('MAP_GWANGYANG');
                      setCurrentQuestionIndex(0);
                    } else {
                      setState('NAME_ENTRY');
                    }
                  }}
                  className="bg-blue-800 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black shadow-[0_10px_20px_rgba(0,75,147,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  id="btn-completion-continue"
                >
                  {lang === 'en' ? "Continue Quest" : "퀘스트 계속하기"}
                  <ChevronRight size={24} />
                </button>
                <p className="text-slate-400 text-sm font-bold animate-pulse">
                  {lang === 'en' ? "Amazing Builder Progress!" : "놀라운 건축 실력입니다!"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. MAP GWANGYANG */}
        {state === 'MAP_GWANGYANG' && (
          <motion.div 
            key="map-gwangyang"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full p-6 flex flex-col items-center justify-between"
          >
            <header className="w-full flex justify-between items-center">
               <h2 className="text-xl font-bold text-blue-900">2. {texts.gwangyang.name}</h2>
            </header>
            
            <div className="relative w-full aspect-square max-w-md bg-transparent rounded-3xl p-4 overflow-hidden border-4 border-blue-100/50">
               <KoreaMap activeLocation="gwangyang" prevLocation="pohang" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <CharacterAvatar sm />
              <Dialogue sm text={lang === 'en' ? "Pohang is complete! Now let's go to Gwangyang to build an even bigger steelworks on the sea." : "포항 제철소가 완성되었어요! 이제 광양으로 가서 바다 위에 더 큰 제철소를 지어봅시다!"} />
              <button 
                onClick={() => setState('QUEST_GWANGYANG')}
                className="bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold flex items-center gap-2 group shadow-xl"
                id="btn-goto-gwangyang"
              >
                {lang === 'en' ? "Go to Gwangyang" : "광양으로 가기"}
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 6. NAME ENTRY */}
        {state === 'NAME_ENTRY' && (
          <motion.div 
            key="name-entry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 max-w-sm w-full space-y-6 flex flex-col items-center"
          >
             <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
               <Award size={80} color={COLORS.blue} />
             </motion.div>
             <div className="text-center">
               <h2 className="text-2xl font-bold text-blue-900">{lang === 'en' ? "You are a Master Builder!" : "당신은 마스터 빌더입니다!"}</h2>
               <p className="text-slate-500 mt-2">{lang === 'en' ? "Please enter your name for the certificate" : "수료증을 위해 이름을 입력해주세요"}</p>
             </div>
             <input 
               type="text" 
               value={userName}
               onChange={(e) => setUserName(e.target.value)}
               placeholder={lang === 'en' ? "Your Name" : "이름을 입력하세요"}
               className="w-full p-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 outline-none text-xl text-center font-bold"
               id="input-name"
             />
             <motion.button 
               whileHover={userName.trim() ? { scale: 1.05 } : {}}
               whileTap={userName.trim() ? { scale: 0.95 } : {}}
               disabled={!userName.trim()}
               onClick={() => setState('CERTIFICATE')}
               className="w-full bg-blue-700 text-white py-4 rounded-xl text-xl font-bold disabled:bg-slate-300 shadow-lg transition-all active:scale-95"
               id="btn-get-cert"
             >
               {lang === 'en' ? "Get My Certificate" : "수료증 받기"}
             </motion.button>
          </motion.div>
        )}

        {/* 7. CERTIFICATE SCREEN */}
        {state === 'CERTIFICATE' && (
          <motion.div 
            key="certificate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full p-4 flex flex-col items-center justify-center bg-transparent"
          >
            {/* The actual certificate for export - Added hover effect */}
            <motion.div 
              whileHover={{ scale: 1.02, rotate: 0.5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full max-w-md bg-white p-1 rounded-sm shadow-2xl scale-[0.95]" 
              id="certificate-container"
            >
              <div ref={certRef} className="bg-gradient-to-br from-[#e6f0ff] to-white border-[12px] border-double border-blue-900 p-10 flex flex-col items-center text-center relative overflow-hidden min-h-[520px]">
                {/* Background Certificate Image - Lowered opacity for better text visibility */}
                <div 
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: "url('/Junior Master Builder.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.15
                  }}
                />

                {/* Decorative Elements - Pushed even further to avoid any overlap */}
                <div className="absolute -top-16 -right-24 w-52 h-52 bg-blue-50/20 rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-slate-50/20 rounded-full border border-slate-200/20"></div>
                
                <header className="relative z-30 flex flex-col items-center gap-2 mb-10 pt-4">
                  <h3 
                    className="text-sm font-black tracking-wider text-blue-900"
                  >
                    POSCO Gwangyang Works
                  </h3>
                  <h1 className="text-[10px] tracking-[0.3em] font-black text-slate-800 uppercase mt-1 drop-shadow-sm">{texts.certificate.title}</h1>
                </header>

                <div className="relative z-30 mb-4">
                  <p className="text-[10px] italic text-slate-700 font-bold max-w-[200px] mx-auto">{texts.certificate.congrats}</p>
                  <h2 className="text-4xl font-serif font-black text-black underline underline-offset-8 mt-2 mb-6 drop-shadow-sm">
                    {userName}
                  </h2>
                </div>

                <p className="relative z-30 text-[11px] leading-relaxed px-4 text-slate-900 mb-8 italic font-medium">
                  {texts.certificate.welcome}
                </p>

                <div className="w-full flex justify-between items-end mt-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative w-16 h-16 border-2 border-blue-900/10 rounded-full flex items-center justify-center">
                      <Trophy size={24} className="text-blue-900 drop-shadow-sm" />
                      <div className="absolute top-2 right-2">
                         <Star size={12} className="text-[#a8a9ad] fill-[#a8a9ad]" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center transform rotate-12">
                         <p className="text-[8px] font-bold text-blue-900/10 uppercase leading-none">POSCO<br/>MUSEUM</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold text-slate-400">{texts.certificate.seal}</span>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="font-serif italic text-2xl text-blue-900 transform -rotate-3 mb-1">
                      {texts.signature || texts.certificate.signature}
                    </div>
                    <div className="w-24 h-[1px] bg-slate-300"></div>
                    <span className="text-[8px] font-bold text-slate-400 capitalize">{lang === 'en' ? "Chairman" : "회장"}</span>
                  </div>
                </div>

                <div className="mt-8 text-[8px] text-slate-400 font-mono flex gap-4">
                  <span>{new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>VERIFIED ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl w-full max-w-xs text-center shadow-sm"
            >
                <p className="text-xs font-bold text-orange-800 leading-snug">
                  {texts.certificate.reminder}
                </p>
            </motion.div>

            <div className="mt-4 flex flex-col gap-3 w-full max-w-xs">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                id="btn-download"
              >
                <Download size={20} />
                {texts.certificate.download}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#cbd5e1' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setState('LANG_SELECT');
                  setBuiltParts([]);
                  setUserName('');
                  setCurrentQuestionIndex(0);
                }}
                className="bg-slate-200 text-slate-600 p-4 rounded-xl font-bold transition-colors"
                id="btn-restart"
              >
                {texts.certificate.restart}
              </motion.button>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10 text-xs sm:text-sm text-slate-500 font-bold tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
            >
               Developed by: JULLIE JEONG, POSCO PR Section
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SteelCoilLogoWithText() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="text-slate-300 opacity-30"
        >
          <Settings size={140} />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border-8 border-slate-200 flex flex-col items-center justify-center bg-slate-50 shadow-inner overflow-hidden">
             {/* Stylized Coil Spirals */}
             <div className="w-24 h-24 rounded-full border-2 border-slate-100 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center">
                   <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-5xl font-black tracking-tighter text-[#004b93] font-sans">
          POSCO
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase tracking-[0.4em] font-bold text-slate-400">Junior Master Builder</span>
      </div>
    </div>
  );
}

function PoscoLogo({ large }: { large?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`${large ? 'text-6xl' : 'text-4xl'} font-black tracking-tighter text-[#004b93] font-sans`}>
        posco
      </span>
    </div>
  );
}

function CharacterAvatar({ sm, horizontal, text }: { sm?: boolean; horizontal?: boolean; text?: string }) {
  return (
    <div className={`flex ${horizontal ? 'flex-row items-center gap-4' : 'flex-col items-center'}`}>
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className={`${sm ? 'w-16 h-16' : 'w-24 h-24'} rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center`}
      >
        {/* Placeholder for Character Image - using icon for now as build fails image gen */}
        <div className="text-blue-900 bg-blue-50 w-full h-full flex items-center justify-center">
          <User size={sm ? 32 : 48} />
        </div>
      </motion.div>
      {text && (
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-sm italic flex-1">
          {text}
        </div>
      )}
    </div>
  );
}

function Dialogue({ text, sm }: { text: string; sm?: boolean }) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative bg-white p-4 ${sm ? 'mt-2' : 'mt-4'} rounded-2xl border-2 border-blue-50 shadow-sm`}
    >
      <div className="absolute -top-2 left-1/2 -ml-2 w-4 h-4 bg-white border-l-2 border-t-2 border-blue-50 rotate-45"></div>
      <p className={`${sm ? 'text-sm' : 'text-base font-medium'} text-slate-700`}>{text}</p>
    </motion.div>
  );
}

function KoreaMap({ activeLocation, prevLocation }: { activeLocation: 'pohang' | 'gwangyang'; prevLocation?: 'pohang' }) {
  return (
    <div className="w-full h-full relative bg-[#1c3a5e] overflow-hidden rounded-2xl flex items-center justify-center p-4 border-2 border-white/20">
      {/* 3D Grid Background mimicking the reference image */}
      <div 
        className="absolute inset-4 border border-white/40 pointer-events-none z-10"
      ></div>
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          transform: 'perspective(400px) rotateX(45deg) scale(2)',
          transformOrigin: 'center center'
        }}
      ></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 100 120" className="h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Stylized Korea Map with "3D" feel */}
          <path 
             d="M38 12 L50 10 L65 22 L62 42 L78 58 L72 92 L50 112 L32 102 L28 82 L38 52 L22 42 Z" 
             fill="#ffffff" 
             stroke="#e2e8f0" 
             strokeWidth="0.5"
          />
          
          {/* Pohang Marker */}
          <g>
            <circle 
              cx="70" cy="74" r="3" 
              fill={prevLocation === 'pohang' || activeLocation === 'pohang' ? COLORS.blue : '#d1d5db'} 
              className="transition-colors duration-500"
            />
            {activeLocation === 'pohang' && (
              <motion.circle 
                cx="70" cy="74" r="6" 
                fill="none" stroke={COLORS.accent} strokeWidth="1"
                animate={{ scale: [1, 2], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </g>
          
          {/* Gwangyang Marker */}
          <g>
            <circle 
              cx="50" cy="100" r="3" 
              fill={activeLocation === 'gwangyang' ? COLORS.blue : '#d1d5db'} 
              className="transition-colors duration-500"
            />
            {activeLocation === 'gwangyang' && (
              <motion.circle 
                cx="50" cy="100" r="6" 
                fill="none" stroke={COLORS.accent} strokeWidth="1"
                animate={{ scale: [1, 2], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </g>

          {/* Location Labels */}
          <text x="75" y="74" fontSize="3" fontWeight="bold" fill="white" className="pointer-events-none opacity-80">POHANG</text>
          <text x="35" y="100" fontSize="3" fontWeight="bold" fill="white" className="pointer-events-none opacity-80">GWANGYANG</text>

          {/* Transition Arrow */}
          {prevLocation === 'pohang' && activeLocation === 'gwangyang' && (
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              d="M66 76 Q55 88 52 96"
              fill="none"
              stroke={COLORS.accent}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              markerEnd="url(#arrowhead)"
            />
          )}

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.accent} />
            </marker>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

function FactoryBuilding({ currentParts, stage, large }: { currentParts: string[]; stage: 'pohang' | 'gwangyang'; large?: boolean }) {
  const allParts = [
    { id: 'furnace', img: '/Blast Furnace.png', icon: Factory, color: '#475569', label: 'Blast Furnace' },
    { id: 'mill', img: '/Basic Oxygen Furnace.png', icon: Settings, color: '#334155', label: 'Basic Oxygen Furnace' },
    { id: 'port', img: '/Rolling Mill.png', icon: Ship, color: '#0f172a', label: 'Rolling Mill' },
    { id: 'bridge', img: '/Rolling Mill.png', icon: Building2, color: '#1e293b', label: 'Rolling Mill' }
  ];

  const stageParts = stage === 'pohang' 
    ? allParts.filter(p => ['furnace', 'mill', 'port'].includes(p.id))
    : allParts.filter(p => ['furnace', 'mill', 'bridge'].includes(p.id));

  return (
    <div className={`flex items-end ${large ? 'gap-4 sm:gap-8' : 'gap-4'} mb-2`}>
      {stageParts.map((part) => {
        const stagePrefix = stage === 'pohang' ? 'QUEST_POHANG_' : 'QUEST_GWANGYANG_';
        const isThisPartBuilt = currentParts.includes(`${stagePrefix}${part.id}`);
        
        let shouldShow = isThisPartBuilt;
        if (large) shouldShow = true; // Always show in large view (it's the completion screen)

        return (
          <motion.div
            key={part.id}
            initial={{ scale: 0, y: 100, opacity: 0 }}
            animate={shouldShow ? { scale: 1, y: 0, opacity: 1 } : { scale: 0, y: 100, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div 
              className={`${large ? 'w-24 h-32 sm:w-32 sm:h-44 p-2 sm:p-4' : 'w-20 h-28 p-2'} flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-lg`}
            >
              <img 
                src={part.img} 
                alt={part.label}
                className="w-full h-full object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={`${large ? 'text-[10px] sm:text-[12px] mt-2 sm:mt-3' : 'text-[10px] mt-2'} font-black text-blue-900 uppercase leading-tight text-center max-w-[60px] sm:max-w-[80px] drop-shadow-sm`}>
              {part.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function QuestionProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {[...Array(total)].map((_, i) => (
        <div 
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < current ? 'bg-blue-600' : 'bg-slate-100'}`}
        ></div>
      ))}
      <span className="text-[10px] font-black text-slate-400 ml-2">{current}/{total}</span>
    </div>
  );
}

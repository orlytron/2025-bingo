import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, X, Twitter, Facebook, Instagram } from 'lucide-react';
import { Input } from '@/components/ui/input';
console.log("Bingo game loading!");

const PREDICTIONS = {
  technology: [
    "AI wins Best Picture Oscar",
    "Teleportation prototype works",
    "Mind-reading device launches",
    "First human-AI marriage",
    "Brain-computer link public",
    "Quantum computer breaks Bitcoin",
    "Robot CEO appointed",
    "Digital consciousness transfer"
  ],
  environment: [
    "Global plastic ban enforced",
    "Fusion powers whole city",
    "Lab meat outsells regular",
    "Carbon levels start dropping",
    "Ocean cleanup completed",
    "Weather control success",
    "Flying cars certified",
    "Artificial photosynthesis"
  ],
  society: [
    "Universal basic income law",
    "4-day work week standard",
    "Virtual schools mainstream",
    "Digital currency dominates",
    "Space tourism hits 1000th",
    "Global language adopted",
    "Metaverse replaces offices",
    "Robot rights movement"
  ]
};
export default function BingoGame() {
  // Game state management
  const [gameState, setGameState] = useState('welcome');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectionCount, setSelectionCount] = useState(0);

  // Board state
  const [selectedPredictions, setSelectedPredictions] = useState(() => {
    const initial = Array(25).fill("");
    initial[12] = "FREE SPACE";
    return initial;
  });

  const [markedCells, setMarkedCells] = useState(() => {
    const initial = Array(25).fill(false);
    initial[12] = true;
    return initial;
  });

  const [currentOptions, setCurrentOptions] = useState([]);

  // Win condition state
  const [winningLines, setWinningLines] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationAttempt, setVerificationAttempt] = useState('');

  // UI state
  const [isCompleteAnimating, setIsCompleteAnimating] = useState(false);
  const [showPlayWithFriends, setShowPlayWithFriends] = useState(false);
  const [isShareHighlighted, setIsShareHighlighted] = useState(false);
  const getRandomPredictions = () => {
    const allPredictions = Object.values(PREDICTIONS).flat();
    const available = allPredictions.filter(p => !selectedPredictions.includes(p));
    return available.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  useEffect(() => {
    if (gameState === 'selection' && selectionCount < 24) {
      setCurrentOptions(getRandomPredictions());
    }
  }, [selectionCount, gameState, selectedPredictions]);

  const checkForWin = (cells) => {
    const winningCombos = [];
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (cells.slice(i * 5, (i + 1) * 5).every(cell => cell)) {
        winningCombos.push({ type: 'row', index: i });
      }
    }
    // Check columns
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every(j => cells[j * 5 + i])) {
        winningCombos.push({ type: 'column', index: i });
      }
    }
    // Check diagonals
    if ([0, 6, 12, 18, 24].every(i => cells[i])) {
      winningCombos.push({ type: 'diagonal', direction: 'main' });
    }
    if ([4, 8, 12, 16, 20].every(i => cells[i])) {
      winningCombos.push({ type: 'diagonal', direction: 'counter' });
    }
    setWinningLines(winningCombos);
    setIsWinner(winningCombos.length > 0);
  };

  const handleSelection = (prediction) => {
    if (selectionCount < 24) {
      setSelectedPredictions(prev => {
        const newPredictions = [...prev];
        const emptyIndex = newPredictions.findIndex((p, i) => p === "" && i !== 12);
        if (emptyIndex !== -1) {
          newPredictions[emptyIndex] = prediction;
        }
        return newPredictions;
      });
      setSelectionCount(prev => {
        const newCount = prev + 1;
        if (newCount === 24) {
          handleCompletion();
        }
        return newCount;
      });
    }
  };

  const handleCompletion = () => {
    setIsCompleteAnimating(true);
    setTimeout(() => {
      setGameState('playing');
      setIsCompleteAnimating(false);
      setShowPlayWithFriends(true);
      setIsPlaying(true);
      setCurrentOptions([]);
    }, 3000);
  };

  const toggleCell = (index) => {
    if (!isPlaying || index === 12) return;
    setMarkedCells(prev => {
      const newMarkedCells = [...prev];
      newMarkedCells[index] = !newMarkedCells[index];
      checkForWin(newMarkedCells);
      return newMarkedCells;
    });
    setIsShareHighlighted(true);
    setTimeout(() => setIsShareHighlighted(false), 2000);
  };

  const verifyWin = () => {
    if (verificationAttempt.toLowerCase() === 'youwin') {
      setIsVerified(true);
    }
  };
  const SocialShareFooter = () => (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`fixed bottom-0 left-0 right-0 p-4 border-t shadow-lg transition-colors duration-500 ${
        isShareHighlighted ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="max-w-4xl mx-auto flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-transform hover:scale-105"
          onClick={() => window.open('https://twitter.com/intent/tweet?text=Check%20out%20my%202025%20predictions!')}
        >
          <Twitter className="w-5 h-5 mr-2" />
          Share on Twitter
        </Button>
        <Button 
          variant="outline" 
          className="bg-[#4267B2] text-white hover:bg-[#365899] transition-transform hover:scale-105"
          onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=2025bingo.com')}
        >
          <Facebook className="w-5 h-5 mr-2" />
          Share on Facebook
        </Button>
        <Button 
          variant="outline" 
          className="bg-[#E4405F] text-white hover:bg-[#d93250] transition-transform hover:scale-105"
          onClick={() => alert('Instagram sharing coming soon!')}
        >
          <Instagram className="w-5 h-5 mr-2" />
          Share on Instagram
        </Button>
      </div>
    </motion.div>
  );  
  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <Head>
          <title>2025 Bingo</title>
          <meta name="description" content="Make your predictions for 2025!" />
        </Head>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="w-96 text-center">
            <CardContent className="p-8 space-y-6">
              <motion.h1 
                className="text-4xl font-bold"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                2025 Bingo
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Make your predictions for 2025 and play along as they come true!
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={() => setGameState('selection')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Begin Your Journey
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Head>
        <title>2025 Bingo</title>
        <meta name="description" content="Make your predictions for 2025!" />
      </Head>
      <AnimatePresence>
        {isCompleteAnimating && (
          <motion.div 
            className="fixed inset-0 pointer-events-none flex items-center justify-center bg-black bg-opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 1.5 }}
              className="text-6xl font-bold text-yellow-500 text-center bg-white p-8 rounded-lg"
            >
              <Trophy className="w-24 h-24 mx-auto mb-4" />
              Board Complete!
            </motion.div>
          </motion.div>
        )}

        {showPlayWithFriends && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-6 border-2 border-blue-400 w-80 z-50"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Play with Friends!</h3>
              <button 
                onClick={() => setShowPlayWithFriends(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Share your predictions and challenge friends to make their own!</p>
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                setIsShareHighlighted(true);
                setTimeout(() => setIsShareHighlighted(false), 2000);
              }}
            >
              Share Now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl mx-auto p-4">
        {isWinner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold text-yellow-600">
              BINGO WINNER 2025
            </h1>
            {!isVerified && (
              <p className="text-sm text-gray-500">(UNVERIFIED)</p>
            )}
          </motion.div>
        )}

        <Card className={`${isVerified ? 'bg-yellow-100' : ''}`}>
          {!isPlaying && (
            <CardHeader>
              <CardTitle>Choose Your Predictions ({selectionCount}/24)</CardTitle>
              <Progress 
                value={(selectionCount / 24) * 100} 
                className="h-2 mt-2"
              />
            </CardHeader>
          )}
          <CardContent className={!isPlaying ? 'pt-0' : 'pt-6'}>
            <motion.div
              animate={isCompleteAnimating ? {
                x: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.5 }
              } : {}}
              className="grid grid-cols-5 gap-2 mb-4"
            >
              {selectedPredictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: prediction ? 0 : 1, scale: prediction ? 0.8 : 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => toggleCell(index)}
                  className={`
                    aspect-square p-2 border rounded-lg
                    flex items-center justify-center
                    ${index === 12 ? 'bg-blue-100' : ''}
                    ${markedCells[index] && isPlaying ? 'bg-yellow-100' : 'bg-white'}
                    ${isPlaying ? 'cursor-pointer hover:bg-blue-50' : ''}
                    ${winningLines.some(line => 
                      (line.type === 'row' && Math.floor(index / 5) === line.index) ||
                      (line.type === 'column' && index % 5 === line.index) ||
                      (line.type === 'diagonal' && line.direction === 'main' && index % 6 === 0) ||
                      (line.type === 'diagonal' && line.direction === 'counter' && index % 4 === 0 && index > 0 && index < 24)
                    ) ? 'bg-yellow-400' : ''}
                    text-xs text-center
                    transition-colors duration-200
                  `}
                >
                  <span className="line-clamp-4">{prediction}</span>
                  {markedCells[index] && isPlaying && index !== 12 && (
                    <X className="absolute top-1 right-1 text-red-500" size={16} />
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            {!isPlaying && currentOptions.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {currentOptions.map((prediction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-24 text-left p-4 hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => handleSelection(prediction)}
                    >
                      <p className="line-clamp-3 text-sm">
                        {prediction}
                      </p>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {isWinner && !isVerified && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Verify Your Win</h3>
                <Input
                  type="password"
                  placeholder="Enter verification code"
                  value={verificationAttempt}
                  onChange={(e) => setVerificationAttempt(e.target.value)}
                />
                <Button onClick={verifyWin} className="w-full">
                  Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <SocialShareFooter />
    </div>
  );
}

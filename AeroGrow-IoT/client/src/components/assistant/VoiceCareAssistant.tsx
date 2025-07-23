import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle,
  Leaf,
  Droplets,
  Thermometer,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Bot,
  Waves
} from 'lucide-react';

interface VoiceAssistantProps {
  className?: string;
}

interface AssistantResponse {
  type: 'info' | 'warning' | 'success' | 'suggestion';
  message: string;
  action?: string;
  icon?: React.ReactNode;
}

const VoiceCareAssistant: React.FC<VoiceAssistantProps> = ({ className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState<AssistantResponse[]>([]);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          processVoiceCommand(transcript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicPermission('denied');
        }
      };
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Check microphone permission
    navigator.permissions?.query({ name: 'microphone' as PermissionName })
      .then(permission => {
        setMicPermission(permission.state as 'granted' | 'denied' | 'prompt');
      });
  }, []);

  const startListening = async () => {
    if (!recognitionRef.current) return;
    
    try {
      if (micPermission === 'prompt') {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission('granted');
      }
      
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setMicPermission('denied');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const processVoiceCommand = (command: string) => {
    setIsProcessing(true);
    setTranscript('');
    
    // Simulate processing delay
    setTimeout(() => {
      const response = generateResponse(command.toLowerCase());
      setResponses(prev => [response, ...prev.slice(0, 4)]);
      speak(response.message);
      setIsProcessing(false);
    }, 1000);
  };

  const generateResponse = (command: string): AssistantResponse => {
    // Plant care commands with more human-like responses
    if (command.includes('water') || command.includes('irrigation')) {
      if (command.includes('how much') || command.includes('when')) {
        return {
          type: 'info',
          message: "Hey there! Your lettuce plants are looking good. They'll need about 150ml of water every 2 hours. I've got the next watering scheduled in 45 minutes - perfect timing!",
          icon: <Droplets className="h-4 w-4 text-blue-500" />,
          action: 'Check Water Schedule'
        };
      }
      return {
        type: 'success',
        message: "Absolutely! I'm starting the water cycle for Tower 1 right now. It'll run for about 3 minutes - just the right amount for healthy growth.",
        icon: <Droplets className="h-4 w-4 text-blue-500" />,
        action: 'Start Watering'
      };
    }
    
    if (command.includes('temperature') || command.includes('temp')) {
      return {
        type: 'info',
        message: "The temperature is sitting nicely at 22.4°C right now. That's perfect for your plants - they love that sweet spot between 20-24°C!",
        icon: <Thermometer className="h-4 w-4 text-orange-500" />,
        action: 'Temperature Details'
      };
    }
    
    if (command.includes('light') || command.includes('lighting')) {
      return {
        type: 'info',
        message: "Your plants are getting excellent light right now - 850 LUX is exactly what they need for optimal photosynthesis. They're practically glowing with health!",
        icon: <Sun className="h-4 w-4 text-yellow-500" />,
        action: 'Lighting Schedule'
      };
    }
    
    if (command.includes('health') || command.includes('status')) {
      return {
        type: 'success',
        message: "Everything's looking fantastic! All your plants are thriving with no issues detected. Their growth rate is actually above average - you're doing an amazing job!",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        action: 'Health Report'
      };
    }
    
    if (command.includes('harvest') || command.includes('ready')) {
      return {
        type: 'warning',
        message: "Exciting news! Your Lettuce Alpha in Tower 1 is almost ready for harvest - just 3 more days to go. I'll remind you when it's perfect timing!",
        icon: <Leaf className="h-4 w-4 text-green-500" />,
        action: 'Harvest Schedule'
      };
    }
    
    if (command.includes('problem') || command.includes('issue') || command.includes('help')) {
      return {
        type: 'suggestion',
        message: "I'm here to help! You can ask me about watering schedules, lighting conditions, temperature control, or plant health. What would you like to know?",
        icon: <Bot className="h-4 w-4 text-purple-500" />,
        action: 'Voice Commands'
      };
    }
    
    if (command.includes('nutrients') || command.includes('nutrient') || command.includes('fertilizer')) {
      return {
        type: 'info',
        message: "Your nutrient levels are well-balanced! pH is at 6.2 and EC at 1.8 - that's the ideal range for healthy growth. No adjustments needed right now.",
        icon: <Leaf className="h-4 w-4 text-green-500" />,
        action: 'Nutrient Status'
      };
    }
    
    if (command.includes('humidity')) {
      return {
        type: 'info',
        message: "Humidity is at a comfortable 65% - perfect for your leafy greens! This level helps prevent disease while keeping the plants happy and hydrated.",
        icon: <Droplets className="h-4 w-4 text-blue-500" />,
        action: 'Humidity Control'
      };
    }
    
    // Default response with personality
    return {
      type: 'info',
      message: `I heard you say "${command}" - I'm still learning! Try asking me about water, temperature, lighting, nutrients, or plant health. I love talking about plants!`,
      icon: <MessageCircle className="h-4 w-4 text-blue-500" />,
      action: 'Help Guide'
    };
  };

  const getResponseColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
      case 'suggestion': return 'border-purple-500/30 bg-purple-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80"
          >
            <Card className="organic-card border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-emerald-400" />
                    <span className="font-medium text-white">Plant Care Assistant</span>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                    Voice Enabled
                  </Badge>
                </div>
                
                {/* Voice Status */}
                <div className="mb-3 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      isListening ? 'bg-red-500 animate-pulse' :
                      isProcessing ? 'bg-yellow-500 animate-pulse' :
                      isSpeaking ? 'bg-blue-500 animate-pulse' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-gray-300">
                      {isListening ? 'Listening...' :
                       isProcessing ? 'Processing...' :
                       isSpeaking ? 'Speaking...' :
                       'Ready to help'}
                    </span>
                  </div>
                  {transcript && (
                    <div className="mt-1 text-xs text-emerald-300 italic">
                      "{transcript}"
                    </div>
                  )}
                </div>
                
                {/* Recent Responses */}
                {responses.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {responses.map((response, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-2 rounded-lg border ${getResponseColor(response.type)}`}
                      >
                        <div className="flex items-start space-x-2">
                          {response.icon}
                          <div className="flex-1 text-xs text-gray-200">
                            {response.message}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Voice Controls */}
                <div className="flex items-center justify-center space-x-2 mt-3 pt-3 border-t border-gray-700/50">
                  <Button
                    size="sm"
                    variant={isListening ? "destructive" : "default"}
                    onClick={isListening ? stopListening : startListening}
                    disabled={micPermission === 'denied' || isProcessing}
                    className="flex-1"
                  >
                    {isListening ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                    {isListening ? 'Stop' : 'Talk'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => synthRef.current?.cancel()}
                    disabled={!isSpeaking}
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                {micPermission === 'denied' && (
                  <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
                    Microphone access denied. Enable in browser settings to use voice commands.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Action Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 border-0"
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Waves className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
              >
                <Bot className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
};

export default VoiceCareAssistant;
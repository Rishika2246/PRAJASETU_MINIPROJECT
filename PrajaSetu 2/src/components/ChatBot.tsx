import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ArrowRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'instruction' | 'info' | 'quick-action';
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! I\'m your PrajaSetu AI Assistant. I can help you with voting, governance tracking, tax management, and civic services. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, ...botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): Message[] => {
    const input = userInput.toLowerCase();
    const responses: Message[] = [];
    
    // Voting and Elections - Detailed Instructions
    if (input.includes('how to vote') || input.includes('voting process') || input.includes('register to vote')) {
      responses.push({
        id: Date.now().toString(),
        text: `🗳️ **Online Voting Process - Step by Step**\n\n1. **Registration**: Go to Voting section → Click "Register for Online Voting"\n2. **Identity Verification**: Provide Aadhaar number and mobile verification\n3. **Biometric Setup**: Complete facial recognition setup\n4. **Election Access**: View upcoming elections in your constituency\n5. **Cast Vote**: Select candidates and confirm with OTP\n6. **Receipt**: Get digital voting receipt with tracking ID\n\n*Time required: 10-15 minutes*`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
      
      responses.push({
        id: (Date.now() + 1).toString(),
        text: `🔒 **Security Features**:\n• End-to-end encryption\n• Multi-factor authentication\n• Blockchain-based vote storage\n• Real-time fraud detection\n• Anonymous voting integrity`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'info'
      });
    }
    
    // Tax Payment - Detailed Instructions
    else if (input.includes('pay tax') || input.includes('tax payment') || input.includes('file tax')) {
      responses.push({
        id: Date.now().toString(),
        text: `💰 **Tax Payment Process**\n\n**Step 1: Access Tax Portal**\n• Go to "Tax Management" section\n• Click "File/Pay Taxes"\n\n**Step 2: Select Tax Type**\n• Income Tax\n• Property Tax\n• GST (for businesses)\n• Vehicle Tax\n\n**Step 3: Fill Details**\n• Upload required documents\n• Enter financial details\n• Verify pre-filled data\n\n**Step 4: Payment**\n• Choose payment method (UPI/Card/Net Banking)\n• Confirm payment\n• Download receipt\n\n*Documents needed: PAN, Aadhaar, Bank statements*`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // Promise Tracking - Detailed Instructions
    else if (input.includes('track promise') || input.includes('political promise') || input.includes('governance track')) {
      responses.push({
        id: Date.now().toString(),
        text: `📊 **Political Promise Tracking**\n\n**How to track promises:**\n\n1. **Select Representative**: Choose MP/MLA from your area\n2. **View Promises**: See election promises and manifestos\n3. **Progress Monitoring**: Real-time updates on:\n   • Infrastructure projects\n   • Social welfare schemes\n   • Policy implementations\n   • Budget allocations\n\n4. **Performance Metrics**:\n   • Completion percentage\n   • Timeline adherence\n   • Public feedback scores\n   • Budget utilization\n\n**Features**:\n• Automated progress updates\n• Public voting on performance\n• Transparency reports\n• Comparison with previous terms`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // Budget Management - Detailed Instructions
    else if (input.includes('budget') || input.includes('financial planning') || input.includes('manage money')) {
      responses.push({
        id: Date.now().toString(),
        text: `📈 **Personal Budget Management**\n\n**Setup Process:**\n\n1. **Income Tracking**:\n   • Add salary/income sources\n   • Set up automatic bank sync\n   • Categorize income streams\n\n2. **Expense Categories**:\n   • Taxes and government payments\n   • Utility bills\n   • Education and healthcare\n   • Investments and savings\n\n3. **Planning Tools**:\n   • Monthly budget planner\n   • Tax saving calculator\n   • Investment recommendations\n   • Bill payment reminders\n\n4. **Reports**:\n   • Spending analysis\n   • Tax optimization tips\n   • Savings progress\n   • Financial health score`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // Parliamentary Updates - Detailed Instructions
    else if (input.includes('parliament') || input.includes('law update') || input.includes('legislative')) {
      responses.push({
        id: Date.now().toString(),
        text: `🏛️ **Parliamentary Updates Access**\n\n**How to stay updated:**\n\n1. **Notification Settings**:\n   • Enable push notifications\n   • Choose update categories\n   • Set frequency preferences\n\n2. **Update Categories**:\n   • New bills introduced\n   • Law amendments\n   • Policy changes\n   • Committee reports\n   • Session updates\n\n3. **Simplified Summaries**:\n   • Easy-to-understand language\n   • Impact analysis\n   • Citizen implications\n   • Action required (if any)\n\n4. **Deep Dive Features**:\n   • Full bill text access\n   • MP voting records\n   • Public opinion polls\n   • Expert analysis`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // Cyber Crime Reporting - Detailed Instructions
    else if (input.includes('cyber crime') || input.includes('online fraud') || input.includes('report crime')) {
      responses.push({
        id: Date.now().toString(),
        text: `🛡️ **Cyber Crime Reporting Process**\n\n**Immediate Actions:**\n\n1. **Emergency Reporting**:\n   • Click "Report Cyber Crime" in Civic Awareness section\n   • Choose crime type:\n     - Online fraud\n     - Identity theft\n     - Harassment\n     - Financial scams\n\n2. **Evidence Collection**:\n   • Screenshots of conversations\n   • Transaction details\n   • Email headers\n   • Phone numbers\n\n3. **Quick Response**:\n   • Immediate case registration\n   • Dedicated investigating officer\n   • Real-time case tracking\n   • Legal guidance provided\n\n**Helplines**:\n• National Cyber Crime Helpline: 1930\n• Local police cyber cell\n• 24/7 Online support`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // Document Applications - Detailed Instructions
    else if (input.includes('document') || input.includes('certificate') || input.includes('apply for')) {
      responses.push({
        id: Date.now().toString(),
        text: `📄 **Document Application Process**\n\n**Available Documents**:\n• Birth/Death Certificate\n• Income Certificate\n• Domicile Certificate\n• Caste Certificate\n• Character Certificate\n\n**Application Steps:**\n\n1. **Select Document Type**: Choose from available certificates\n2. **Fill Application Form**: Auto-fill from your profile\n3. **Upload Documents**:\n   • Identity proof (Aadhaar)\n   • Address proof\n   • Supporting documents\n4. **Payment**: Pay applicable fees online\n5. **Track Status**: Real-time application tracking\n6. **Delivery**: Digital copy + Physical delivery options\n\n**Timeline**: 3-7 working days\n**Fees**: Varies by document (₹50-₹200)`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // Account Management - Detailed Instructions
    else if (input.includes('account') || input.includes('profile') || input.includes('update information')) {
      responses.push({
        id: Date.now().toString(),
        text: `👤 **Account Management Guide**\n\n**Profile Updates**:\n\n1. **Personal Information**:\n   • Name, Date of Birth\n   • Contact details\n   • Address updates\n\n2. **Document Management**:\n   • Upload new documents\n   • Verify existing ones\n   • Set expiration reminders\n\n3. **Security Settings**:\n   • Change password\n   • Two-factor authentication\n   • Login activity monitor\n   • Device management\n\n4. **Notification Preferences**:\n   • Email notifications\n   • SMS alerts\n   • Push notifications\n   • Frequency settings\n\n5. **Privacy Controls**:\n   • Data sharing preferences\n   • Visibility settings\n   • Download personal data`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // General Help
    else if (input.includes('help') || input.includes('support') || input.includes('what can you do')) {
      responses.push({
        id: Date.now().toString(),
        text: `🛠️ **Comprehensive Help Guide**\n\nI can provide detailed step-by-step instructions for:\n\n**🗳️ Voting & Elections**\n• Online voting registration\n• Election result access\n• Voter status checking\n\n**💰 Tax & Finance**\n• Tax filing and payments\n• Bill management\n• Budget planning\n\n**📊 Governance Tracking**\n• Political promise monitoring\n• Performance analytics\n• Transparency reports\n\n**🏛️ Parliamentary Updates**\n• Law change notifications\n• Bill tracking\n• Legislative summaries\n\n**🛡️ Civic Services**\n• Cyber crime reporting\n• Document applications\n• Rights awareness\n\n**👤 Account Management**\n• Profile updates\n• Security settings\n• Preference management\n\n*Ask about any specific process!*`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'instruction'
      });
    }
    
    // Voting General
    else if (input.includes('vote') || input.includes('voting') || input.includes('election')) {
      responses.push({
        id: Date.now().toString(),
        text: 'I can help you with secure online voting! You can:\n• Register for online voting\n• Check your voter status\n• View upcoming elections\n• Access election results in real-time\n• Learn about voting procedures\n\n**Ask me "how to vote online" for detailed step-by-step instructions!**',
        sender: 'bot',
        timestamp: new Date()
      });
    }
    
    // Tax General
    else if (input.includes('tax') || input.includes('bill') || input.includes('payment')) {
      responses.push({
        id: Date.now().toString(),
        text: 'I can assist with financial services:\n• Tax filing and payments\n• Utility bill management\n• Vehicle fine payments\n• Budget tracking\n\n**Ask "how to pay taxes" for complete payment instructions!**',
        sender: 'bot',
        timestamp: new Date()
      });
    }
    
    // Default response
    else {
      responses.push({
        id: Date.now().toString(),
        text: 'Thank you for your query! I can provide detailed step-by-step instructions for:\n\n• Online voting process\n• Tax payment procedures\n• Governance tracking\n• Document applications\n• Cyber crime reporting\n• Account management\n\nWhat specific process would you like me to explain?',
        sender: 'bot',
        timestamp: new Date()
      });
    }

    return responses;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Enhanced quick replies with action-oriented questions
  const quickReplies = [
    'How to vote online?',
    'Step by step tax payment',
    'Track political promises',
    'Apply for documents',
    'Report cyber crime',
    'Update my profile',
    'Set up budget planning',
    'Get parliamentary updates'
  ];

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const renderMessageContent = (message: Message) => {
    if (message.type === 'instruction') {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-blue-800">Step-by-Step Guide</span>
          </div>
          <p className="text-sm whitespace-pre-line text-gray-800">{message.text}</p>
        </div>
      );
    }

    if (message.type === 'info') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">ℹ️</span>
            </div>
            <span className="font-semibold text-green-800">Important Information</span>
          </div>
          <p className="text-sm whitespace-pre-line text-gray-800">{message.text}</p>
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-line">{message.text}</p>;
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Notification Dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">PrajaSetu AI</h3>
                <p className="text-sm opacity-90">Step-by-Step Guide Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  }`}>
                    {message.sender === 'user' ? 
                      <User className="w-4 h-4" /> : 
                      <Bot className="w-4 h-4" />
                    }
                  </div>
                  <div className={`rounded-2xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    {renderMessageContent(message)}
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white rounded-2xl p-3 border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for step-by-step instructions..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-center mt-2">
              <p className="text-xs text-gray-500">
                💡 Ask "how to..." for detailed instructions
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
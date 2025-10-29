import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Vote, Clock, CheckCircle, User, Calendar, MapPin, AlertTriangle, ArrowRight, XCircle, Loader2 } from 'lucide-react';
import { VotingSignup } from './VotingSignup';
import { LivenessCheck as RealLivenessCheck } from './LivenessCheck';
import { appendAnonymizedEntry, getTallies, getEntries, clearAll } from '../utils/indexedVotes';
import { deriveKeyFromPassphrase, encryptJSON } from '../utils/crypto';

interface User {
  name: string;
  email: string;
  mobile: string;
  citizenId: string;
}

interface VotingSystemProps {
  user?: User;
}

interface Election {
  id: number;
  title: string;
  constituency: string;
  endTime: string;
  status: 'active' | 'upcoming' | 'completed';
  color: string;
}

interface Candidate {
  id: number;
  name: string;
  party: string;
  partyColor: string;
  symbol: string;
  experience: string;
  promises: string[];
}

export function VotingSystem({ user }: VotingSystemProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isVotingRegistered, setIsVotingRegistered] = useState(false);
  const [votingRegistrationData, setVotingRegistrationData] = useState<any>(null);
  const [isLivenessVerified, setIsLivenessVerified] = useState(false);
  const [showLivenessCheck, setShowLivenessCheck] = useState(false);
  const [livenessCheckComplete, setLivenessCheckComplete] = useState(false);
  const [registration, setRegistration] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeElection, setActiveElection] = useState<Election | null>(null);

  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showVotesModal, setShowVotesModal] = useState(false);
  const [tallies, setTallies] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);

  // Mock candidates data
  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      party: "National Democratic Alliance",
      partyColor: "from-orange-500 to-orange-600",
      symbol: "Lotus",
      experience: "Former MP with 15 years of public service",
      promises: ["Better infrastructure", "Employment opportunities", "Healthcare reforms"]
    },
    {
      id: 2,
      name: "Priya Sharma",
      party: "United Progressive Front", 
      partyColor: "from-blue-500 to-blue-600",
      symbol: "Hand",
      experience: "Social activist and education reformer",
      promises: ["Education reforms", "Women empowerment", "Environmental protection"]
    },
    {
      id: 3,
      name: "Arun Patel",
      party: "Regional Development Party",
      partyColor: "from-green-500 to-green-600", 
      symbol: "Cycle",
      experience: "Local businessman and community leader",
      promises: ["Local business growth", "Road development", "Water supply improvement"]
    },
    {
      id: 4,
      name: "NOTA",
      party: "None of the Above",
      partyColor: "from-gray-500 to-gray-600",
      symbol: "None",
      experience: "Reject all candidates",
      promises: ["Register your dissent", "Demand better candidates", "Exercise your right"]
    }
  ];

  const activeElections: Election[] = [
    {
      id: 1,
      title: "Karnataka State Assembly Elections 2024",
      constituency: "Bangalore South",
      endTime: "2024-02-15T18:00:00",
      status: "active",
      color: "from-green-500 to-green-600"
    },
    {
      id: 2,
      title: "Municipal Corporation Elections",
      constituency: "Ward 42, Bangalore", 
      endTime: "2024-02-20T17:00:00",
      status: "upcoming",
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!activeElection) return '';
      
      const endTime = new Date(activeElection.endTime).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) return 'Election ended';

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    };

    setTimeRemaining(calculateTimeRemaining());
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000);

    return () => clearInterval(interval);
  }, [activeElection]);

  // Improved registration check
  const checkRegistrationStatus = () => {
    try {
      const registrationData = localStorage.getItem('voting-registration');
      const userData = localStorage.getItem('voting-user');
      
      console.log('Checking registration:', { registrationData, userData });

      if (registrationData && userData) {
        const regData = JSON.parse(registrationData);
        const userDataObj = JSON.parse(userData);
        
        setRegistration(regData);
        setCurrentUser(userDataObj);
        setIsVotingRegistered(true);
        setVotingRegistrationData(regData);
        
        // Set active election
        setActiveElection(activeElections[0]);
        
        // Don't check voting status initially - let them go through liveness first
        return true;
      } else if (user) {
        // If user prop is provided but no localStorage data
        setCurrentUser(user);
        setActiveElection(activeElections[0]);
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const isRegistered = checkRegistrationStatus();
    
    // Registration will be handled by the direct integration
    
    setIsLoading(false);
  }, [user]);

  // Load tallies when modal opens
  useEffect(() => {
    if (!showVotesModal) return;
    let mounted = true;
    (async () => {
      try {
        const t = await getTallies();
        const e = await getEntries();
        if (!mounted) return;
        setTallies(t);
        setEntries(e);
        console.log('Loaded tallies/entries', { t, e });
      } catch (err) {
        console.warn('Failed to load tallies:', err);
      }
    })();
    return () => { mounted = false; };
  }, [showVotesModal]);

  const exportIndexedEntries = async () => {
    try {
      const all = await getEntries();
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `indexed-entries-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export indexed entries:', err);
      alert('Failed to export entries. See console for details.');
    }
  };

  const exportIndexedTallies = async () => {
    try {
      const t = await getTallies();
      const blob = new Blob([JSON.stringify(t, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `indexed-tallies-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export tallies:', err);
      alert('Failed to export tallies. See console for details.');
    }
  };

  // Listen for registration events
  useEffect(() => {
    const handleRegistrationComplete = (e: any) => {
      try {
        console.log('Registration event received:', e);
        const detail = e?.detail;
        const reg = detail || JSON.parse(localStorage.getItem('voting-registration') || 'null');
        const usr = (reg && reg.user) || JSON.parse(localStorage.getItem('voting-user') || 'null');
        
        if (reg && usr) {
          console.log('Setting registration data:', { reg, usr });
          setRegistration(reg);
          setVotingRegistrationData(reg);
          setCurrentUser(usr);
          setIsVotingRegistered(true);
          setActiveElection(activeElections[0]);
        }
      } catch (err) {
        console.warn('Error handling voting:registered event:', err);
      }
    };

    // Listen for custom event
    window.addEventListener('voting:registered', handleRegistrationComplete as EventListener);
    
    // Also check localStorage periodically for changes
    const interval = setInterval(() => {
      checkRegistrationStatus();
    }, 2000);

    return () => {
      window.removeEventListener('voting:registered', handleRegistrationComplete as EventListener);
      clearInterval(interval);
    };
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate || !currentUser) return;
    
    // Double-check if user has already voted
    if (hasVoted) {
      alert('You have already voted in this election.');
      return;
    }
    
    setIsVoting(true);
    
    // Simulate voting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  // Record vote in localStorage (store id + name)
  const candidate = candidates.find(c => c.id === selectedCandidate);
  const candidateName = candidate ? candidate.name : String(selectedCandidate);
  localStorage.setItem(`hasVoted-${currentUser.citizenId}`, 'true');
  localStorage.setItem(`vote-${currentUser.citizenId}`, JSON.stringify({ candidateId: selectedCandidate, candidateName }));
  localStorage.setItem(`voteTime-${currentUser.citizenId}`, new Date().toISOString());

    // Also append to an aggregated JSON document of votes for export/analysis.
    // NOTE: This is for demo/testing only. In a real voting system you must not store
    // voter choices in plaintext or on the client. Use a secure backend, encryption,
    // anonymization, and legal safeguards instead.
    try {
      const votesKey = 'votes.json';
  const existing = JSON.parse(localStorage.getItem(votesKey) || '[]');
  existing.push({ citizenId: currentUser.citizenId, candidateId: selectedCandidate, candidateName, time: new Date().toISOString() });
      localStorage.setItem(votesKey, JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to append to aggregated votes JSON:', err);
    }

    // Append anonymized entry to IndexedDB tallies (no citizenId)
    try {
  await appendAnonymizedEntry({ candidateId: selectedCandidate, candidateName, time: new Date().toISOString() });
      const t = await getTallies();
      setTallies(t);
    } catch (err) {
      console.warn('Failed to append anonymized entry:', err);
    }

    // Encrypt full vote payload and POST to demo server (insecure demo only)
    try {
      const pass = localStorage.getItem('votes:passphrase') || 'demo-passphrase';
      const { key, salt } = await deriveKeyFromPassphrase(pass);
  const payload = { citizenId: currentUser.citizenId, candidateId: selectedCandidate, candidateName, time: new Date().toISOString(), salt: Array.from(new Uint8Array(salt)) };
      const enc = await encryptJSON(key, payload);
      // send to server
      fetch('http://localhost:4000/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iv: enc.iv, ciphertext: enc.ciphertext })
      }).then(r => r.json()).then(j => console.log('Server response:', j)).catch(e => console.warn('Post failed:', e));
    } catch (err) {
      console.warn('Failed to encrypt/send vote:', err);
    }
    
    setHasVoted(true);
    setIsVoting(false);
    setVoteConfirmed(true);
    setShowVoteSuccess(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowVoteSuccess(false);
    }, 5000);
  };

  const handleLivenessSuccess = (finalFaceImage?: string | null) => {
    console.log('Liveness check completed');
    setIsLivenessVerified(true);
    setShowLivenessCheck(false);
    setLivenessCheckComplete(true);
    
    // Check if user has already voted AFTER liveness verification
    if (currentUser) {
      const hasAlreadyVoted = localStorage.getItem(`hasVoted-${currentUser.citizenId}`);
      setHasVoted(!!hasAlreadyVoted);
    }
  };

  const handleLivenessCancel = () => {
    setShowLivenessCheck(false);
  };

  const startVotingProcess = () => {
    if (!isVotingRegistered) {
      // This shouldn't happen as registration is required to reach this point
      return;
    }
    
    // Always start with liveness check, regardless of voting status
    setShowLivenessCheck(true);
  };



  // Export aggregated votes JSON from localStorage
  const exportVotes = () => {
    try {
      const votesKey = 'votes.json';
      const data = localStorage.getItem(votesKey) || '[]';
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `votes-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export votes:', err);
      alert('Failed to export votes. See console for details.');
    }
  };

  const clearAggregatedVotes = () => {
    if (!confirm('Clear aggregated votes stored in localStorage? This cannot be undone.')) return;
    localStorage.removeItem('votes.json');
    alert('Aggregated votes cleared.');
  };

  const resetRegistration = () => {
    localStorage.removeItem('voting-registration');
    localStorage.removeItem('voting-user');
    setRegistration(null);
    setCurrentUser(user || null);
    setIsVotingRegistered(false);
    setVotingRegistrationData(null);
    setHasVoted(false);
    setSelectedCandidate(null);
    // Reload to show registration form
    window.location.reload();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-blue-500/20">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">Loading Voting System...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show clean registration interface
  if (!currentUser || !isVotingRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        {/* Clean Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center">
                <Vote className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Digital Voting System</h1>
                <p className="text-sm text-slate-600">Secure • Transparent • Democratic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
          <div className="w-full max-w-md">
            <VotingSignup
              user={user || { name: '', email: '', mobile: '', citizenId: '' }}
              onVotingRegistrationComplete={(registrationData: any) => {
                console.log('Registration completed:', registrationData);
                // Store in localStorage
                localStorage.setItem('voting-registration', JSON.stringify(registrationData));
                localStorage.setItem('voting-user', JSON.stringify(registrationData.user));
                
                // Update state
                setRegistration(registrationData);
                setVotingRegistrationData(registrationData);
                setCurrentUser(registrationData.user);
                setIsVotingRegistered(true);

                
                // Dispatch custom event
                window.dispatchEvent(new CustomEvent('voting:registered', { 
                  detail: registrationData 
                }));
              }}
              onCancel={() => {
                // For now, just show the registration form again
                window.location.reload();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Success Message */}
      {showVoteSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert className="border-green-200 bg-green-50 shadow-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Vote recorded successfully!</strong> Thank you for participating in democracy.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Liveness Check Modal */}
      {showLivenessCheck && (
        <RealLivenessCheck
          onSuccess={handleLivenessSuccess}
          onCancel={handleLivenessCancel}
          userName={currentUser.name}
        />
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Digital Voting System</h1>
                <p className="text-slate-600">Secure • Transparent • Accessible</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge className="bg-gradient-to-r from-secondary to-green-600 text-white border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Voter
                </Badge>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => { setShowVotesModal(true); }} variant="outline">View Votes</Button>
                  <Button size="sm" onClick={() => exportVotes()} variant="ghost">Export</Button>
                  <Button size="sm" onClick={() => clearAggregatedVotes()} variant="destructive">Clear</Button>
                </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-sm text-slate-600">Voter ID: {registration?.voterID}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="border-0 shadow-xl shadow-blue-500/10 bg-gradient-to-br from-white to-blue-50/50 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Welcome, {currentUser.name}! 👋
                </h2>
                <p className="text-slate-600 text-lg mb-4">
                  You are now verified and ready to participate in the democratic process.
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Registration Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Eligible to Vote</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-gradient-to-r from-accent to-blue-600 text-white border-0 text-lg px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure Session
                </Badge>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show election info and profile only when NOT in voting mode */}
        {!isLivenessVerified && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Election Info */}
            <Card className="lg:col-span-2 border-0 shadow-xl shadow-green-500/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="h-6 w-6 text-green-600" />
                  Active Election
                </CardTitle>
                <CardDescription>
                  Cast your vote in the ongoing election
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeElection && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`bg-gradient-to-r ${activeElection.color} text-white border-0`}>
                        {activeElection.status === 'active' ? 'Live Now' : 'Upcoming'}
                      </Badge>
                      <div className="flex items-center gap-2 text-green-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">Ends: {new Date(activeElection.endTime).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{activeElection.title}</h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{activeElection.constituency}</span>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        onClick={startVotingProcess}
                        disabled={activeElection.status !== 'active'}
                        className="w-full h-16 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Vote className="w-5 h-5" />
                          </div>
                          <span>{activeElection.status === 'active' ? 'Vote Now' : 'Voting Starts Soon'}</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </Button>
                      {activeElection.status === 'active' && (
                        <div className="text-center text-sm text-slate-600">
                          Time remaining: <span className="font-semibold text-green-600">{timeRemaining}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Voting Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-slate-800">68.2%</div>
                    <div className="text-sm text-slate-600">Voter Turnout</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-slate-800">{candidates.length}</div>
                    <div className="text-sm text-slate-600">Candidates</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-slate-800">{timeRemaining}</div>
                    <div className="text-sm text-slate-600">Time Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voter Profile */}
            <Card className="border-0 shadow-xl shadow-purple-500/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{currentUser.name}</p>
                      <p className="text-sm text-slate-600">Verified Voter</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Voter ID:</span>
                      <span className="font-mono font-semibold">{registration?.voterID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Constituency:</span>
                      <span className="font-semibold">Bangalore South</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Voting History */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800">Voting History</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm">2023 State Elections</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Voted
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm">2024 Current Election</span>
                      <Badge variant="secondary" className={hasVoted ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                        {hasVoted ? 'Voted' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Simplified Voting Interface - Show when liveness is verified */}
        {isLivenessVerified && activeElection?.status === 'active' && (
          <div className="space-y-8">
            {/* Minimal Election Info Header */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-1">
                      {hasVoted ? 'Your Vote Has Been Cast' : 'Cast Your Vote'}
                    </h2>
                    <p className="text-slate-600 text-lg">{activeElection.title}</p>
                    <p className="text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {activeElection.constituency}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-gradient-to-r from-secondary to-green-600 text-white border-0 mb-2">
                      Live Election
                    </Badge>
                    <p className="text-sm text-slate-600">
                      Time remaining: <span className="font-semibold text-primary">{timeRemaining}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidates Grid - Clean and Focused */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {candidates.map((candidate) => (
                <Card 
                  key={candidate.id}
                  className={`${hasVoted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} transition-all duration-300 ${
                    !hasVoted && 'hover:shadow-xl'
                  } ${
                    selectedCandidate === candidate.id 
                      ? 'border-2 border-primary shadow-xl shadow-primary/20 bg-gradient-to-br from-orange-50 to-white scale-[1.02]' 
                      : 'border border-slate-200 hover:border-primary/50 hover:scale-[1.01]'
                  }`}
                  onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{candidate.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`bg-gradient-to-r ${candidate.partyColor} text-white border-0 text-sm px-3 py-1`}>
                            {candidate.party}
                          </Badge>
                          {hasVoted && localStorage.getItem(`vote-${currentUser.citizenId}`) && 
                           JSON.parse(localStorage.getItem(`vote-${currentUser.citizenId}`)!).candidateId === candidate.id && (
                            <Badge className="bg-gradient-to-r from-secondary to-green-600 text-white border-0 text-sm px-3 py-1 animate-pulse">
                              ✓ VOTED
                            </Badge>
                          )}
                        </div>
                      </div>
                      {selectedCandidate === candidate.id && !hasVoted && (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                      {hasVoted && localStorage.getItem(`vote-${currentUser.citizenId}`) && 
                       JSON.parse(localStorage.getItem(`vote-${currentUser.citizenId}`)!).candidateId === candidate.id && (
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{candidate.symbol === 'Lotus' ? '🪷' : candidate.symbol === 'Hand' ? '✋' : candidate.symbol === 'Cycle' ? '🚲' : '❌'}</span>
                      </div>
                      <span className="font-medium">Symbol: {candidate.symbol}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Vote Confirmation */}
            {selectedCandidate && !hasVoted && (
              <Card className="max-w-2xl mx-auto border-2 border-primary bg-gradient-to-br from-orange-50 to-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Vote className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Confirm Your Vote</h3>
                  <div className="bg-white rounded-lg p-4 mb-6 border border-orange-200">
                    <p className="text-lg text-slate-700 mb-1">
                      <span className="font-bold text-2xl text-slate-800">{candidates.find(c => c.id === selectedCandidate)?.name}</span>
                    </p>
                    <p className="text-primary font-semibold">
                      {candidates.find(c => c.id === selectedCandidate)?.party}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">
                    Once confirmed, your vote cannot be changed. This is your final selection.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={handleVote}
                      disabled={isVoting}
                      className="h-14 px-8 bg-gradient-to-r from-secondary to-green-600 hover:from-green-600 hover:to-secondary text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isVoting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Casting Vote...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Vote className="w-5 h-5" />
                          Confirm & Cast Vote
                        </div>
                      )}
                    </Button>
                    <Button 
                      onClick={() => setSelectedCandidate(null)}
                      variant="outline"
                      className="h-14 px-8 border-2 border-slate-300 hover:border-slate-400"
                      disabled={isVoting}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Change Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Already Voted Notice - Show above candidates if user has voted */}
            {hasVoted && !voteConfirmed && (
              <Card className="max-w-4xl mx-auto border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">You Have Already Voted</h3>
                      <p className="text-slate-600">Your vote was recorded on {localStorage.getItem(`voteTime-${currentUser.citizenId}`) ? 
                        new Date(localStorage.getItem(`voteTime-${currentUser.citizenId}`)!).toLocaleDateString() : 
                        'today'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-amber-800 font-medium">You can view the candidates below, but cannot vote again.</p>
                    <Button
                      onClick={() => {
                        setIsLivenessVerified(false);
                        setShowLivenessCheck(false);
                        setSelectedCandidate(null);
                        setHasVoted(false);
                      }}
                      variant="outline"
                      className="border-amber-400 text-amber-700 hover:bg-amber-50"
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vote Success Message - Show after new vote is cast */}
            {voteConfirmed && (
              <Card className="max-w-2xl mx-auto border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">Vote Successfully Cast!</h3>
                  <div className="bg-green-100 rounded-lg p-6 mb-6 border border-green-200">
                    <p className="text-green-800 font-semibold text-lg mb-2">Thank you for participating in democracy</p>
                    <p className="text-green-700">Your vote has been securely recorded and encrypted</p>
                    <div className="mt-4 text-sm text-green-600">
                      <p>Voted on: {localStorage.getItem(`voteTime-${currentUser.citizenId}`) ? 
                        new Date(localStorage.getItem(`voteTime-${currentUser.citizenId}`)!).toLocaleString() : 
                        'Today'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
                    <p className="text-slate-600 text-sm">
                      🔒 Your vote is anonymous and secure. No one can see who you voted for.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsLivenessVerified(false);
                      setShowLivenessCheck(false);
                      setSelectedCandidate(null);
                      setVoteConfirmed(false);
                    }}
                    className="w-full h-12 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-semibold"
                  >
                    Return to Voting Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Security Features - Only show when not in voting mode */}
        {!isLivenessVerified && (
          <Card className="border-0 shadow-xl shadow-slate-900/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-600" />
                Security Features
              </CardTitle>
              <CardDescription>
                Your vote is protected by multiple layers of security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Identity Verification</h4>
                  <p className="text-sm text-slate-600">Multi-step registration ensures only eligible voters can participate</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">End-to-End Encryption</h4>
                  <p className="text-sm text-slate-600">Your vote is encrypted and cannot be tampered with</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Anonymous Voting</h4>
                  <p className="text-sm text-slate-600">Your identity is separated from your vote choice</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Vote className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">One Vote Per Person</h4>
                  <p className="text-sm text-slate-600">System ensures each verified voter can only vote once</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>© 2024 Digital Voting System. This is a demonstration system for educational purposes.</p>
          <p className="mt-1">All votes are recorded locally and are not part of any real election.</p>
        </div>
      </div>
    </div>
  );
}
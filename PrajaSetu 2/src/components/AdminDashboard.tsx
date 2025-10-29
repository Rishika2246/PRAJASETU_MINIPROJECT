import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Shield,
    Vote,
    Users,
    User,
    BarChart3,
    TrendingUp,
    Database,
    Lock,
    Eye,
    EyeOff,
    Download,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    Calendar,
    FileText,
    Settings,
    Activity,
    Globe,
    Zap,
    Server,
    Monitor,
    UserCheck,
    History,
    PieChart,
    LineChart,
    BarChart,
    Target,
    Flag,
    Crown,
    Key,
    MessageSquare,
    Phone,
    Mail,
    Search,
    Filter,
    ExternalLink,
    UserX,
    Trash2,
    Edit,
    Plus,
    X
} from 'lucide-react';

interface AdminUser {
    id: string;
    name: string;
    role: 'super_admin' | 'election_commissioner' | 'security_officer';
    clearanceLevel: number;
    lastLogin: string;
}

interface ElectionData {
    id: string;
    name: string;
    type: 'general' | 'state' | 'local';
    status: 'active' | 'completed' | 'upcoming';
    startDate: string;
    endDate: string;
    totalVoters: number;
    votescast: number;
    turnoutPercentage: number;
    constituencies: number;
}

interface SecurityMetrics {
    totalAttempts: number;
    successfulLogins: number;
    failedAttempts: number;
    suspiciousActivity: number;
    blockedIPs: string[];
    encryptionStatus: 'active' | 'compromised';
    lastSecurityScan: string;
}

interface GovernmentData {
    budgetAllocation: {
        defense: number;
        healthcare: number;
        education: number;
        infrastructure: number;
        socialWelfare: number;
    };
    economicIndicators: {
        gdp: number;
        inflation: number;
        unemployment: number;
        fiscalDeficit: number;
    };
    demographicData: {
        totalPopulation: number;
        eligibleVoters: number;
        registeredVoters: number;
        ageDistribution: {
            '18-25': number;
            '26-35': number;
            '36-50': number;
            '51-65': number;
            '65+': number;
        };
    };
}

interface CitizenData {
    id: string;
    name: string;
    email: string;
    mobile: string;
    citizenId: string;
    registrationDate: string;
    lastLogin: string;
    votingStatus: 'voted' | 'registered' | 'not_registered';
    constituency: string;
    address: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    complaints: ComplaintData[];
    serviceRequests: ServiceRequest[];
    biometricVerified: boolean;
    livenessVerified: boolean;
}

interface ComplaintData {
    id: string;
    title: string;
    category: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    priority: 'low' | 'medium' | 'high' | 'critical';
    dateSubmitted: string;
    department: string;
    location: string;
    citizenId: string;
}

interface ServiceRequest {
    id: string;
    type: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'in_progress';
    dateRequested: string;
    fee: number;
    documents: string[];
    citizenId: string;
}

interface VotingData {
    totalVotes: number;
    candidateResults: {
        candidateId: number;
        name: string;
        party: string;
        votes: number;
        percentage: number;
    }[];
    turnoutByConstituency: {
        constituency: string;
        totalVoters: number;
        votescast: number;
        turnoutPercentage: number;
    }[];
    hourlyVotingPattern: {
        hour: number;
        votes: number;
    }[];
    demographicBreakdown: {
        ageGroup: string;
        votes: number;
        percentage: number;
    }[];
}

interface AdminDashboardProps {
    onBackToLanding?: () => void;
}

export function AdminDashboard({ onBackToLanding }: AdminDashboardProps = {}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loginForm, setLoginForm] = useState({ username: '', password: '', securityKey: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCitizen, setSelectedCitizen] = useState<CitizenData | null>(null);
    const [votingData, setVotingData] = useState<VotingData | null>(null);
    const [citizensData, setCitizensData] = useState<CitizenData[]>([]);
    const [complaintsData, setComplaintsData] = useState<ComplaintData[]>([]);
    const [backendVotes, setBackendVotes] = useState<any[]>([]);

    // Mock data - In real implementation, this would come from secure APIs
    const [electionData] = useState<ElectionData[]>([
        {
            id: 'GE2024',
            name: 'General Elections 2024',
            type: 'general',
            status: 'active',
            startDate: '2024-04-19',
            endDate: '2024-06-01',
            totalVoters: 968000000,
            votescast: 658320000,
            turnoutPercentage: 68.2,
            constituencies: 543
        },
        {
            id: 'KA2023',
            name: 'Karnataka Assembly Elections 2023',
            type: 'state',
            status: 'completed',
            startDate: '2023-05-10',
            endDate: '2023-05-10',
            totalVoters: 50000000,
            votescast: 36500000,
            turnoutPercentage: 73.0,
            constituencies: 224
        }
    ]);

    const [securityMetrics] = useState<SecurityMetrics>({
        totalAttempts: 1247893,
        successfulLogins: 1245621,
        failedAttempts: 2272,
        suspiciousActivity: 47,
        blockedIPs: ['192.168.1.100', '10.0.0.45', '172.16.0.23'],
        encryptionStatus: 'active',
        lastSecurityScan: '2024-02-15T14:30:00Z'
    });

    const [governmentData] = useState<GovernmentData>({
        budgetAllocation: {
            defense: 6210000000000, // ₹6.21 lakh crore INR
            healthcare: 900000000000, // ₹90,000 crore INR  
            education: 1120000000000, // ₹1.12 lakh crore INR
            infrastructure: 2700000000000, // ₹2.7 lakh crore INR
            socialWelfare: 3500000000000 // ₹3.5 lakh crore INR
        },
        economicIndicators: {
            gdp: 27500000000000, // ₹275 lakh crore INR (~$3.7 trillion USD)
            inflation: 5.2,
            unemployment: 7.8,
            fiscalDeficit: 6.4
        },
        demographicData: {
            totalPopulation: 1420000000,
            eligibleVoters: 968000000,
            registeredVoters: 912000000,
            ageDistribution: {
                '18-25': 18.5,
                '26-35': 24.2,
                '36-50': 28.1,
                '51-65': 19.8,
                '65+': 9.4
            }
        }
    });

    // Mock citizen data
    const mockCitizens: CitizenData[] = [
        {
            id: 'CIT001',
            name: 'Rajesh Kumar Singh',
            email: 'rajesh.kumar@email.com',
            mobile: '+91-9876543210',
            citizenId: 'AADHAAR-123456789012',
            registrationDate: '2024-01-15T10:30:00Z',
            lastLogin: '2024-02-20T14:22:00Z',
            votingStatus: 'voted',
            constituency: 'Mumbai North',
            address: '123 MG Road, Andheri West, Mumbai, Maharashtra 400001',
            age: 34,
            gender: 'male',
            biometricVerified: true,
            livenessVerified: true,
            complaints: [],
            serviceRequests: [
                {
                    id: 'SRV-001',
                    type: 'Birth Certificate',
                    status: 'completed',
                    dateRequested: '2024-01-20T11:00:00Z',
                    fee: 50,
                    documents: ['birth_certificate.pdf'],
                    citizenId: 'CIT001'
                },
                {
                    id: 'SRV-006',
                    type: 'Passport Verification',
                    status: 'approved',
                    dateRequested: '2024-02-10T14:30:00Z',
                    fee: 200,
                    documents: ['passport_verification.pdf'],
                    citizenId: 'CIT001'
                }
            ]
        },
        {
            id: 'CIT002',
            name: 'Priya Sharma',
            email: 'priya.sharma@email.com',
            mobile: '+91-9876543211',
            citizenId: 'AADHAAR-123456789013',
            registrationDate: '2024-01-18T15:45:00Z',
            lastLogin: '2024-02-21T09:30:00Z',
            votingStatus: 'voted',
            constituency: 'Delhi Central',
            address: '456 Connaught Place, New Delhi, Delhi 110001',
            age: 28,
            gender: 'female',
            biometricVerified: true,
            livenessVerified: true,
            complaints: [],
            serviceRequests: [
                {
                    id: 'SRV-002',
                    type: 'Property Tax Payment',
                    status: 'completed',
                    dateRequested: '2024-02-15T16:30:00Z',
                    fee: 1500,
                    documents: ['property_tax_receipt.pdf'],
                    citizenId: 'CIT002'
                }
            ]
        },
        {
            id: 'CIT003',
            name: 'Arun Patel',
            email: 'arun.patel@email.com',
            mobile: '+91-9876543212',
            citizenId: 'AADHAAR-123456789014',
            registrationDate: '2024-02-01T12:20:00Z',
            lastLogin: '2024-02-19T18:45:00Z',
            votingStatus: 'voted',
            constituency: 'Bangalore South',
            address: '789 Brigade Road, Bangalore, Karnataka 560001',
            age: 42,
            gender: 'male',
            biometricVerified: true,
            livenessVerified: true,
            complaints: [],
            serviceRequests: [
                {
                    id: 'SRV-003',
                    type: 'Trade License',
                    status: 'pending',
                    dateRequested: '2024-02-18T10:15:00Z',
                    fee: 1500,
                    documents: ['trade_license_application.pdf'],
                    citizenId: 'CIT003'
                }
            ]
        },
        {
            id: 'CIT004',
            name: 'Sunita Devi',
            email: 'sunita.devi@email.com',
            mobile: '+91-9876543213',
            citizenId: 'AADHAAR-123456789015',
            registrationDate: '2024-01-25T09:15:00Z',
            lastLogin: '2024-02-21T11:45:00Z',
            votingStatus: 'voted',
            constituency: 'Kolkata East',
            address: '321 Park Street, Kolkata, West Bengal 700016',
            age: 45,
            gender: 'female',
            biometricVerified: true,
            livenessVerified: true,
            complaints: [],
            serviceRequests: [
                {
                    id: 'SRV-004',
                    type: 'Water Connection',
                    status: 'approved',
                    dateRequested: '2024-02-08T13:20:00Z',
                    fee: 2000,
                    documents: ['water_connection_approval.pdf'],
                    citizenId: 'CIT004'
                }
            ]
        },
        {
            id: 'CIT005',
            name: 'Mohammed Ali Khan',
            email: 'mohammed.ali@email.com',
            mobile: '+91-9876543214',
            citizenId: 'AADHAAR-123456789016',
            registrationDate: '2024-02-05T16:30:00Z',
            lastLogin: '2024-02-20T20:15:00Z',
            votingStatus: 'registered',
            constituency: 'Hyderabad Central',
            address: '654 Charminar Road, Hyderabad, Telangana 500002',
            age: 38,
            gender: 'male',
            biometricVerified: true,
            livenessVerified: false,
            complaints: [],
            serviceRequests: [
                {
                    id: 'SRV-005',
                    type: 'Driving License Renewal',
                    status: 'in_progress',
                    dateRequested: '2024-02-19T12:00:00Z',
                    fee: 500,
                    documents: ['dl_renewal_form.pdf'],
                    citizenId: 'CIT005'
                }
            ]
        }
    ];

    // Mock complaints data
    const mockComplaints: ComplaintData[] = [
        {
            id: 'CMP-001',
            title: 'Broken Street Light on MG Road',
            category: 'Infrastructure',
            description: 'Street light has been non-functional for 2 weeks causing safety issues',
            status: 'in_progress',
            priority: 'high',
            dateSubmitted: '2024-02-10T09:15:00Z',
            department: 'Public Works Department',
            location: 'MG Road, Mumbai',
            citizenId: 'CIT001'
        },
        {
            id: 'CMP-002',
            title: 'Garbage Collection Delay',
            category: 'Sanitation',
            description: 'Garbage not collected for 3 days in our residential area',
            status: 'resolved',
            priority: 'medium',
            dateSubmitted: '2024-02-05T07:30:00Z',
            department: 'Municipal Services',
            location: 'Brigade Road, Bangalore',
            citizenId: 'CIT003'
        },
        {
            id: 'CMP-003',
            title: 'Water Supply Shortage',
            category: 'Water Supply',
            description: 'No water supply for the past 4 days in our locality',
            status: 'pending',
            priority: 'critical',
            dateSubmitted: '2024-02-18T06:00:00Z',
            department: 'Water Board',
            location: 'CP Road, New Delhi',
            citizenId: 'CIT002'
        },
        {
            id: 'CMP-004',
            title: 'Road Pothole Issue',
            category: 'Roads',
            description: 'Large pothole causing traffic issues and vehicle damage',
            status: 'in_progress',
            priority: 'high',
            dateSubmitted: '2024-02-12T14:20:00Z',
            department: 'Public Works Department',
            location: 'Ring Road, Bangalore',
            citizenId: 'CIT003'
        },
        {
            id: 'CMP-005',
            title: 'Noise Pollution from Construction',
            category: 'Environment',
            description: 'Construction work happening during night hours violating noise norms',
            status: 'pending',
            priority: 'medium',
            dateSubmitted: '2024-02-20T22:30:00Z',
            department: 'Pollution Control Board',
            location: 'Bandra West, Mumbai',
            citizenId: 'CIT001'
        }
    ];

    // Mock backend votes data (simulating encrypted votes)
    const mockBackendVotes = [
        {
            id: 1,
            receivedAt: '2024-02-21T08:30:00Z',
            vote: {
                iv: 'rBJK3oItTFmzY5dh',
                ciphertext: '2PJ79/LwDH6UVfO+SedQNmNDbfPnnd8PEwdspeYpYF9kOuQiRHeprFd8Eeb0OFA9aQ8OVuDMuitFHnLYdK5qz0Za24dEXyFSl7xfl46CThMtlTtulwMJer8/fdjft9RrIvccytjMVxbLVY/mnW0d3kNLtc43yQONnvDNHS4TfEFxlU4jwho24aC4Y10GSexd2k/XVyDIgeEqWTVAzVw=',
                candidateId: 1,
                constituency: 'Mumbai North',
                timestamp: '2024-02-21T08:30:00Z'
            }
        },
        {
            id: 2,
            receivedAt: '2024-02-21T09:15:00Z',
            vote: {
                iv: 'aBCD4pJuUGnzX6ei',
                ciphertext: '3QK80/MxEI7VWgP+TfeROnOEcgQood9QFxetqfZqZG0lPvRjSIfqsGe9Ffc1PGB0bR9PWvENvjuGIoMZeL6r01ab35eFYzGTm8ygl57DUiNuMUuvmxNKfs9/gejgu0SsJwddztjNWycMWZ/noX1e4lOMud54zRPOowEOIT5UgFGymV5kxip35bD5Z21HTfye3l/YWzEJhfFrXUWB0Wx=',
                candidateId: 2,
                constituency: 'Delhi Central',
                timestamp: '2024-02-21T09:15:00Z'
            }
        },
        {
            id: 3,
            receivedAt: '2024-02-21T10:45:00Z',
            vote: {
                iv: 'cDEF5qKvVHozY7fj',
                ciphertext: '4RL91/NyFJ8WXhQ+UgfSPoQFdhRppf0RGyfusgazH1mQwSjTJgrsHf0Ggd2QHC1cS0AQXwFOwkvHJpNafM7s12bc46gGZzHUn9zhl68EViOvNVvwnxOLgt0/hfkhu1TtKxeezukOXzdNXa/opY2f5mPNve65zSQPpxFPJU6VhGHznW6lyiq46cE6a32IUgzf4m/ZXzFKigGsYVXC1Xy=',
                candidateId: 1,
                constituency: 'Bangalore South',
                timestamp: '2024-02-21T10:45:00Z'
            }
        }
    ];

    // Mock voting data - Enhanced for better visualizations
    const mockVotingData: VotingData = {
        totalVotes: 2847,
        candidateResults: [
            { candidateId: 1, name: 'Rajesh Kumar', party: 'National Democratic Alliance', votes: 1265, percentage: 44.4 },
            { candidateId: 2, name: 'Priya Sharma', party: 'United Progressive Front', votes: 967, percentage: 34.0 },
            { candidateId: 3, name: 'Arun Patel', party: 'Regional Development Party', votes: 487, percentage: 17.1 },
            { candidateId: 4, name: 'NOTA', party: 'None of the Above', votes: 128, percentage: 4.5 }
        ],
        turnoutByConstituency: [
            { constituency: 'Mumbai North', totalVoters: 850, votescast: 623, turnoutPercentage: 73.3 },
            { constituency: 'Delhi Central', totalVoters: 920, votescast: 742, turnoutPercentage: 80.7 },
            { constituency: 'Bangalore South', totalVoters: 780, votescast: 587, turnoutPercentage: 75.3 },
            { constituency: 'Kolkata East', totalVoters: 690, votescast: 578, turnoutPercentage: 83.8 },
            { constituency: 'Hyderabad Central', totalVoters: 760, votescast: 317, turnoutPercentage: 41.7 }
        ],
        hourlyVotingPattern: [
            { hour: 8, votes: 145 },
            { hour: 9, votes: 287 },
            { hour: 10, votes: 423 },
            { hour: 11, votes: 512 },
            { hour: 12, votes: 298 },
            { hour: 13, votes: 189 },
            { hour: 14, votes: 267 },
            { hour: 15, votes: 334 },
            { hour: 16, votes: 289 },
            { hour: 17, votes: 103 }
        ],
        demographicBreakdown: [
            { ageGroup: '18-25', votes: 398, percentage: 14.0 },
            { ageGroup: '26-35', votes: 825, percentage: 29.0 },
            { ageGroup: '36-50', votes: 967, percentage: 34.0 },
            { ageGroup: '51-65', votes: 512, percentage: 18.0 },
            { ageGroup: '65+', votes: 145, percentage: 5.0 }
        ]
    };

    // Load all data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            setCitizensData(mockCitizens);
            setVotingData(mockVotingData);
            setComplaintsData(mockComplaints);
            setBackendVotes(mockBackendVotes);
        }
    }, [isAuthenticated]);

    const handleLogin = async () => {
        setIsLoading(true);

        // Simulate secure authentication
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Demo mode - accept any credentials
        if (loginForm.username.trim() && loginForm.password.trim() && loginForm.securityKey.trim()) {
            // Determine admin role based on username or default to super admin
            let adminRole: 'super_admin' | 'security_officer' | 'election_commissioner' = 'super_admin';
            let adminName = 'Demo Administrator';
            let clearanceLevel = 10;

            if (loginForm.username.toLowerCase().includes('security')) {
                adminRole = 'security_officer';
                adminName = 'Security Administrator';
                clearanceLevel = 8;
            } else if (loginForm.username.toLowerCase().includes('election')) {
                adminRole = 'election_commissioner';
                adminName = 'Election Commissioner';
                clearanceLevel = 9;
            } else {
                adminName = `Admin ${loginForm.username}`;
            }

            setAdminUser({
                id: 'DEMO-' + Date.now(),
                name: adminName,
                role: adminRole,
                clearanceLevel: clearanceLevel,
                lastLogin: new Date().toISOString()
            });
            setIsAuthenticated(true);
        } else {
            alert('Please fill in all fields to access the demo');
        }

        setIsLoading(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-2xl bg-slate-800/90 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-white">Government Admin Portal</CardTitle>
                        <CardDescription className="text-slate-300">
                            Classified • Top Secret • Authorized Personnel Only
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert className="border-red-500/50 bg-red-900/20">
                            <Shield className="h-4 w-4 text-red-400" />
                            <AlertDescription className="text-red-200">
                                This system is monitored. Unauthorized access is prohibited and will be prosecuted.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-slate-300">Administrator ID</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter admin username"
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                                />
                            </div>

                            <div>
                                <Label className="text-slate-300">Security Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter secure password"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Label className="text-slate-300">Security Key</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter government security key"
                                    value={loginForm.securityKey}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, securityKey: e.target.value }))}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold h-12"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Authenticating...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    Access Secure Portal
                                </div>
                            )}
                        </Button>

                        <div className="text-center text-xs text-slate-400 space-y-1">
                            <p className="font-semibold">Demo Mode Active:</p>
                            <p>Enter any credentials to access the dashboard</p>
                            <p>Username determines admin role (e.g., "security" → Security Admin)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                                <Crown className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Government Command Center</h1>
                                <p className="text-sm text-slate-300">Election Commission of India • Classified Portal</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Badge className="bg-green-600 text-white">
                                <Activity className="w-3 h-3 mr-1" />
                                System Online
                            </Badge>
                            <div className="text-right">
                                <p className="text-white font-semibold">{adminUser?.name}</p>
                                <p className="text-xs text-slate-300">Clearance Level {adminUser?.clearanceLevel}</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setIsAuthenticated(false);
                                    onBackToLanding?.();
                                }}
                                variant="outline"
                                size="sm"
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                Back to Portal
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-800/50 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Command Overview', icon: Monitor },
                            { id: 'elections', label: 'Election Control', icon: Vote },
                            { id: 'citizens', label: 'Citizen Database', icon: Users },
                            { id: 'complaints', label: 'Complaints & Services', icon: MessageSquare },

                            { id: 'security', label: 'Security Center', icon: Shield },
                            { id: 'government', label: 'Government Data', icon: Flag },
                            { id: 'analytics', label: 'Deep Analytics', icon: BarChart3 },
                            { id: 'historical', label: 'Historical Archive', icon: History }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-orange-500 text-orange-400'
                                    : 'border-transparent text-slate-400 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Real-time Status */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Registered Citizens</p>
                                            <p className="text-2xl font-bold text-white">{citizensData.length}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Total Votes Cast</p>
                                            <p className="text-2xl font-bold text-white">{votingData?.totalVotes || 0}</p>
                                        </div>
                                        <Vote className="h-8 w-8 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Active Complaints</p>
                                            <p className="text-2xl font-bold text-white">{complaintsData?.filter(c => c.status !== 'resolved').length || 0}</p>
                                        </div>
                                        <MessageSquare className="h-8 w-8 text-red-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Service Requests</p>
                                            <p className="text-2xl font-bold text-white">
                                                {citizensData.reduce((acc, c) => acc + c.serviceRequests.length, 0)}
                                            </p>
                                        </div>
                                        <FileText className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Live Voting Results */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-orange-500" />
                                    Live Voting Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white">Candidate Results</h4>
                                        <div className="space-y-3">
                                            {votingData?.candidateResults.map((candidate) => (
                                                <div key={candidate.candidateId} className="bg-slate-700/50 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div>
                                                            <h5 className="text-white font-medium">{candidate.name}</h5>
                                                            <p className="text-slate-400 text-sm">{candidate.party}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white font-semibold">{candidate.votes} votes</p>
                                                            <p className="text-slate-400 text-sm">{candidate.percentage}%</p>
                                                        </div>
                                                    </div>
                                                    <Progress value={candidate.percentage} className="h-2" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-white">Constituency Turnout</h4>
                                        <div className="space-y-3">
                                            {votingData?.turnoutByConstituency.map((constituency) => (
                                                <div key={constituency.constituency} className="flex items-center justify-between">
                                                    <span className="text-slate-300">{constituency.constituency}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-slate-700 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                style={{ width: `${constituency.turnoutPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-white font-semibold w-12 text-right">
                                                            {constituency.turnoutPercentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Citizen Activity Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Recent Citizen Activities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {citizensData.slice(0, 5).map((citizen) => (
                                            <div key={citizen.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{citizen.name}</p>
                                                        <p className="text-slate-400 text-sm">{citizen.constituency}</p>
                                                    </div>
                                                </div>
                                                <Badge className={`${citizen.votingStatus === 'voted' ? 'bg-green-600' :
                                                    citizen.votingStatus === 'registered' ? 'bg-blue-600' : 'bg-gray-600'
                                                    } text-white`}>
                                                    {citizen.votingStatus.toUpperCase()}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Service Request Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {['completed', 'pending', 'approved', 'in_progress'].map((status) => {
                                            const count = citizensData.reduce((acc, c) =>
                                                acc + c.serviceRequests.filter(sr => sr.status === status).length, 0
                                            );
                                            const percentage = citizensData.reduce((acc, c) => acc + c.serviceRequests.length, 0) > 0
                                                ? (count / citizensData.reduce((acc, c) => acc + c.serviceRequests.length, 0)) * 100
                                                : 0;

                                            return (
                                                <div key={status} className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400 capitalize">{status.replace('_', ' ')}</span>
                                                        <span className="text-white font-semibold">{count}</span>
                                                    </div>
                                                    <Progress value={percentage} className="h-2" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
                {activeTab === 'elections' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Election Results & Analytics</h2>
                            <div className="flex gap-2">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Results
                                </Button>
                                <Button variant="outline" className="border-slate-600 text-slate-300">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh Data
                                </Button>
                            </div>
                        </div>

                        {/* Election Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Total Votes Cast</p>
                                            <p className="text-2xl font-bold text-white">{votingData?.totalVotes || 0}</p>
                                        </div>
                                        <Vote className="h-8 w-8 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Constituencies</p>
                                            <p className="text-2xl font-bold text-white">{votingData?.turnoutByConstituency.length || 0}</p>
                                        </div>
                                        <MapPin className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Average Turnout</p>
                                            <p className="text-2xl font-bold text-white">
                                                {votingData ? Math.round(votingData.turnoutByConstituency.reduce((acc, c) => acc + c.turnoutPercentage, 0) / votingData.turnoutByConstituency.length) : 0}%
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Leading Party</p>
                                            <p className="text-lg font-bold text-white">
                                                {votingData?.candidateResults[0]?.party.split(' ').slice(0, 2).join(' ') || 'N/A'}
                                            </p>
                                        </div>
                                        <Crown className="h-8 w-8 text-yellow-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Candidate Results - Visual Bar Chart */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-orange-500" />
                                    Candidate Performance Analysis
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Real-time vote count and percentage breakdown
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {votingData?.candidateResults.map((candidate, index) => (
                                        <div key={candidate.candidateId} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-green-500' :
                                                            index === 1 ? 'bg-blue-500' :
                                                                index === 2 ? 'bg-orange-500' : 'bg-gray-500'
                                                        }`} />
                                                    <div>
                                                        <h4 className="text-white font-semibold">{candidate.name}</h4>
                                                        <p className="text-slate-400 text-sm">{candidate.party}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-bold text-lg">{candidate.votes} votes</p>
                                                    <p className="text-slate-400 text-sm">{candidate.percentage}%</p>
                                                </div>
                                            </div>

                                            {/* Visual Progress Bar */}
                                            <div className="relative">
                                                <div className="w-full bg-slate-700 rounded-full h-4">
                                                    <div
                                                        className={`h-4 rounded-full transition-all duration-1000 ${index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                                                index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                                                    index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'
                                                            }`}
                                                        style={{ width: `${candidate.percentage}%` }}
                                                    />
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">
                                                        {candidate.percentage}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Winner Badge */}
                                            {index === 0 && (
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-green-600 text-white">
                                                        <Crown className="w-3 h-3 mr-1" />
                                                        LEADING
                                                    </Badge>
                                                    <span className="text-green-400 text-sm">
                                                        +{candidate.percentage - (votingData?.candidateResults[1]?.percentage || 0)}% ahead
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Constituency-wise Results */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-blue-500" />
                                        Constituency Turnout Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {votingData?.turnoutByConstituency.map((constituency, index) => (
                                            <div key={constituency.constituency} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-white font-medium">{constituency.constituency}</h4>
                                                    <div className="text-right">
                                                        <span className="text-white font-semibold">{constituency.turnoutPercentage}%</span>
                                                        <p className="text-slate-400 text-xs">
                                                            {constituency.votescast}/{constituency.totalVoters}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <div className="w-full bg-slate-700 rounded-full h-3">
                                                        <div
                                                            className={`h-3 rounded-full transition-all duration-1000 ${constituency.turnoutPercentage >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                                                    constituency.turnoutPercentage >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                                                        constituency.turnoutPercentage >= 40 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                                                            'bg-gradient-to-r from-red-500 to-red-600'
                                                                }`}
                                                            style={{ width: `${constituency.turnoutPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Performance Badge */}
                                                <div className="flex justify-between items-center">
                                                    <Badge className={`${constituency.turnoutPercentage >= 80 ? 'bg-green-600' :
                                                            constituency.turnoutPercentage >= 60 ? 'bg-blue-600' :
                                                                constituency.turnoutPercentage >= 40 ? 'bg-orange-600' : 'bg-red-600'
                                                        } text-white text-xs`}>
                                                        {constituency.turnoutPercentage >= 80 ? 'EXCELLENT' :
                                                            constituency.turnoutPercentage >= 60 ? 'GOOD' :
                                                                constituency.turnoutPercentage >= 40 ? 'AVERAGE' : 'LOW'}
                                                    </Badge>
                                                    <span className="text-slate-400 text-xs">
                                                        Rank #{index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Voting Pattern Timeline */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-orange-500" />
                                        Hourly Voting Pattern
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {votingData?.hourlyVotingPattern.map((hourData) => (
                                            <div key={hourData.hour} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-300 font-medium">
                                                        {hourData.hour}:00 - {hourData.hour + 1}:00
                                                    </span>
                                                    <span className="text-white font-semibold">{hourData.votes} votes</span>
                                                </div>

                                                <div className="relative">
                                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-1000"
                                                            style={{
                                                                width: `${(hourData.votes / Math.max(...(votingData?.hourlyVotingPattern.map(h => h.votes) || [1]))) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Peak Hour Indicator */}
                                                {hourData.votes === Math.max(...(votingData?.hourlyVotingPattern.map(h => h.votes) || [])) && (
                                                    <Badge className="bg-orange-600 text-white text-xs">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        PEAK HOUR
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Demographic Analysis */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-500" />
                                    Demographic Voting Analysis
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Age-wise voting distribution and patterns
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {votingData?.demographicBreakdown.map((demo, index) => (
                                        <div key={demo.ageGroup} className="text-center space-y-3">
                                            <div className="bg-slate-700/50 rounded-lg p-4">
                                                <h4 className="text-slate-400 text-sm font-medium">{demo.ageGroup} years</h4>
                                                <p className="text-2xl font-bold text-white mt-2">{demo.percentage}%</p>
                                                <p className="text-slate-400 text-xs">{demo.votes} votes</p>
                                            </div>

                                            {/* Visual Ring Progress */}
                                            <div className="relative w-16 h-16 mx-auto">
                                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                                    <circle
                                                        cx="32"
                                                        cy="32"
                                                        r="28"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                        className="text-slate-700"
                                                    />
                                                    <circle
                                                        cx="32"
                                                        cy="32"
                                                        r="28"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                        strokeDasharray={`${demo.percentage * 1.76} 176`}
                                                        className={`${index === 0 ? 'text-blue-500' :
                                                                index === 1 ? 'text-green-500' :
                                                                    index === 2 ? 'text-orange-500' :
                                                                        index === 3 ? 'text-purple-500' : 'text-red-500'
                                                            } transition-all duration-1000`}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">{demo.percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Election Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-200 text-sm">Highest Turnout</p>
                                            <p className="text-2xl font-bold text-white">
                                                {Math.max(...(votingData?.turnoutByConstituency.map(c => c.turnoutPercentage) || [0]))}%
                                            </p>
                                            <p className="text-green-300 text-xs">
                                                {votingData?.turnoutByConstituency.find(c =>
                                                    c.turnoutPercentage === Math.max(...votingData.turnoutByConstituency.map(x => x.turnoutPercentage))
                                                )?.constituency}
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-green-400" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-200 text-sm">Victory Margin</p>
                                            <p className="text-2xl font-bold text-white">
                                                {votingData ? (votingData.candidateResults[0]?.percentage - votingData.candidateResults[1]?.percentage).toFixed(1) : 0}%
                                            </p>
                                            <p className="text-blue-300 text-xs">
                                                {votingData ? Math.abs(votingData.candidateResults[0]?.votes - votingData.candidateResults[1]?.votes) : 0} votes
                                            </p>
                                        </div>
                                        <Target className="h-8 w-8 text-blue-400" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-200 text-sm">Peak Voting Hour</p>
                                            <p className="text-2xl font-bold text-white">
                                                {votingData?.hourlyVotingPattern.find(h =>
                                                    h.votes === Math.max(...(votingData?.hourlyVotingPattern.map(x => x.votes) || []))
                                                )?.hour || 0}:00
                                            </p>
                                            <p className="text-orange-300 text-xs">
                                                {Math.max(...(votingData?.hourlyVotingPattern.map(h => h.votes) || [0]))} votes
                                            </p>
                                        </div>
                                        <Clock className="h-8 w-8 text-orange-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
                {activeTab === 'security' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Security Command Center</h2>
                            <Badge className="bg-green-600 text-white">
                                <Shield className="w-4 h-4 mr-1" />
                                All Systems Secure
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">Login Attempts</h3>
                                        <UserCheck className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Total</span>
                                            <span className="text-white font-semibold">{formatNumber(securityMetrics.totalAttempts)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Successful</span>
                                            <span className="text-green-400 font-semibold">{formatNumber(securityMetrics.successfulLogins)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Failed</span>
                                            <span className="text-red-400 font-semibold">{formatNumber(securityMetrics.failedAttempts)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">Threat Detection</h3>
                                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Suspicious Activity</span>
                                            <span className="text-orange-400 font-semibold">{securityMetrics.suspiciousActivity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Blocked IPs</span>
                                            <span className="text-red-400 font-semibold">{securityMetrics.blockedIPs.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Encryption</span>
                                            <span className="text-green-400 font-semibold">ACTIVE</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">System Status</h3>
                                        <Server className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Database</span>
                                            <span className="text-green-400 font-semibold">ONLINE</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Backup Systems</span>
                                            <span className="text-green-400 font-semibold">READY</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Last Scan</span>
                                            <span className="text-white font-semibold">2 hrs ago</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Blocked IPs */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Blocked IP Addresses</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Real-time monitoring of suspicious network activity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {securityMetrics.blockedIPs.map((ip, index) => (
                                        <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-red-400 font-mono">{ip}</span>
                                                <Badge className="bg-red-600 text-white">BLOCKED</Badge>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2">Multiple failed login attempts</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {activeTab === 'government' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Government Intelligence</h2>
                            <Badge className="bg-red-600 text-white">
                                <Lock className="w-4 h-4 mr-1" />
                                TOP SECRET
                            </Badge>
                        </div>

                        {/* Budget Allocation */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">National Budget Allocation FY 2024-25</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Classified financial distribution across government sectors
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(governmentData.budgetAllocation).map(([sector, amount]) => (
                                        <div key={sector} className="bg-slate-700/50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-white font-semibold capitalize">{sector.replace(/([A-Z])/g, ' $1')}</h4>
                                                <Target className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <p className="text-2xl font-bold text-green-400">{formatCurrency(amount)}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {((amount / Object.values(governmentData.budgetAllocation).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}% of total budget
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Economic Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Economic Indicators</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">GDP (Nominal)</span>
                                            <span className="text-white font-semibold">{formatCurrency(governmentData.economicIndicators.gdp)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Inflation Rate</span>
                                            <span className="text-orange-400 font-semibold">{governmentData.economicIndicators.inflation}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Unemployment</span>
                                            <span className="text-red-400 font-semibold">{governmentData.economicIndicators.unemployment}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Fiscal Deficit</span>
                                            <span className="text-yellow-400 font-semibold">{governmentData.economicIndicators.fiscalDeficit}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Demographic Intelligence</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Total Population</span>
                                            <span className="text-white font-semibold">{formatNumber(governmentData.demographicData.totalPopulation)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Eligible Voters</span>
                                            <span className="text-blue-400 font-semibold">{formatNumber(governmentData.demographicData.eligibleVoters)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Registered Voters</span>
                                            <span className="text-green-400 font-semibold">{formatNumber(governmentData.demographicData.registeredVoters)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Registration Rate</span>
                                            <span className="text-green-400 font-semibold">
                                                {((governmentData.demographicData.registeredVoters / governmentData.demographicData.eligibleVoters) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Age Distribution */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Voter Age Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(governmentData.demographicData.ageDistribution).map(([ageGroup, percentage]) => (
                                        <div key={ageGroup} className="text-center">
                                            <div className="bg-slate-700/50 rounded-lg p-4">
                                                <p className="text-slate-400 text-sm">{ageGroup} years</p>
                                                <p className="text-2xl font-bold text-white">{percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-white">Deep Analytics & Intelligence</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Voting Pattern Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="bg-slate-700/50 rounded-lg p-4">
                                            <h4 className="text-white font-semibold mb-2">Peak Voting Hours</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Morning (8-12 PM)</span>
                                                    <span className="text-white">34.2%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Afternoon (12-4 PM)</span>
                                                    <span className="text-white">28.7%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Evening (4-6 PM)</span>
                                                    <span className="text-white">37.1%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Regional Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="bg-slate-700/50 rounded-lg p-4">
                                            <h4 className="text-white font-semibold mb-2">Highest Turnout States</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">West Bengal</span>
                                                    <span className="text-green-400">75.3%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Uttar Pradesh</span>
                                                    <span className="text-green-400">72.1%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Tamil Nadu</span>
                                                    <span className="text-green-400">71.8%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'citizens' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Citizen Database</h2>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Search citizens..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 bg-slate-700/50 border-slate-600 text-white"
                                />
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Citizens Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Total Citizens</p>
                                            <p className="text-2xl font-bold text-white">{citizensData.length}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Verified Citizens</p>
                                            <p className="text-2xl font-bold text-white">
                                                {citizensData.filter(c => c.biometricVerified).length}
                                            </p>
                                        </div>
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Voted</p>
                                            <p className="text-2xl font-bold text-white">
                                                {citizensData.filter(c => c.votingStatus === 'voted').length}
                                            </p>
                                        </div>
                                        <Vote className="h-8 w-8 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Active Complaints</p>
                                            <p className="text-2xl font-bold text-white">
                                                {citizensData.reduce((acc, c) => acc + c.complaints.filter(comp => comp.status !== 'resolved').length, 0)}
                                            </p>
                                        </div>
                                        <AlertTriangle className="h-8 w-8 text-red-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Citizens List */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Citizen Records</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Complete database of registered citizens and their activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {citizensData
                                        .filter(citizen =>
                                            searchTerm === '' ||
                                            citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            citizen.citizenId.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((citizen) => (
                                            <div key={citizen.id} className="bg-slate-700/30 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                            <User className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-semibold">{citizen.name}</h4>
                                                            <p className="text-slate-400 text-sm">{citizen.email}</p>
                                                            <p className="text-slate-400 text-xs">{citizen.citizenId}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${citizen.votingStatus === 'voted' ? 'bg-green-600' :
                                                            citizen.votingStatus === 'registered' ? 'bg-blue-600' : 'bg-gray-600'
                                                            } text-white`}>
                                                            {citizen.votingStatus.toUpperCase()}
                                                        </Badge>
                                                        {citizen.biometricVerified && (
                                                            <Badge className="bg-green-600 text-white">VERIFIED</Badge>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setSelectedCitizen(citizen)}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-slate-400">Age:</span>
                                                        <span className="text-white ml-2">{citizen.age}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400">Constituency:</span>
                                                        <span className="text-white ml-2">{citizen.constituency}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400">Mobile:</span>
                                                        <span className="text-white ml-2">{citizen.mobile}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400">Last Login:</span>
                                                        <span className="text-white ml-2">
                                                            {new Date(citizen.lastLogin).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Citizen Detail Modal */}
                        {selectedCitizen && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                <Card className="bg-slate-800 border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-white">Citizen Details: {selectedCitizen.name}</CardTitle>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedCitizen(null)}
                                                className="border-slate-600 text-slate-300"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Full Name:</span>
                                                        <span className="text-white">{selectedCitizen.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Email:</span>
                                                        <span className="text-white">{selectedCitizen.email}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Mobile:</span>
                                                        <span className="text-white">{selectedCitizen.mobile}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Citizen ID:</span>
                                                        <span className="text-white">{selectedCitizen.citizenId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Age:</span>
                                                        <span className="text-white">{selectedCitizen.age}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Gender:</span>
                                                        <span className="text-white capitalize">{selectedCitizen.gender}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Constituency:</span>
                                                        <span className="text-white">{selectedCitizen.constituency}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-white">Verification Status</h3>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Biometric Verified:</span>
                                                        <Badge className={selectedCitizen.biometricVerified ? 'bg-green-600' : 'bg-red-600'}>
                                                            {selectedCitizen.biometricVerified ? 'YES' : 'NO'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Liveness Verified:</span>
                                                        <Badge className={selectedCitizen.livenessVerified ? 'bg-green-600' : 'bg-red-600'}>
                                                            {selectedCitizen.livenessVerified ? 'YES' : 'NO'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Voting Status:</span>
                                                        <Badge className={`${selectedCitizen.votingStatus === 'voted' ? 'bg-green-600' :
                                                            selectedCitizen.votingStatus === 'registered' ? 'bg-blue-600' : 'bg-gray-600'
                                                            } text-white`}>
                                                            {selectedCitizen.votingStatus.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Registration Date:</span>
                                                        <span className="text-white">
                                                            {new Date(selectedCitizen.registrationDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                                            <p className="text-slate-300">{selectedCitizen.address}</p>
                                        </div>
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">
                                                Complaints ({selectedCitizen.complaints.length})
                                            </h3>
                                            {selectedCitizen.complaints.length > 0 ? (
                                                <div className="space-y-2">
                                                    {selectedCitizen.complaints.map((complaint) => (
                                                        <div key={complaint.id} className="bg-slate-700/50 rounded-lg p-3">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="text-white font-medium">{complaint.title}</h4>
                                                                    <p className="text-slate-400 text-sm">{complaint.category}</p>
                                                                </div>
                                                                <Badge className={`${complaint.status === 'resolved' ? 'bg-green-600' :
                                                                    complaint.status === 'in_progress' ? 'bg-blue-600' :
                                                                        complaint.status === 'rejected' ? 'bg-red-600' : 'bg-gray-600'
                                                                    } text-white`}>
                                                                    {complaint.status.toUpperCase()}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-400">No complaints filed</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'complaints' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Complaints & Service Requests</h2>
                            <Badge className="bg-orange-600 text-white">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Live Monitoring
                            </Badge>
                        </div>

                        {/* Complaints Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    label: 'Total Complaints',
                                    value: complaintsData.length,
                                    icon: MessageSquare,
                                    color: 'text-blue-500'
                                },
                                {
                                    label: 'Pending',
                                    value: complaintsData.filter(comp => comp.status === 'pending').length,
                                    icon: Clock,
                                    color: 'text-orange-500'
                                },
                                {
                                    label: 'In Progress',
                                    value: complaintsData.filter(comp => comp.status === 'in_progress').length,
                                    icon: Activity,
                                    color: 'text-blue-500'
                                },
                                {
                                    label: 'Resolved',
                                    value: complaintsData.filter(comp => comp.status === 'resolved').length,
                                    icon: CheckCircle,
                                    color: 'text-green-500'
                                }
                            ].map((stat, index) => (
                                <Card key={index} className="bg-slate-800/50 border-slate-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-slate-400 text-sm">{stat.label}</p>
                                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                            </div>
                                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* All Complaints */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">All Complaints & Service Requests</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Real-time monitoring of citizen complaints and service requests
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {complaintsData.map((complaint) => {
                                        const citizen = citizensData.find(c => c.id === complaint.citizenId);
                                        return (
                                            <div key={complaint.id} className="bg-slate-700/30 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white font-semibold">{complaint.title}</h4>
                                                        <p className="text-slate-400 text-sm">
                                                            Filed by: {citizen?.name} • {complaint.category} • {complaint.department}
                                                        </p>
                                                        <p className="text-slate-300 text-sm mt-1">{complaint.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${complaint.priority === 'critical' ? 'bg-red-600' :
                                                            complaint.priority === 'high' ? 'bg-orange-600' :
                                                                complaint.priority === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                                                            } text-white`}>
                                                            {complaint.priority.toUpperCase()}
                                                        </Badge>
                                                        <Badge className={`${complaint.status === 'resolved' ? 'bg-green-600' :
                                                            complaint.status === 'in_progress' ? 'bg-blue-600' :
                                                                complaint.status === 'rejected' ? 'bg-red-600' : 'bg-gray-600'
                                                            } text-white`}>
                                                            {complaint.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                                                    <span>📍 {complaint.location}</span>
                                                    <span>📅 {new Date(complaint.dateSubmitted).toLocaleDateString()}</span>
                                                    <span>🏢 {complaint.department}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Service Requests Overview */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Service Requests Overview</CardTitle>
                                <CardDescription className="text-slate-400">
                                    All citizen service requests and their current status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {citizensData.flatMap(citizen =>
                                        citizen.serviceRequests.map(request => ({ ...request, citizenName: citizen.name }))
                                    ).map((request) => (
                                        <div key={request.id} className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-white font-semibold">{request.type}</h4>
                                                    <p className="text-slate-400 text-sm">
                                                        Requested by: {request.citizenName}
                                                    </p>
                                                    <p className="text-slate-300 text-sm mt-1">
                                                        Fee: ₹{request.fee} • Documents: {request.documents.length}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`${request.status === 'completed' ? 'bg-green-600' :
                                                        request.status === 'approved' ? 'bg-blue-600' :
                                                            request.status === 'in_progress' ? 'bg-orange-600' :
                                                                request.status === 'rejected' ? 'bg-red-600' : 'bg-gray-600'
                                                        } text-white`}>
                                                        {request.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                                                <span>📅 {new Date(request.dateRequested).toLocaleDateString()}</span>
                                                <span>💰 ₹{request.fee}</span>
                                                {request.documents.length > 0 && (
                                                    <span>📄 {request.documents.length} document(s)</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {
                    activeTab === 'historical' && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold text-white">Historical Election Archive</h2>

                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Election History (1951-2024)</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Complete archive of Indian democratic elections
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { year: '2024', type: 'General Election', turnout: '68.2%', winner: 'Ongoing' },
                                            { year: '2019', type: 'General Election', turnout: '67.4%', winner: 'NDA Coalition' },
                                            { year: '2014', type: 'General Election', turnout: '66.4%', winner: 'NDA Coalition' },
                                            { year: '2009', type: 'General Election', turnout: '58.2%', winner: 'UPA Coalition' },
                                            { year: '2004', type: 'General Election', turnout: '58.1%', winner: 'UPA Coalition' },
                                            { year: '1999', type: 'General Election', turnout: '59.9%', winner: 'NDA Coalition' },
                                            { year: '1998', type: 'General Election', turnout: '61.9%', winner: 'BJP Coalition' },
                                            { year: '1996', type: 'General Election', turnout: '57.9%', winner: 'United Front' },
                                            { year: '1991', type: 'General Election', turnout: '56.7%', winner: 'Indian National Congress' },
                                            { year: '1989', type: 'General Election', turnout: '61.9%', winner: 'National Front' }
                                        ].map((election, index) => (
                                            <div key={index} className="bg-slate-700/30 rounded-lg p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">{election.year}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-semibold">{election.type}</h4>
                                                        <p className="text-slate-400 text-sm">Turnout: {election.turnout}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-semibold">{election.winner}</p>
                                                    <Badge className="bg-blue-600 text-white mt-1">
                                                        {election.year === '2024' ? 'ACTIVE' : 'COMPLETED'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
            </div>
        </div>
    );
}
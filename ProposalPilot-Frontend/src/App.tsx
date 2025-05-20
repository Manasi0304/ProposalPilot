import React, { useState, useEffect } from 'react';
import axios from "axios";
import { motion } from 'framer-motion';

import { 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
  Settings, 
  ChevronRight,
  Shield,
  FileCheck,
  Scale,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { data } from 'framer-motion/client';

function App() {
  const [activeTab, setActiveTab] = useState('company');
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [complianceData1, setComplianceData] = useState(null);

  const [companyFileUploaded, setCompanyFileUploaded] = useState(false);
  const [showData, setShowData] = useState(false);
  const [fileName, setFileName] = useState('');
  const [companyData, setCompanyData] = useState([]);

  const [criteriaData, setCriteriaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [complianceList, setComplianceList] = useState([]);
  const [preferenceData, setPreferenceData] = useState([]);
  const [formsData, setFormsData] = useState([]);
  const [formatData, setFormatData] = useState([]);
  const [evaluationData, setEvaluationData] = useState([]);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          complianceRes,
          preferenceRes,
          formsRes,
          formatRes,
          evaluationRes,
          eligibilityRes,
          paymentRes,
          submissionRes,
          riskRes
        ] = await Promise.all([
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/compliance_check'),
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/preference'),
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/forms_attachments'),
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/format_of_document'),
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/evaluation_criteria'),
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/analyzed_rfp'),
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/payment_criteria'),
          axios.get('https://complygen-ai-driven-rfp-compliance.onrender.com/submission'),
          fetch('https://complygen-ai-driven-rfp-compliance.onrender.com/risk_analysis') // native fetch here
        ]);

        setComplianceList(complianceRes.data.data);
        setPreferenceData(preferenceRes.data.data);
        setFormsData(formsRes.data.data);
        setFormatData(formatRes.data.data);
        setEvaluationData(evaluationRes.data.data);
        setEligibilityResult(eligibilityRes.data.data);
        setPaymentData(paymentRes.data.data);
        setSubmissionData(submissionRes.data.data);

        const riskJson = await riskRes.json();
        setRiskData(riskJson.data);
      } catch (error) {
        console.error('Error fetching one or more data:', error);
      }
    };

    fetchAllData();
  }, []);


  const categoryMap = {
    "Compliance Check": { id: 'compliance', icon: '🛡️', label: 'Compliance Checks' },
    "Preference": { id: 'preference', icon: '🌟', label: 'Preference' },
    "Forms/Attachments": { id: 'forms', icon: '📎', label: 'Forms/Attachments' },
    "Format of Document": { id: 'format', icon: '📝', label: 'Format of Document' },
    "Evaluation Criteria": { id: 'evaluation', icon: '📊', label: 'Evaluation Criteria' },
    "Payment Criteria": { id: 'payment', icon: '💰', label: 'Payment Criteria' },
    "Submission": { id: 'submission', icon: '📤', label: 'Submission' },
    "Risk Analysis": { id: 'risks', icon: '⚠️', label: 'Risk Analysis' },
  };
  
  

  const complianceData = {
    registration: [
      { label: 'SAM.gov Registration', status: 'valid', message: 'CAGE Code: 7ABC3, Active' },
      { label: 'State Registration (Texas)', status: 'valid', message: 'Registered and Active' },
      { label: 'Tax ID/FEIN', status: 'valid', message: 'Valid and Verified' },
      { label: 'Business Type', status: 'valid', message: 'LLC - Eligible' },
      { label: 'HUB Certification', status: 'warning', message: 'Renewal required in 60 days' }
    ],
    eligibility: [
      { requirement: 'Years in Business', value: '10 years', required: '5+ years', met: true },
      { requirement: 'Annual Revenue', value: '$50M+', required: '$25M+', met: true },
      { requirement: 'Past Performance', value: '8 similar contracts', required: '5 contracts', met: true },
      { requirement: 'Insurance Coverage', value: '$2M', required: '$5M', met: false },
      { requirement: 'Texas HQ', value: 'Dallas Office', required: 'Texas presence', met: true }
    ],
    submission: [
      { item: 'Technical Proposal', format: 'PDF, max 20 pages', status: 'pending', due: '2024-04-01' },
      { item: 'Price Proposal', format: 'Excel template', status: 'in-progress', due: '2024-04-01' },
      { item: 'Past Performance', format: '3 references', status: 'completed', due: '2024-03-25' },
      { item: 'Certifications', format: 'Scanned copies', status: 'pending', due: '2024-03-30' },
      { item: 'Financial Statements', format: 'Last 3 years', status: 'not-started', due: '2024-03-28' }
    ],
    risks: [
      { 
        category: 'Payment Terms',
        risk: 'High',
        description: 'Net-90 payment terms specified',
        suggestion: 'Request modification to Net-45'
      },
      {
        category: 'Termination Clause',
        risk: 'Medium',
        description: 'Unilateral termination with 15-day notice',
        suggestion: 'Negotiate for 30-day notice period'
      },
      {
        title: 'Liability',
        risk: 'High',
        description: 'Unlimited liability clause present',
        suggestion: 'Add cap at contract value'
      },
      {
        category: 'Performance Metrics',
        risk: 'Low',
        description: 'Standard SLA requirements',
        suggestion: 'Acceptable as is'
      }
    ]
  };

  useEffect(() => {
    if (activeTab === 'company') {
      fetchCompanyDataOnLoad();
    }
  }, [activeTab]);

  const fetchCompanyDataOnLoad = async () => {
    try {
      const response = await fetch('https://complygen-ai-driven-rfp-compliance.onrender.com/get_company_data');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const extractedData = result.data?.data || [];

      // Simulating post-upload state change
      // setCompanyFileUploaded(true);
      setFileName("AutoFetchedCompanyData.json");
      setCompanyData(extractedData);
      setShowData(true);
    } catch (error) {
      console.error('Error fetching company data:', error);
      alert('Unable to fetch company data. Please try again later.');
    }
  };


  const handleGenerate = async (file) => {
    setLoading(true);
    setUploadProgress(10);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('https://complygen-ai-driven-rfp-compliance.onrender.com/criteria_generator', {
        method: 'POST',
        body: formData,
      });
  
      setUploadProgress(80);
  
      if (!response.ok) {
        throw new Error('Failed to generate criteria');
      }
  
      const data = await response.json();
  
      setUploadProgress(100);
      console.log('✅ API Response:', data);
      // You can store or use the data as needed

      setActiveTab('dashboard');
  
    } catch (error) {
      console.error('❌ Error:', error);
      alert("Something went wrong while processing the RFP.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setUploadProgress(0);
      }, 500);
    }
  };
  

  
  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setCompanyFileUploaded(true);
  
      const formData = new FormData();
      formData.append('file', file); // If backend expects a different field name, change 'file'
  
      try {
        const response = await fetch('https://complygen-ai-driven-rfp-compliance.onrender.com/extract_company_data', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        const extractedData = result.data?.data || []; // Adjust according to your API structure

        setCompanyFileUploaded(true)
        setCompanyData(extractedData);
        setShowData(true);
        fetchCompanyDataOnLoad();
      } catch (error) {
        console.error('Error fetching company data:', error);
        alert('Unable to fetch company data. Please try again later.');
      }
    }
  };

  useEffect(() => {
    fetch("https://complygen-ai-driven-rfp-compliance.onrender.com/get_criteria")
      .then((res) => res.json())
      .then((data) => {
        const merged = data.data.reduce((acc, curr) => {
          const existing = acc.find((item) => item.category === curr.category);
          if (existing) {
            existing.len += curr.len;
          } else {
            acc.push({ ...curr });
          }
          return acc;
        }, []);
        setCriteriaData(merged);
      });
  }, []);

  const [showDashboardSubmenu, setShowDashboardSubmenu] = useState(false);

  
   
  

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
  {/* Header */}
  <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg backdrop-blur-md bg-opacity-90 flex-none">
    <div className="max-w-7xl px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-white drop-shadow-sm" />
          <h1 className="text-2xl font-bold text-white tracking-wider drop-shadow-sm">
            RFP Analyzer
          </h1>
        </div>
        {selectedRfp && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-100 font-medium bg-white/10 px-3 py-1 rounded-full shadow-inner backdrop-blur-sm">
              📄 Analyzing: <span className="underline">{selectedRfp}</span>
            </span>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Settings className="h-6 w-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  </header>

  {/* Main Content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar */}
    <div className="w-1/4 max-w-xs bg-white/60 backdrop-blur-lg border-r border-blue-100 rounded-tr-3xl shadow-inner p-5 flex-none overflow-y-auto">
      <nav className="space-y-4 text-gray-800">
        {/* Section: Primary */}
        <div className="space-y-2">
          {[
            { id: 'company', icon: Building, label: 'Company Data' },
            { id: 'upload', icon: Upload, label: 'Upload RFP' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition duration-200 shadow-sm ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-200 to-blue-100 text-blue-800'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>

        <hr className="border-t border-gray-200 my-3" />

        {/* Section: Dashboard */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-grow flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition duration-200 shadow-sm ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-200 to-blue-100 text-blue-800'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <CheckCircle className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => setShowDashboardSubmenu((prev) => !prev)}
              className="px-2 text-gray-500 hover:text-blue-600 transition"
            >
              <ChevronRight
                className={`h-4 w-4 transform transition-transform duration-300 ${
                  showDashboardSubmenu ? 'rotate-90 text-blue-700' : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Dashboard Submenu */}
          {showDashboardSubmenu && (
            <div className="ml-4 mt-2 pl-2 border-l-2 border-blue-100 space-y-1">
              {[
                { id: 'compliance', icon: Shield, label: 'Complaince Check' },
                { id: 'preference', icon: Shield, label: 'Preference' },
                { id: 'forms', icon: Shield, label: 'Forms & Attachments' },
                { id: 'format', icon: Shield, label: 'Proposal Format' },
                { id: 'evaluation', icon: Shield, label: 'Evaluation' },
                { id: 'payment', icon: Shield, label: 'Payment Criteria' },
                { id: 'submission', icon: Shield, label: 'Submission Checklist' },
                { id: 'risks', icon: Shield, label: 'Risk Analysis' }
                // { id: 'eligibility', icon: FileCheck, label: 'Eligibility Criteria' },
                // { id: 'checklist', icon: Clock, label: 'Submission Checklist' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>

    {/* Rest of the content goes here */}
  {/* </div> */}
{/* </div> */}



        {/* Content Area - Scrollable */}
<div className="flex-1 overflow-y-auto relative">
  {/* Vibrant Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#e0f7fa] via-[#fce4ec] to-[#ede7f6] opacity-90 z-0" />

  {/* Animated Floating Blobs */}
  <div className="absolute top-[-150px] left-[-150px] w-[300px] h-[300px] bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
  <div className="absolute bottom-[-150px] right-[-150px] w-[300px] h-[300px] bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />

  {/* Scrollable Content */}
  <div className="relative z-10 p-8">
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Company Upload Panel */}
      {activeTab === 'company' && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-pink-200 shadow-lg p-6 transition hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📁 Upload Company Data</h2>
            <label
              htmlFor="company-upload"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:scale-105 transition transform cursor-pointer"
            >
              Choose File
            </label>
          </div>

          <input
            id="company-upload"
            type="file"
            accept=".json,.csv,.xlsx,.pdf,.docx,.doc"
            className="hidden"
            onChange={handleFileUpload}
          />

          {showData && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h3
                className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-300 pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Company Information
              </motion.h3>

              {Object.entries(
                companyData.reduce((groups, item) => {
                  const { category } = item;
                  if (!groups[category]) groups[category] = [];
                  groups[category].push(item);
                  return groups;
                }, {})
              ).map(([category, items], i) => (
                <motion.div
                  key={category}
                  className="bg-white/80 backdrop-blur-sm border-l-4 border-purple-400 shadow-md rounded-xl p-6 mb-6 transform transition hover:scale-[1.01]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <h4 className="text-lg font-bold text-purple-600 mb-4">{category}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex gap-3 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <div className="mt-1 text-lg">
                          {item.available === "yes" ? (
                            <span className="text-green-500">✅</span>
                          ) : (
                            <span className="text-yellow-500">⚠️</span>
                          )}
                        </div>
                        <div>
                          <h5 className="text-md font-semibold text-gray-800">{item.title}</h5>
                          <p className="text-sm text-gray-700">{item.content || "N/A"}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* RFP Upload Section */}
      {activeTab === 'upload' && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-indigo-200 shadow-lg p-6 transition hover:shadow-2xl">
          <div className="border-2 border-dashed border-gray-400 rounded-xl p-12 text-center bg-white/60">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-md font-medium text-gray-800">
              Drop your RFP document here
            </p>
            <p className="text-sm text-gray-500">or click to browse (PDF, DOC, DOCX)</p>

            <input
              id="rfp-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedRfp(e.target.files[0].name);
                }
              }}
            />
            <label
              htmlFor="rfp-upload"
              className="mt-4 inline-block px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 cursor-pointer transition"
            >
              Upload Document
            </label>
          </div>

          {selectedRfp && (
            <>
              <button
                onClick={() => handleGenerate(selectedRfp)}
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:scale-105 transition"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>

              {loading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  {/* </div> */}
{/* </div> */}



{/* Dashboard Dummy */}
{activeTab === 'dashboard' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-xl p-10 space-y-10"
  >
    <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
      📊 RFP Progress Overview
      <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
        Live Preview
      </span>
    </h2>

    {/* {eligibilityResult && (
    <div
      className={`text-center text-xl font-bold px-4 py-3 rounded-lg mb-6 shadow-md ${
        eligibilityResult.eligible === 'yes'
          ? 'bg-green-100 text-green-800 border border-green-300'
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}
    >
      {eligibilityResult.eligible === 'yes'
        ? '✅ Eligible for Submission'
        : '❌ Not Eligible for Submission'}
      <p className="text-sm font-normal mt-1 text-gray-700">
        Reason: {eligibilityResult.reason}
      </p>
    </div>
  )} */}

    <div>
      <h3 className="text-2xl font-semibold text-blue-800 mb-6">✅ Individual Checks</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(() => {
          const totalCount = criteriaData.reduce((sum, item) => sum + item.len, 0) || 1;

          return criteriaData.map((item, index) => {
            const iconMap = {
              "Compliance Check": "📋",
              "Preference": "🌟",
              "Forms/Attachments": "📎",
              "Format of Document": "📝",
              "Evaluation Criteria": "📊",
              "Payment Criteria": "💰",
              "Submission": "📤",
              "Risk Analysis": "⚠️",
            };

            const icon = iconMap[item.category] || "📁";
            const status = item.len > 0 ? "🟢 Complete" : "🟡 Pending";
            const width = (item.len / totalCount) * 100;
            const mapped = categoryMap[item.category] || { id: 'default', icon: '📁', label: item.category };

            return (
              <motion.div
                key={index}
                onClick={() => setActiveTab(mapped.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 backdrop-blur-sm border border-blue-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl shadow-inner">
                    {icon}
                  </div>
                  <p className="text-lg font-semibold text-blue-900 text-center">{item.category}</p>
                  <p className="text-sm text-gray-600">{status}</p>
                  <p className="text-xs text-gray-500">Findings: {item.len}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${width}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{item.len} of {totalCount}</p>
                </div>
              </motion.div>
            );
          });
        })()}
      </div>
    </div>
  </motion.div>
)}



{activeTab === 'submission' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow divide-y"
  >
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">📤 Submission Requirements</h2>

      <div className="mt-6 space-y-4">
        {submissionData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-700 font-semibold text-md">{item.title}</p>
                <p className="text-sm text-gray-600 mt-1">{item.content}</p>
              </div>
              <span className="text-xs text-gray-500">📄 Page {item.page_no}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
)}


{activeTab === 'payment' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow divide-y"
  >
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">📄 Payment Criteria</h2>

      <div className="mt-6 space-y-4">
        {paymentData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-700 font-semibold text-md">{item.title}</p>
                <p className="text-sm text-gray-600 mt-1">{item.content}</p>
              </div>
              <span className="text-xs text-gray-500">📄 Page {item.page_no}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
)}


{activeTab === 'evaluation' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow divide-y"
  >
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Evaluation Criteria</h2>

      <div className="mt-6 space-y-4">
        {Array.isArray(evaluationData) && evaluationData.length > 0 ? (
          evaluationData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.content}</p>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>📂 Category: {item.category}</span>
                <span>📄 Page: {item.page_no}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">Loading evaluation details...</p>
        )}
      </div>
    </div>
  </motion.div>
)}

{activeTab === 'format' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow divide-y"
  >
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Document Format Guidelines</h2>

      <div className="mt-6 space-y-4">
        {Array.isArray(formatData) && formatData.length > 0 ? (
          formatData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.content}</p>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>📂 Category: {item.category}</span>
                <span>📄 Page: {item.page_no}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">Loading document format details...</p>
        )}
      </div>
    </div>
  </motion.div>
)}

{activeTab === 'forms' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow divide-y"
  >
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Forms & Attachments</h2>

      <div className="mt-6 space-y-4">
        {Array.isArray(formsData) && formsData.length > 0 ? (
          formsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.content}</p>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>📂 Category: {item.category}</span>
                <span>📄 Page: {item.page_no}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">Loading forms and attachments...</p>
        )}
      </div>
    </div>
  </motion.div>
)}


{activeTab === 'preference' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow divide-y"
  >
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Preference Clauses</h2>

      <div className="mt-6 space-y-4">
        {Array.isArray(preferenceData) && preferenceData.length > 0 ? (
          preferenceData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.content}</p>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>🏷️ Category: {item.category}</span>
                <span>📄 Page: {item.page_no}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">Loading preference clauses...</p>
        )}
      </div>
    </div>
  </motion.div>
)}




{activeTab === 'compliance' && (
  <div className="bg-white rounded-lg shadow divide-y">
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Standard Compliance Checks</h2>

      <div className="mt-6 space-y-4">
        {Array.isArray(complianceList) && complianceList.length > 0 ? (
          complianceList.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.content}</p>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>📘 Category: {item.category}</span>
                <span>📄 Page: {item.page_no}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading compliance checks...</p>
        )}
      </div>
    </div>
  </div>
)} 


        {activeTab === 'eligibility' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900">Mandatory Eligibility Criteria</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceData.eligibility.map((item) => (
                    <div key={item.requirement} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className={`flex-shrink-0 h-5 w-5 ${
                        item.met ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.met ? <CheckCircle /> : <AlertTriangle />}
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="font-medium text-gray-900">{item.requirement}</p>
                        <p className="text-sm text-gray-500">Required: {item.required}</p>
                        <p className="text-sm text-gray-500">Current: {item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900">Submission Requirements Checklist</h2>
                <div className="mt-6 space-y-4">
                  {complianceData.submission.map((item) => (
                    <div key={item.item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center flex-grow">
                        <div className={`h-4 w-4 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in-progress' ? 'bg-yellow-500' :
                          item.status === 'not-started' ? 'bg-red-500' :
                          'bg-gray-300'
                        }`} />
                        <div className="ml-3">
                          <span className="font-medium text-gray-900">{item.item}</span>
                          <p className="text-sm text-gray-500">{item.format}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Due: {item.due}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'risks' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow p-6"
  >
    <h2 className="text-2xl font-semibold text-red-700 flex items-center gap-2">
      ⚠️ Contract Risk Analysis
    </h2>
    <p className="text-sm text-gray-600 mt-1">Potential threats identified from the contract with impact assessment & suggestions.</p>

    <div className="mt-6 space-y-6">
      {riskData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-red-200 bg-red-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                🚩 {item.title}
              </h3>
              <span className="text-sm text-gray-500">📄 Page {item.page_no}</span>
            </div>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm uppercase ${
              item.severity === 'high' ? 'bg-red-600 text-white' :
              item.severity === 'medium' ? 'bg-yellow-400 text-black' :
              'bg-green-500 text-white'
            }`}>
              {item.severity} Risk
            </span>
          </div>

          <p className="text-gray-700 text-sm mb-3">
            {item.description}
          </p>

          <div className="bg-white border-l-4 border-blue-500 p-3 rounded text-sm text-blue-700 shadow-sm">
            💡 <span className="font-medium">Suggestion:</span> {item.suggestion}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
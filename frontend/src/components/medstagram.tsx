import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, User, Calendar, MapPin, Phone, Heart, Plus, Church, Home, Clock, Save, Bot } from 'lucide-react';

const MedstagramEMR = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (aiInput.trim()) {
      // AI interaction logic would go here
      console.log('AI Query:', aiInput);
      setAiInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">medstagram</h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-violet-600" />
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Patient Info & Form */}
          <div className="flex-1 p-6">
            {/* Patient Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-violet-600">RA</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Restituto Arapipap</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Male • 45 years • CN: 123456</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Active Admission
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-8 mb-6">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'general'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  General Data
                </button>
                <button
                  onClick={() => setActiveTab('medical')}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'medical'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Medical Info
                </button>
              </div>

              {/* Patient Info Grid */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Date of Birth</span>
                      <p className="font-medium text-gray-900">January 1, 1980</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Civil Status</span>
                      <p className="font-medium text-gray-900">Married</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Nationality</span>
                      <p className="font-medium text-gray-900">Filipino</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <Church className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Religion</span>
                        <p className="font-medium text-gray-900">Roman Catholic</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <Home className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Address</span>
                        <p className="font-medium text-gray-900">123 P Faura St.,<br />Manila City</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Philhealth</span>
                      <p className="font-medium text-gray-900">12-345678901-2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Entry Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-8">
                  <button className="pb-2 text-sm font-medium border-b-2 border-violet-600 text-violet-600">
                    New Entry
                  </button>
                  <button className="pb-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                    History
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Last saved 2m ago</span>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chief Complaint
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                    rows="3"
                    placeholder="Enter chief complaint..."
                    value={formData.chiefComplaint}
                    onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjective
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                    rows="4"
                    placeholder="Enter subjective findings..."
                    value={formData.subjective}
                    onChange={(e) => handleInputChange('subjective', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objective
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                    rows="4"
                    placeholder="Enter objective findings..."
                    value={formData.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                    rows="4"
                    placeholder="Enter assessment..."
                    value={formData.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                    rows="4"
                    placeholder="Enter treatment plan..."
                    value={formData.plan}
                    onChange={(e) => handleInputChange('plan', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Sidebar */}
          <div className={`transition-all duration-300 ease-in-out border-l border-gray-200 bg-white flex flex-col ${
            aiCollapsed ? 'w-12' : 'w-80'
          }`}>
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                {!aiCollapsed && (
                  <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                )}
                <button
                  onClick={() => setAiCollapsed(!aiCollapsed)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors ml-auto"
                >
                  {aiCollapsed ? (
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!aiCollapsed && (
              <>
                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">AI Suggestions</h4>
                      <p className="text-sm text-gray-600 mb-4">Based on the symptoms, consider asking about:</p>
                      
                      <div className="space-y-2">
                        <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <Plus className="w-4 h-4 text-gray-400" />
                          <span>Duration of symptoms</span>
                        </button>
                        <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <Plus className="w-4 h-4 text-gray-400" />
                          <span>Related conditions</span>
                        </button>
                        <button className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <Plus className="w-4 h-4 text-gray-400" />
                          <span>Previous treatments</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed AI Input at bottom */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Ask AI assistant..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAiSubmit(e);
                        }
                      }}
                    />
                    <button
                      onClick={handleAiSubmit}
                      className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Collapsed state - just the toggle button */}
            {aiCollapsed && (
              <div className="flex flex-col items-center py-4">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-600" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedstagramEMR;
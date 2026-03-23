import { useState, useEffect } from 'react';

export default function VoiceSettings({ 
  voices = [], 
  selectedVoice = null, 
  onVoiceChange = () => {},
  isOpen = false,
  onClose = () => {}
}) {
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Filter voices based on search term and prefer English voices
    const englishVoices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      voice.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const otherVoices = voices.filter(voice => 
      !voice.lang.startsWith('en') && 
      voice.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredVoices([...englishVoices, ...otherVoices]);
  }, [voices, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Voice Settings</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search voices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Current Voice */}
        {selectedVoice && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Current Voice</p>
                <p className="text-white">{selectedVoice.name}</p>
                <p className="text-xs text-slate-400">{selectedVoice.lang}</p>
              </div>
              <button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance("Hello! This is how I sound.");
                  utterance.voice = selectedVoice;
                  speechSynthesis.speak(utterance);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white transition-colors"
              >
                Test
              </button>
            </div>
          </div>
        )}

        {/* Voice List */}
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {filteredVoices.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No voices found</p>
          ) : (
            <div className="space-y-2">
              {filteredVoices.map((voice, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedVoice?.name === voice.name
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                  }`}
                  onClick={() => onVoiceChange(voice)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">{voice.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-slate-600 rounded text-slate-300">
                          {voice.lang}
                        </span>
                        {voice.default && (
                          <span className="text-xs px-2 py-1 bg-green-600 rounded text-white">
                            Default
                          </span>
                        )}
                        {voice.localService === false && (
                          <span className="text-xs px-2 py-1 bg-purple-600 rounded text-white">
                            Online
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const utterance = new SpeechSynthesisUtterance("Hello! This is how I sound.");
                        utterance.voice = voice;
                        speechSynthesis.speak(utterance);
                      }}
                      className="ml-3 px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm text-white transition-colors"
                    >
                      Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            {voices.length} voices available • Choose your preferred AI voice
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { X, MessageCircle, Clock } from 'lucide-react';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: {
    question: string;
    response: any;
    timestamp: Date;
  } | null;
}

export default function ConversationModal({ isOpen, onClose, conversation }: ConversationModalProps) {
  if (!isOpen || !conversation) return null;

  const formatResponse = (response: any) => {
    if (typeof response === 'string') {
      return response;
    }
    
    if (response && typeof response === 'object') {
      // Handle the backend response object
      if (response.sections && Array.isArray(response.sections)) {
        return (
          <div className="space-y-6">
            {response.paraphrased_prompt && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">分析問題</h3>
                <p className="text-blue-700">{response.paraphrased_prompt}</p>
              </div>
            )}
            
            {response.sections.map((section: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  {section.section || `分析項目 ${index + 1}`}
                </h3>
                
                {section.cards && Array.isArray(section.cards) ? (
                  <div className="space-y-4">
                    {section.cards.map((card: any, cardIndex: number) => (
                      <div key={cardIndex} className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-gray-700 mb-2">{card.title}</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{card.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">{JSON.stringify(section, null, 2)}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      // Fallback for other object types
      return <pre className="text-sm overflow-auto">{JSON.stringify(response, null, 2)}</pre>;
    }
    
    return String(response);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <MessageCircle size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">投資分析報告</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>{conversation.timestamp.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Question */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">您的問題</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">{conversation.question}</p>
            </div>
          </div>

          {/* Response */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">分析結果</h3>
            <div className="space-y-4">
              {formatResponse(conversation.response)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              此分析僅供參考，投資有風險，請謹慎決策
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
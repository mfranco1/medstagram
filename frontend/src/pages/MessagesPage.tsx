import { useState } from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { 
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  Info,
} from 'lucide-react'

// Placeholder data for messages
const conversations = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    role: 'Cardiologist',
    lastMessage: 'ECG results reviewed. Need to discuss.',
    time: '10:30 AM',
    unread: 2,
    avatar: 'SC'
  },
  {
    id: 2,
    name: 'Dr. Michael Rodriguez',
    role: 'Neurologist',
    lastMessage: 'The MRI report is ready for patient #1234',
    time: 'Yesterday',
    unread: 0,
    avatar: 'MR'
  },
  {
    id: 3,
    name: 'Nurse Emma Thompson',
    role: 'Head Nurse',
    lastMessage: 'Patient in Room 302 needs attention',
    time: 'Yesterday',
    unread: 1,
    avatar: 'ET'
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    role: 'Pediatrician',
    lastMessage: 'Can you check the lab results for the Johnson case?',
    time: '2 days ago',
    unread: 0,
    avatar: 'JW'
  }
]

// Placeholder data for current chat
const currentChat = {
  id: 1,
  name: 'Dr. Sarah Chen',
  role: 'Cardiologist',
  avatar: 'SC',
  messages: [
    {
      id: 1,
      sender: 'them',
      content: "Hi, I've reviewed the patient's ECG results.",
      time: '10:28 AM'
    },
    {
      id: 2,
      sender: 'them',
      content: 'There are some concerning patterns we should discuss.',
      time: '10:29 AM'
    },
    {
      id: 3,
      sender: 'me',
      content: 'Thanks for the heads up. What specific patterns did you notice?',
      time: '10:30 AM'
    }
  ]
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(currentChat)
  const [messageInput, setMessageInput] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      // Placeholder for sending message
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(currentChat)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                  selectedChat.id === conversation.id ? 'bg-violet-50' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-medium">
                    {conversation.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-violet-600 rounded-full">
                      {conversation.unread}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-medium">
                {selectedChat.avatar}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900">{selectedChat.name}</h2>
                <p className="text-xs text-gray-500">{selectedChat.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender === 'me'
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
              <button
                type="submit"
                className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 
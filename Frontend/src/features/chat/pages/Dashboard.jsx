import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId } from '../chat.slice'
import remarkGfm from 'remark-gfm'

const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const [ chatInput, setChatInput ] = useState('')
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, currentChatId, isLoading])

  const handleSubmitMessage = async (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage || isLoading) {
      return
    }

    setChatInput('')
    await chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
    setIsSidebarOpen(false)
  }

  const handleStartNewChat = () => {
    dispatch(setCurrentChatId(null))
    setIsSidebarOpen(false)
  }

  const currentMessages = currentChatId ? (chats[ currentChatId ]?.messages || []) : []
  const currentChatTitle = currentChatId ? chats[ currentChatId ]?.title : null

  return (
    <main className='h-screen h-[100dvh] w-full overflow-hidden bg-[#07090f] text-white p-2 sm:p-3 md:p-5'>
      <section className='mx-auto flex h-full w-full gap-4 md:gap-6'>
        
        {/* Desktop Sidebar */}
        <aside className='hidden h-full w-64 lg:w-72 shrink-0 rounded-3xl border border-white/10 bg-[#080b12] p-4 md:flex md:flex-col'>
          <div className='mb-5 flex items-center justify-between'>
            <h1 className='text-2xl font-bold tracking-tight text-[#31b8c6]'>Perplexity</h1>
            <button
              onClick={handleStartNewChat}
              type='button'
              title='New Chat'
              className='cursor-pointer rounded-xl border border-[#31b8c6]/40 bg-[#31b8c6]/10 px-3 py-1.5 text-xs font-semibold text-[#31b8c6] transition hover:bg-[#31b8c6]/20'
            >
              + New
            </button>
          </div>

          <div className='flex-1 space-y-2 overflow-y-auto pr-1'>
            {Object.values(chats).length === 0 ? (
              <p className='text-xs text-white/30 text-center py-4'>No chats yet</p>
            ) : (
              Object.values(chats).map((item) => {
                const isActive = item.id === currentChatId
                return (
                  <button
                    onClick={() => openChat(item.id)}
                    key={item.id}
                    type='button'
                    className={`w-full cursor-pointer truncate rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? 'border border-[#31b8c6] bg-[#31b8c6]/15 text-white shadow-[0_0_12px_rgba(49,184,198,0.2)]'
                        : 'border border-white/10 bg-transparent text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {item.title || 'Untitled Chat'}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className='fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity md:hidden'
          />
        )}

        {/* Mobile Off-canvas Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 sm:w-80 flex-col border-r border-white/10 bg-[#080b12] p-4 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='mb-5 flex items-center justify-between'>
            <h1 className='text-xl font-bold tracking-tight text-[#31b8c6]'>Perplexity</h1>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleStartNewChat}
                type='button'
                className='rounded-lg border border-[#31b8c6]/40 bg-[#31b8c6]/15 px-2.5 py-1 text-xs font-semibold text-[#31b8c6]'
              >
                + New
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                type='button'
                aria-label='Close menu'
                className='flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-zinc-900 text-white hover:bg-zinc-800'
              >
                ✕
              </button>
            </div>
          </div>

          <div className='flex-1 space-y-2 overflow-y-auto pr-1'>
            {Object.values(chats).length === 0 ? (
              <p className='text-xs text-white/30 text-center py-4'>No chats yet</p>
            ) : (
              Object.values(chats).map((item) => {
                const isActive = item.id === currentChatId
                return (
                  <button
                    onClick={() => openChat(item.id)}
                    key={item.id}
                    type='button'
                    className={`w-full cursor-pointer truncate rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? 'border border-[#31b8c6] bg-[#31b8c6]/15 text-white'
                        : 'border border-white/10 bg-transparent text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {item.title || 'Untitled Chat'}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <section className='mx-auto flex h-full w-full max-w-4xl min-w-0 flex-1 flex-col overflow-hidden'>
          
          {/* Mobile Top Navigation Bar */}
          <div className='shrink-0 flex items-center justify-between border-b border-white/10 pb-2.5 pt-1 md:hidden'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              type='button'
              aria-label='Open Menu'
              className='flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-zinc-900/90 text-white'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
            
            <span className='truncate px-2 text-sm font-medium text-white/80'>
              {currentChatTitle || 'Perplexity'}
            </span>

            <button
              onClick={handleStartNewChat}
              type='button'
              className='rounded-xl border border-[#31b8c6]/40 bg-[#31b8c6]/10 px-3 py-1.5 text-xs font-semibold text-[#31b8c6]'
            >
              + New
            </button>
          </div>

          {/* Messages Stream */}
          <div className='messages flex-1 min-h-0 space-y-4 overflow-y-auto px-1 sm:px-2 py-3'>
            {currentMessages.length === 0 && !isLoading && (
              <div className='flex h-full min-h-[40vh] flex-col items-center justify-center px-4 text-center text-white/40'>
                <h2 className='text-2xl sm:text-3xl font-semibold text-white/70'>What would you like to know?</h2>
                <p className='mt-2 text-xs sm:text-sm text-white/40 max-w-md'>
                  Ask anything, search the web with live sources, or explore complex topics.
                </p>
              </div>
            )}

            {currentMessages.map((message, index) => (
              <div
                key={message._id || message.id || index}
                className={`w-fit max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base leading-relaxed ${
                  message.role === 'user'
                    ? 'ml-auto rounded-br-none border border-[#31b8c6]/40 bg-[#31b8c6]/15 text-white shadow-sm'
                    : 'mr-auto rounded-bl-none border border-white/10 bg-zinc-900/90 text-zinc-100 shadow-md'
                }`}
              >
                {message.role === 'user' ? (
                  <p className='whitespace-pre-wrap break-words'>{message.content}</p>
                ) : (
                  <div className='markdown-content text-zinc-100 break-words'>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className='mb-2.5 last:mb-0 leading-relaxed'>{children}</p>,
                        ul: ({ children }) => <ul className='mb-2.5 list-disc pl-5 space-y-1'>{children}</ul>,
                        ol: ({ children }) => <ol className='mb-2.5 list-decimal pl-5 space-y-1'>{children}</ol>,
                        code: ({ children }) => <code className='rounded bg-white/10 px-1.5 py-0.5 text-xs sm:text-sm font-mono text-[#31b8c6] break-all'>{children}</code>,
                        pre: ({ children }) => <pre className='mb-3 overflow-x-auto rounded-xl bg-black/50 p-3 text-xs sm:text-sm'>{children}</pre>,
                        strong: ({ children }) => <strong className='font-semibold text-white'>{children}</strong>
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking / Searching Indicator */}
            {isLoading && (
              <div className='mr-auto flex items-center gap-2.5 rounded-2xl rounded-bl-none border border-white/10 bg-zinc-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-300 shadow-md'>
                <span className='inline-block h-2 w-2 animate-ping rounded-full bg-[#31b8c6]'></span>
                <span>Searching & Generating answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar (Fixed firmly at bottom with shrink-0) */}
          <footer className='shrink-0 w-full pt-2 pb-1 sm:pb-2'>
            <form onSubmit={handleSubmitMessage} className='flex items-center gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border border-white/20 bg-[#080b12] p-2 sm:p-2.5 shadow-2xl backdrop-blur'>
              <input
                type='text'
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder='Type your message...'
                disabled={isLoading}
                className='flex-1 min-w-0 rounded-xl sm:rounded-2xl border-none bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base md:text-lg text-white outline-none placeholder:text-white/40 focus:ring-0 disabled:opacity-50'
              />
              <button
                type='submit'
                disabled={!chatInput.trim() || isLoading}
                className='cursor-pointer shrink-0 rounded-xl sm:rounded-2xl bg-[#31b8c6] px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base md:text-lg font-semibold text-zinc-950 transition hover:bg-[#45c7d4] disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard
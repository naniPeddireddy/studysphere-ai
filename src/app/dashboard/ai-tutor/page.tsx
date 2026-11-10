
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Code,
  Calculator,
  Brain,
  User,
  Trash2,
  MessageCircle,
  Zap,
  Copy,
  RefreshCw,
  Square,
  Check,
  ShieldCheck,
  Plus,
  MessageSquare,
  Pencil,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const STORAGE_KEY = "studysphere-ai-conversations";
const OLD_STORAGE_KEY = "studysphere-ai-tutor-chat";

const suggestions = [
  {
    title: "Explain Python functions",
    description: "Learn Python step by step",
    icon: Code,
  },
  {
    title: "What is Artificial Intelligence?",
    description: "Understand AI basics",
    icon: Brain,
  },
  {
    title: "Explain linear algebra",
    description: "Make maths easier",
    icon: Calculator,
  },
  {
    title: "Give me a study plan",
    description: "Organize your learning",
    icon: BookOpen,
  },
];

function createConversation(): Conversation {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: "New Chat",
    messages: [],
    updatedAt: Date.now(),
  };
}

function getChatTitle(text: string) {
  const cleanText = text.trim().replace(/\s+/g, " ");
  return cleanText.length > 30
    ? cleanText.slice(0, 30) + "..."
    : cleanText || "New Chat";
}

export default function AITutor() {
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find(
    (chat) => chat.id === activeConversationId
  );

  const messages = activeConversation?.messages || [];

  // LOAD ALL SAVED CONVERSATIONS
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const validChats = parsed.filter(
            (item): item is Conversation =>
              item !== null &&
              typeof item === "object" &&
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              Array.isArray(item.messages) &&
              typeof item.updatedAt === "number"
          );

          if (validChats.length > 0) {
            setConversations(validChats);

            const lastActive = validChats.reduce((latest, chat) =>
              chat.updatedAt > latest.updatedAt ? chat : latest
            );

            setActiveConversationId(lastActive.id);
            return;
          }
        }
      }

      // MIGRATE OLD SINGLE CHAT
      const oldSaved = localStorage.getItem(OLD_STORAGE_KEY);

      if (oldSaved) {
        const parsedOld: unknown = JSON.parse(oldSaved);

        if (Array.isArray(parsedOld)) {
          const validMessages = parsedOld.filter(
            (item): item is ChatMessage =>
              item !== null &&
              typeof item === "object" &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.text === "string"
          );

          const migratedChat: Conversation = {
            ...createConversation(),
            title:
              validMessages.find((item) => item.role === "user")
                ? getChatTitle(
                    validMessages.find((item) => item.role === "user")!.text
                  )
                : "Previous Chat",
            messages: validMessages,
            updatedAt: Date.now(),
          };

          setConversations([migratedChat]);
          setActiveConversationId(migratedChat.id);
        } else {
          const newChat = createConversation();
          setConversations([newChat]);
          setActiveConversationId(newChat.id);
        }
      } else {
        const newChat = createConversation();
        setConversations([newChat]);
        setActiveConversationId(newChat.id);
      }
    } catch (error) {
      console.error("Unable to load conversations:", error);

      const newChat = createConversation();
      setConversations([newChat]);
      setActiveConversationId(newChat.id);
    } finally {
      setChatLoaded(true);
    }
  }, []);

  // SAVE ALL CONVERSATIONS
  useEffect(() => {
    if (!chatLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      localStorage.removeItem(OLD_STORAGE_KEY);
    } catch (error) {
      console.error("Unable to save conversations:", error);
    }
  }, [conversations, chatLoaded]);

  // AUTOMATIC SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  // STOP REQUEST WHEN PAGE CLOSES
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  // UPDATE A SPECIFIC CONVERSATION
  function updateConversationMessages(
    conversationId: string,
    updater: (previous: ChatMessage[]) => ChatMessage[]
  ) {
    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === conversationId
          ? {
              ...chat,
              messages: updater(chat.messages),
              updatedAt: Date.now(),
            }
          : chat
      )
    );
  }

  // CREATE NEW CHAT
  function createNewChat() {
    if (isTyping) {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setIsTyping(false);
    }

    const newChat = createConversation();

    setConversations((previous) => [newChat, ...previous]);
    setActiveConversationId(newChat.id);
    setMessage("");
    setCopiedIndex(null);
    setSidebarOpen(false);

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  // OPEN PREVIOUS CHAT
  function openConversation(id: string) {
    if (isTyping) {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setIsTyping(false);
    }

    setActiveConversationId(id);
    setMessage("");
    setCopiedIndex(null);
    setSidebarOpen(false);
  }

  // RENAME CHAT
  function renameConversation(id: string) {
    const chat = conversations.find((item) => item.id === id);
    if (!chat) return;

    const newTitle = window.prompt(
      "Enter a new conversation name:",
      chat.title
    );

    if (!newTitle || !newTitle.trim()) return;

    setConversations((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, title: newTitle.trim(), updatedAt: Date.now() }
          : item
      )
    );
  }

  // DELETE ONE CHAT
  function deleteConversation(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    if (id === activeConversationId && isTyping) {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setIsTyping(false);
    }

    const remaining = conversations.filter((chat) => chat.id !== id);

    setConversations(remaining);

    if (id === activeConversationId) {
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        const newChat = createConversation();
        setConversations([newChat]);
        setActiveConversationId(newChat.id);
      }
    }
  }

  // CLEAR CURRENT CHAT MESSAGES
  function clearCurrentChat() {
    if (!activeConversationId) return;

    if (isTyping) {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setIsTyping(false);
    }

    updateConversationMessages(activeConversationId, () => []);
    setMessage("");
    setCopiedIndex(null);
    inputRef.current?.focus();
  }

  // GENERATE GEMINI RESPONSE
  async function generateAIResponse(
    question: string,
    history: ChatMessage[],
    conversationId: string
  ) {
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          history: history.slice(-20),
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      if (!data.reply || typeof data.reply !== "string") {
        throw new Error("The AI returned an empty response.");
      }

      updateConversationMessages(conversationId, (previous) => [
        ...previous,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to connect to the AI Tutor.";

      updateConversationMessages(conversationId, (previous) => [
        ...previous,
        {
          role: "assistant",
          text: `Sorry, I couldn't generate an answer.\n\n${errorMessage}`,
        },
      ]);
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setIsTyping(false);
      }
    }
  }

  // SEND MESSAGE
  function sendMessage(text = message) {
    const userMessage = text.trim();

    if (
      !userMessage ||
      isTyping ||
      !chatLoaded ||
      !activeConversationId
    ) {
      return;
    }

    const conversationId = activeConversationId;
    const currentMessages = messages;

    updateConversationMessages(conversationId, (previous) => [
      ...previous,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    // AUTOMATICALLY NAME NEW CONVERSATION
    const currentChat = conversations.find(
      (chat) => chat.id === conversationId
    );

    if (currentChat && currentChat.messages.length === 0) {
      setConversations((previous) =>
        previous.map((chat) =>
          chat.id === conversationId
            ? { ...chat, title: getChatTitle(userMessage) }
            : chat
        )
      );
    }

    setMessage("");

    generateAIResponse(
      userMessage,
      currentMessages.slice(-20),
      conversationId
    );
  }

  // STOP GENERATING
  function stopGenerating() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsTyping(false);
  }

  // REGENERATE LAST RESPONSE
  function regenerateResponse() {
    if (isTyping || !activeConversationId) return;

    const lastUserIndex = messages
      .map((item) => item.role)
      .lastIndexOf("user");

    if (lastUserIndex === -1) return;

    const lastUserMessage = messages[lastUserIndex];

    const previousHistory = messages
      .slice(0, lastUserIndex)
      .slice(-20);

    const conversationId = activeConversationId;

    updateConversationMessages(conversationId, (previous) =>
      previous.slice(0, lastUserIndex + 1)
    );

    generateAIResponse(
      lastUserMessage.text,
      previousHistory,
      conversationId
    );
  }

  // COPY RESPONSE
  async function copyResponse(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex((current) =>
          current === index ? null : current
        );
      }, 1800);
    } catch {
      alert("Could not copy the response. Please try again.");
    }
  }

  const lastAssistantIndex = messages.reduce(
    (lastIndex, item, index) =>
      item.role === "assistant" ? index : lastIndex,
    -1
  );

  const questionCount = messages.filter(
    (item) => item.role === "user"
  ).length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080812] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080812]/90 px-3 py-3 backdrop-blur-xl sm:px-5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:border-purple-500/40 hover:bg-purple-500/10"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={19} />
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition hover:bg-purple-500/10 md:hidden"
              aria-label="Toggle chat history"
            >
              {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
            </button>

            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/20 sm:h-11 sm:w-11">
                <Bot className="text-purple-300" size={24} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold sm:text-lg">
                  AI Study Tutor
                </h1>
                <p className="flex items-center gap-1.5 text-[11px] text-green-400 sm:text-xs">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  AI Learning Assistant
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 text-sm text-purple-300 sm:flex">
              <Sparkles size={17} />
              StudySphere AI
            </div>

            <button
              onClick={createNewChat}
              disabled={!chatLoaded}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2.5 text-xs font-semibold transition hover:scale-105 hover:shadow-lg hover:shadow-purple-900/30 disabled:opacity-50 sm:px-4 sm:text-sm"
            >
              <Plus size={17} />
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="relative mx-auto flex max-w-[1600px]">

        {/* MOBILE SIDEBAR BACKDROP */}
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* CHAT HISTORY SIDEBAR */}
        <aside
          className={`fixed bottom-0 left-0 top-[65px] z-40 flex w-[280px] flex-col border-r border-white/10 bg-[#0e0e1b] p-4 transition-transform duration-300 md:sticky md:top-[65px] md:z-10 md:h-[calc(100vh-65px)] md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={createNewChat}
            disabled={!chatLoaded}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-50"
          >
            <Plus size={18} />
            Start New Conversation
          </button>

          <div className="mt-7 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Chat History
            </h2>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-gray-400">
              {conversations.length}
            </span>
          </div>

          <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
            {!chatLoaded ? (
              <p className="py-4 text-center text-xs text-gray-500">
                Loading conversations...
              </p>
            ) : conversations.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-500">
                No conversations yet.
              </p>
            ) : (
              conversations.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 rounded-xl border p-2 transition ${
                    activeConversationId === chat.id
                      ? "border-purple-500/30 bg-purple-500/10"
                      : "border-transparent hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  <button
                    onClick={() => openConversation(chat.id)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 py-1 text-left"
                  >
                    <MessageSquare
                      size={16}
                      className={`shrink-0 ${
                        activeConversationId === chat.id
                          ? "text-purple-300"
                          : "text-gray-500"
                      }`}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-gray-200">
                        {chat.title}
                      </span>
                      <span className="mt-1 block text-[10px] text-gray-500">
                        {chat.messages.length} messages
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center">
                    <button
                      onClick={() => renameConversation(chat.id)}
                      className="rounded-lg p-1.5 text-gray-500 opacity-100 transition hover:bg-white/10 hover:text-purple-300 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Rename conversation"
                      aria-label="Rename conversation"
                    >
                      <Pencil size={13} />
                    </button>

                    <button
                      onClick={() => deleteConversation(chat.id)}
                      className="rounded-lg p-1.5 text-gray-500 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Delete conversation"
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-green-400" />
              Saved in your browser
            </div>
            <p className="mt-2 text-[10px] leading-5 text-gray-600">
              Your conversations stay on this browser. No database required.
            </p>
          </div>
        </aside>

        {/* CHAT CONTENT */}
        <section className="min-h-[calc(100vh-65px)] min-w-0 flex-1 px-4 pb-44 pt-8 sm:px-6 md:px-8 md:pt-12">

          {!chatLoaded ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <Bot size={35} className="mx-auto animate-pulse text-purple-400" />
                <p className="mt-3 text-sm text-gray-400">
                  Loading your AI Tutor...
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (

            /* EMPTY CHAT SCREEN */
            <div className="animate-[fadeIn_0.6s_ease-out] pt-5 text-center md:pt-10">

              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border border-purple-500/30 bg-gradient-to-br from-purple-600/30 to-blue-600/30 shadow-xl shadow-purple-900/20 transition duration-500 hover:scale-105 hover:rotate-3">
                <Bot size={48} className="text-purple-300" />
                <div className="absolute -right-2 -top-2 rounded-full border border-purple-400/30 bg-[#171329] p-2">
                  <Sparkles size={17} className="text-purple-300" />
                </div>
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">
                Your personal AI learning space
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                How can I help you
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  learn today?
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-400 md:text-base">
                Ask questions, explore difficult topics, and make your learning journey easier.
              </p>

              {/* SUGGESTIONS */}
              <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 text-left sm:mt-12 sm:grid-cols-2 sm:gap-4">
                {suggestions.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      onClick={() => sendMessage(item.title)}
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111120] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-lg hover:shadow-purple-900/10 sm:p-5"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition group-hover:bg-purple-500/20 sm:h-12 sm:w-12">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-200 transition group-hover:text-purple-300">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-gray-500 sm:mt-10">
                <span className="flex items-center gap-2">
                  <Zap size={14} className="text-purple-400" />
                  Smart learning
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen size={14} className="text-blue-400" />
                  Easy explanations
                </span>
                <span className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-green-400" />
                  Interactive chat
                </span>
              </div>
            </div>

          ) : (

            /* CONVERSATION SCREEN */
            <div className="mx-auto max-w-4xl space-y-7">

              <div className="mb-8 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold sm:text-xl">
                    {activeConversation?.title || "Your Conversation"}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Continue exploring your questions.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                    {questionCount} questions
                  </span>

                  <button
                    onClick={clearCurrentChat}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    title="Clear current chat"
                    aria-label="Clear current chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 sm:gap-3 ${
                    item.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{
                    animation: "fadeIn 0.35s ease-out",
                  }}
                >
                  {item.role === "assistant" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 sm:h-10 sm:w-10">
                      <Bot size={20} className="text-purple-300" />
                    </div>
                  )}

                  <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
                    <div
                      className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3.5 text-sm leading-7 sm:px-5 sm:py-4 ${
                        item.role === "user"
                          ? "rounded-tr-sm bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/20"
                          : "rounded-tl-sm border border-white/10 bg-[#171727] text-gray-200"
                      }`}
                    >
                      {item.text}
                    </div>

                    {item.role === "assistant" && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => copyResponse(item.text, index)}
                          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-500 transition hover:bg-white/5 hover:text-purple-300"
                          title="Copy response"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check size={14} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy
                            </>
                          )}
                        </button>

                        {index === lastAssistantIndex && (
                          <button
                            onClick={regenerateResponse}
                            disabled={isTyping}
                            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-500 transition hover:bg-white/5 hover:text-purple-300 disabled:opacity-40"
                            title="Regenerate response"
                          >
                            <RefreshCw size={14} />
                            Regenerate
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {item.role === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 sm:h-10 sm:w-10">
                      <User size={19} className="text-blue-300" />
                    </div>
                  )}
                </div>
              ))}

              {/* TYPING INDICATOR */}
              {isTyping && (
                <div className="flex items-center gap-3 animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 sm:h-10 sm:w-10">
                    <Bot size={20} className="text-purple-300" />
                  </div>

                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-white/10 bg-[#171727] px-5 py-4">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
                  </div>

                  <span className="text-xs text-gray-500">
                    AI Tutor is thinking...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </section>
      </div>

      {/* MESSAGE INPUT */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#080812]/95 p-3 backdrop-blur-xl sm:p-4 md:p-6 md:pl-[300px]">
        <div className="mx-auto max-w-4xl">

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-[#141424] p-2 shadow-xl shadow-purple-950/10 transition focus-within:border-purple-500/70 sm:gap-3"
          >
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your AI tutor anything..."
              maxLength={1000}
              aria-label="Ask your AI tutor"
              disabled={isTyping || !chatLoaded}
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-gray-500 disabled:opacity-60 sm:px-3"
            />

            {isTyping ? (
              <button
                type="button"
                onClick={stopGenerating}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-red-400 transition hover:bg-red-500/25 sm:h-12 sm:w-12"
                aria-label="Stop generating"
                title="Stop generating"
              >
                <Square size={17} fill="currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim() || !chatLoaded}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 transition hover:scale-105 hover:shadow-lg hover:shadow-purple-900/30 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            )}
          </form>

          <div className="mt-3 flex items-center justify-center gap-2 text-center text-[10px] text-gray-600 sm:text-[11px]">
            <ShieldCheck size={13} />
            <span>
              StudySphere AI · Powered by Google Gemini
            </span>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

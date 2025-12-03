// AI Chat Assistant with Knowledge Base
const knowledge = {
    intro: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'sup'],
        responses: [
            "Hi! I'm Mykolas's AI assistant. I can help you learn about his experience, projects, and skills. What would you like to know?",
            "Hello! Feel free to ask me anything about Mykolas's work, background, or technical expertise!",
            "Hey there! I'm here to help you explore Mykolas's portfolio. What interests you?"
        ]
    },
    experience: {
        keywords: ['experience', 'work', 'job', 'career', 'employment', 'worked', 'employer'],
        response: "Mykolas is a Full-Stack Software Engineer with industry experience shipping production code. He's worked with Python, React, .NET, and AWS, focusing on building robust infrastructure with intuitive applications. He values deep systems work that creates real impact for users."
    },
    projects: {
        keywords: ['project', 'built', 'made', 'created', 'portfolio', 'work on'],
        response: "Mykolas has built several impressive projects:\n\n🐨 **Koala's Forge**: Cross-platform system installer supporting 100+ applications\n⚡ **Distributed AlexNet**: Custom CUDA kernels achieving 4.6× speedup on DGX-1 cluster\n🚀 **Ultimate System Setup**: AI Lab + dev environment automation\n🎓 **Education Playground**: 40+ interactive Python lessons\n🎵 **Melody Matcher**: Canvas-based music puzzle game\n\nWhich project would you like to learn more about?"
    },
    skills: {
        keywords: ['skill', 'technology', 'tech stack', 'programming', 'language', 'framework'],
        response: "Mykolas's technical skillset includes:\n\n**Languages**: Python, C++, JavaScript, TypeScript, C#, PowerShell, Bash\n**Frameworks**: React, Django, .NET, Node.js\n**Infrastructure**: AWS, Docker, CUDA, MPI\n**Specialties**: GPU computing, distributed systems, full-stack development, system automation\n\nHe's particularly passionate about GPU acceleration and building developer tools!"
    },
    cuda: {
        keywords: ['cuda', 'gpu', 'parallel', 'distributed', 'alexnet', 'dgx'],
        response: "Great question! Mykolas has deep expertise in GPU computing. His Distributed AlexNet project used custom CUDA kernels and MPI orchestration to achieve a 4.6× speedup over baseline PyTorch on an NVIDIA DGX-1 cluster. He's passionate about high-performance computing and parallel programming."
    },
    education: {
        keywords: ['education', 'school', 'university', 'degree', 'college', 'study', 'studied'],
        response: "Mykolas studied at the New Jersey Institute of Technology (NJIT), where he developed expertise in computer science, GPU programming, and distributed systems. His academic work focused on high-performance computing and practical software engineering."
    },
    contact: {
        keywords: ['contact', 'email', 'reach', 'hire', 'available', 'linkedin', 'github'],
        response: "You can reach Mykolas at:\n\n📧 Email: Perevicius.Mykolas@gmail.com\n💼 LinkedIn: linkedin.com/in/mykolasperevicius\n🔗 GitHub: github.com/mykolas-perevicius\n\nHe's currently exploring opportunities where deep systems work meets impactful user experience!"
    },
    github: {
        keywords: ['github', 'repository', 'repo', 'code', 'open source'],
        response: "You can find Mykolas's work on GitHub at github.com/mykolas-perevicius. He has 30+ public repositories with 177K+ lines of code, 285 commits in 2025, and actively contributes to open source. Check out Koala's Forge and Distributed AlexNet for some highlights!"
    },
    resume: {
        keywords: ['resume', 'cv', 'download', 'pdf'],
        response: "You can view Mykolas's resume by clicking the Windows Word document widget in the hero section! It has a fun typing animation that shows his background. For a downloadable copy, you can reach out via email."
    },
    help: {
        keywords: ['help', 'what can you do', 'commands', 'capabilities'],
        response: "I can help you learn about:\n\n✨ Mykolas's work experience and career\n🚀 His projects (Koala's Forge, AlexNet, etc.)\n💻 Technical skills and expertise\n🎓 Education background\n📧 How to get in touch\n🔗 GitHub and open source work\n\nJust ask me anything!"
    }
};

const chatState = {
    isOpen: false,
    messages: [],
    hasGreeted: false
};

export function initChatAssistant() {
    createChatWidget();
    setupEventListeners();
}

function createChatWidget() {
    const widget = document.createElement('div');
    widget.className = 'chat-widget';
    widget.innerHTML = `
        <button class="chat-toggle" id="chatToggle" aria-label="Open chat assistant">
            <span class="chat-icon">💬</span>
            <span class="chat-badge">AI</span>
        </button>
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-header-title">
                    <span class="chat-avatar">🤖</span>
                    <div>
                        <div class="chat-title">AI Assistant</div>
                        <div class="chat-status">Online</div>
                    </div>
                </div>
                <button class="chat-close" id="chatClose" aria-label="Close chat">×</button>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="chatInput" placeholder="Ask me anything..." autocomplete="off">
                <button class="chat-send" id="chatSend" aria-label="Send message">
                    <span>→</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(widget);
}

function setupEventListeners() {
    const toggle = document.getElementById('chatToggle');
    const close = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');

    toggle.addEventListener('click', openChat);
    close.addEventListener('click', closeChat);
    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function openChat() {
    const window = document.getElementById('chatWindow');
    const toggle = document.getElementById('chatToggle');

    chatState.isOpen = true;
    window.classList.add('open');
    toggle.classList.add('hidden');

    if (!chatState.hasGreeted) {
        setTimeout(() => {
            addMessage('bot', "👋 Hi! I'm Mykolas's AI assistant. I can answer questions about his experience, projects, skills, and more. What would you like to know?");
            chatState.hasGreeted = true;
        }, 500);
    }

    document.getElementById('chatInput').focus();
}

function closeChat() {
    const window = document.getElementById('chatWindow');
    const toggle = document.getElementById('chatToggle');

    chatState.isOpen = false;
    window.classList.remove('open');
    toggle.classList.remove('hidden');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    addMessage('user', message);
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get response after delay
    setTimeout(() => {
        const response = getResponse(message);
        hideTypingIndicator();
        addMessage('bot', response);
    }, 500 + Math.random() * 1000);
}

function addMessage(sender, text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatState.messages.push({ sender, text, timestamp: Date.now() });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<div class="chat-bubble"><span></span><span></span><span></span></div>';

    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function getResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check each knowledge category
    for (const [category, data] of Object.entries(knowledge)) {
        const keywords = data.keywords || [];
        const matches = keywords.some(keyword => lowerMessage.includes(keyword));

        if (matches) {
            if (Array.isArray(data.responses)) {
                // Random response from array
                return data.responses[Math.floor(Math.random() * data.responses.length)];
            }
            return data.response;
        }
    }

    // Default fallback
    const fallbacks = [
        "That's an interesting question! I'd recommend checking out the projects section or reaching out to Mykolas directly at Perevicius.Mykolas@gmail.com.",
        "I'm not sure about that specific topic, but I can tell you about Mykolas's experience, projects, or technical skills. What would you like to know?",
        "Hmm, I don't have information on that. Try asking about his work experience, projects like Koala's Forge, or his GPU computing expertise!",
        "Great question! While I don't have details on that, I can share about his distributed systems work, full-stack projects, or how to contact him. What interests you?"
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

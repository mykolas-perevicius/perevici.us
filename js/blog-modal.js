// Blog Post Modal System
export function initBlogModal() {
    const posts = document.querySelectorAll('.blog-post');

    posts.forEach(post => {
        const readButton = post.querySelector('.blog-read-more');
        if (readButton) {
            readButton.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = post.dataset.postId;
                openBlogPost(postId);
            });
        }
    });

    // Close modal on backdrop click or ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openBlogPost(postId) {
    const modal = document.getElementById(`blog-modal-${postId}`);
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Setup close button
    const closeBtn = modal.querySelector('.blog-modal-close');
    if (closeBtn) {
        closeBtn.onclick = () => closeBlogModal(postId);
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBlogModal(postId);
        }
    });

    // Initialize code sandboxes if not already initialized
    initCodeSandboxes(modal);
}

function closeBlogModal(postId) {
    const modal = document.getElementById(`blog-modal-${postId}`);
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.blog-modal.active');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

function initCodeSandboxes(modal) {
    const sandboxes = modal.querySelectorAll('.code-sandbox');

    sandboxes.forEach(sandbox => {
        if (sandbox.dataset.initialized) return;

        const lang = sandbox.dataset.lang || 'javascript';
        const code = sandbox.querySelector('code').textContent;

        // Create interactive editor
        createInteractiveEditor(sandbox, code, lang);
        sandbox.dataset.initialized = 'true';
    });
}

function createInteractiveEditor(container, initialCode, language) {
    const editorId = `editor-${Math.random().toString(36).substr(2, 9)}`;

    container.innerHTML = `
        <div class="code-editor">
            <div class="code-editor-header">
                <span class="code-lang">${language}</span>
                <div class="code-actions">
                    <button class="code-run" data-editor="${editorId}">▶ Run</button>
                    <button class="code-reset" data-editor="${editorId}">↻ Reset</button>
                    <button class="code-copy" data-editor="${editorId}">📋 Copy</button>
                </div>
            </div>
            <div class="code-editor-content">
                <textarea id="${editorId}" class="code-input" spellcheck="false">${initialCode}</textarea>
            </div>
            <div class="code-output" id="${editorId}-output"></div>
        </div>
    `;

    // Setup event listeners
    const runBtn = container.querySelector('.code-run');
    const resetBtn = container.querySelector('.code-reset');
    const copyBtn = container.querySelector('.code-copy');
    const textarea = container.querySelector(`#${editorId}`);
    const output = container.querySelector(`#${editorId}-output`);

    let originalCode = initialCode;

    // Run code
    runBtn.addEventListener('click', () => {
        const code = textarea.value;
        runCode(code, output, language);
    });

    // Reset code
    resetBtn.addEventListener('click', () => {
        textarea.value = originalCode;
        output.innerHTML = '';
    });

    // Copy code
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(textarea.value);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
        }, 2000);
    });

    // Auto-resize textarea
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    // Initial resize
    textarea.style.height = textarea.scrollHeight + 'px';

    // Tab key support
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 4;
        }
    });
}

function runCode(code, outputElement, language) {
    outputElement.innerHTML = '';

    try {
        if (language === 'javascript') {
            // Capture console.log
            const logs = [];
            const originalLog = console.log;
            console.log = (...args) => {
                logs.push(args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' '));
                originalLog.apply(console, args);
            };

            // Execute code
            const result = eval(code);

            // Restore console.log
            console.log = originalLog;

            // Display output
            if (logs.length > 0) {
                outputElement.innerHTML = `<div class="output-success"><strong>Output:</strong><pre>${logs.join('\n')}</pre></div>`;
            } else if (result !== undefined) {
                outputElement.innerHTML = `<div class="output-success"><strong>Result:</strong><pre>${JSON.stringify(result, null, 2)}</pre></div>`;
            } else {
                outputElement.innerHTML = `<div class="output-success">Code executed successfully!</div>`;
            }
        } else if (language === 'python') {
            outputElement.innerHTML = `<div class="output-info">Python execution requires a backend. This is a demo editor.</div>`;
        }
    } catch (error) {
        outputElement.innerHTML = `<div class="output-error"><strong>Error:</strong><pre>${error.message}</pre></div>`;
    }
}

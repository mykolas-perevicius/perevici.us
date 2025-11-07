// Konami Code easter egg with Matrix rain effect
export function initKonami() {
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateMatrixRain();
            konamiCode = [];
        }
    });
}

function activateMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

    let animationId;
    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00d4ff';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };

    animationId = setInterval(draw, 33);

    setTimeout(() => {
        clearInterval(animationId);
        canvas.classList.remove('active');
    }, 10000);
}

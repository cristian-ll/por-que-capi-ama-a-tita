
const cards = document.querySelectorAll(".card");

// Animación de aparición de las tarjetas
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

cards.forEach((card) => observer.observe(card));

// ❤️ Sorpresa secreta: estiramiento y explosión de corazones
let startY = 0;
let pullDistance = 0;
let isPulling = false;
let explosionReady = false;

const PULL_THRESHOLD = 85;
const MAX_STRETCH = 140;

const page = document.body;

// Detectamos cuando el dedo toca la pantalla
document.addEventListener("touchstart", (event) => {
    if (window.scrollY > 2 || event.touches.length !== 1) {
        isPulling = false;
        return;
    }

    startY = event.touches[0].clientY;
    pullDistance = 0;
    isPulling = true;
    explosionReady = false;

    page.classList.add("is-pulling");
}, { passive: true });

// La página sigue el movimiento del dedo
document.addEventListener("touchmove", (event) => {
    if (!isPulling || event.touches.length !== 1) return;

    const currentY = event.touches[0].clientY;
    const distance = currentY - startY;

    if (window.scrollY <= 2 && distance > 0) {
        pullDistance = Math.min(distance, MAX_STRETCH);

        // El estiramiento aumenta con el movimiento del dedo
        const stretch = pullDistance * 0.35;

        page.style.setProperty(
            "--pull-stretch",
            `${stretch}px`
        );

        // La explosión se activa al superar esta distancia
        explosionReady = pullDistance >= PULL_THRESHOLD;

        if (event.cancelable) {
            event.preventDefault();
        }
    } else if (distance < 0) {
        resetPull();
    }
}, { passive: false });

// Al soltar el dedo, vuelve la página y explotan los corazones
document.addEventListener("touchend", () => {
    if (!isPulling) return;

    const shouldExplode = explosionReady;

    resetPull();

    if (shouldExplode) {
        createHeartExplosion();
    }
});

document.addEventListener("touchcancel", resetPull);

function resetPull() {
    isPulling = false;
    pullDistance = 0;
    explosionReady = false;

    page.classList.remove("is-pulling");
    page.style.setProperty("--pull-stretch", "0px");
}

// Explosión de corazones ❤️
function createHeartExplosion() {
    const colors = [
        "#ff4f87",
        "#ff1744",
        "#f48fb1",
        "#ffffff",
        "#ff80ab"
    ];

    const symbols = ["♥", "♡", "❤"];

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const heartCount = reduceMotion ? 8 : 35;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement("span");

        heart.className = "surprise-heart";
        heart.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 230;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance + 100;
        const rotation = Math.random() * 720 - 360;
        const size = 14 + Math.random() * 24;

        heart.style.setProperty(
            "--start-x",
            `${35 + Math.random() * 30}vw`
        );
        heart.style.setProperty(
            "--start-y",
            `${5 + Math.random() * 10}vh`
        );
        heart.style.setProperty("--dx", `${dx}px`);
        heart.style.setProperty("--dy", `${dy}px`);
        heart.style.setProperty("--rotation", `${rotation}deg`);
        heart.style.setProperty("--size", `${size}px`);
        heart.style.setProperty(
            "--heart-color",
            colors[Math.floor(Math.random() * colors.length)]
        );
        heart.style.setProperty(
            "--duration",
            `${reduceMotion ? 600 : 900 + Math.random() * 600}ms`
        );

        document.body.appendChild(heart);

        heart.addEventListener("animationend", () => {
            heart.remove();
        }, { once: true });
    }
}

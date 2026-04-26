<div class="wiggle pointer-events-none" aria-hidden="true">
    <svg viewBox="0 0 100 120" class="w-20 h-24" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <marker
                id="dramatic-arrow-head"
                viewBox="0 0 10 10"
                refX="2"
                refY="5"
                markerWidth="3"
                markerHeight="2.6"
                orient="auto"
            >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--rose)"/>
            </marker>
        </defs>
        <path
            d="M 50 110 Q 20 95, 30 60 Q 38 32, 55 22"
            stroke="var(--rose)"
            stroke-width="9"
            fill="none"
            stroke-linecap="round"
            marker-end="url(#dramatic-arrow-head)"
        />
    </svg>
    <div
        class="text-center text-[var(--rose)] font-extrabold text-sm tracking-widest -mt-1"
        style="text-shadow: 0 1px 2px rgba(0,0,0,0.15);"
    >
        NOW!
    </div>
</div>

<style>
    .wiggle {
        animation: wiggle 0.7s ease-in-out infinite alternate;
        filter: drop-shadow(0 3px 6px color-mix(in srgb, var(--rose) 35%, transparent));
        transform-origin: top center;
    }

    @keyframes wiggle {
        0%   { transform: translateY(0) rotate(-24deg) scale(1); }
        100% { transform: translateY(6px) rotate(-12deg) scale(1.06); }
    }
</style>

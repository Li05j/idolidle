<script lang="ts">
    let { onclick }: { onclick: () => void } = $props()
</script>

<button
    class="w-8 h-8 rounded-full grid place-items-center cursor-pointer transition-all duration-200 opacity-25 hover:scale-[1.05] active:scale-[0.95]"
    style="background: var(--btn-secondary);"
    {onclick}
    type="button"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
</button>

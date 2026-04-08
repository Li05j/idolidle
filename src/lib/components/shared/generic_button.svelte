<script lang="ts">
    let { 
        name = '',
        svg = '',
        onclick,
        variant = 'primary' as "primary" | "secondary" | "cute" | "none",
        class: customClass = '',
        disabled = false,
        type = 'button' as "button" | "submit" | "reset" | null | undefined,
        tooltip = '',
        ...restProps 
    } = $props()

    const baseClass = 'text-sm text-white rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] relative group inline-block cursor-pointer';

    let buttonClass = $derived.by(() => {
        let variantClass: string;
        switch (variant) {
            case 'primary':   variantClass = `${baseClass} btn-primary`; break;
            case 'secondary': variantClass = `${baseClass} btn-secondary`; break;
            case 'cute':      variantClass = `${baseClass} btn-cute`; break;
            case "none":      variantClass = ''; break;
        }
        return customClass ? `${variantClass} ${customClass}` : variantClass;
    });

    let tooltip_show = $state(false)
    $effect(() => {
        if (tooltip !== '') tooltip_show = true;
    })
</script>

<button
    class={buttonClass}
    onclick={onclick}
    {disabled}
    {type}
    {...restProps}
>
    {@html svg}{name}

    {#if tooltip_show && disabled}
        <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-sm text-white bg-[var(--text-primary)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {tooltip}
        </span>
    {/if}
</button>

<style>
    .btn-primary {
        background: var(--btn-primary);
    }
    .btn-primary:hover:not(:disabled) {
        background: var(--btn-primary-hover);
    }
    .btn-cute {
        background: var(--btn-cute);
    }
    .btn-cute:hover:not(:disabled) {
        background: var(--btn-cute-hover);
    }
    .btn-secondary {
        background: var(--btn-secondary);
    }
    .btn-secondary:hover:not(:disabled) {
        background: var(--btn-secondary-hover);
    }
    button:disabled {
        background: var(--btn-disabled);
        cursor: not-allowed;
        transform: none !important;
    }
</style>
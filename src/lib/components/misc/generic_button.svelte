<script lang="ts">
    let { 
        name = '',
        svg = '',
        onclick,
        variant = 'primary' as "primary" | "secondary" | "danger" | "none",
        class: customClass = '',
        disabled = false,
        type = 'button' as "button" | "submit" | "reset" | null | undefined,
        tooltip = '',
        ...restProps 
    } = $props()

    function getVariantStyle(): string {
        switch (variant) {
            case 'primary':
                return 'bg-blue-500 text-sm text-white rounded hover:bg-blue-600 disabled:bg-gray-400 relative group inline-block'
            case 'secondary':
                return 'bg-zinc-500 text-sm text-white rounded hover:bg-zinc-600 disabled:bg-gray-400'
            case 'danger':
                return 'bg-red-500 text-sm text-white rounded hover:bg-red-600 disabled:bg-gray-400'
            case "none":
                return ''
        }
    }

    const defaultButtonClass = getVariantStyle()
    
    // merge default and custom class
    const buttonClass = customClass ? `${defaultButtonClass} ${customClass}` : defaultButtonClass

    // only show tooltip if it exist
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


    <!-- idk im being dumb here surely it's fine -->
    {#if tooltip_show && disabled}
        <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {tooltip}
        </span>
    {/if}
</button>
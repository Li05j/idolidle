<script lang="ts">
    let { 
        name, 
        onclick,
        variant = 'primary' as "primary" | "secondary" | "danger" | "none",
        class: customClass = '',
        disabled = false,
        type = 'button' as "button" | "submit" | "reset" | null | undefined,
        ...restProps 
    } = $props()

    function getVariantStyle(): string {
        switch (variant) {
            case 'primary':
                return 'bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
            case 'secondary':
                return 'bg-orange-400 text-sm text-white px-4 py-2 rounded hover:bg-orange-500 disabled:bg-gray-400'
            case 'danger':
                return 'bg-red-500 text-sm text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400'
            case "none":
                return ''
        }
    }

    const defaultButtonClass = getVariantStyle()
    
    // merge default and custom class
    const buttonClass = customClass ? `${defaultButtonClass} ${customClass}` : defaultButtonClass
</script>

<button
    class={buttonClass}
    onclick={onclick}
    {disabled}
    {type}
    {...restProps}
>
    {name}
</button>
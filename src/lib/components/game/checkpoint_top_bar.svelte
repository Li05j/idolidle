<script lang="ts">
    import { ModalM } from "$lib/runtime/modal_manager.svelte";
    import { TodoCardM } from "$lib/runtime/todo_card_manager.svelte";
    import { CPs } from "$lib/state/checkpoints.svelte";
    import { msToSecF } from "$lib/utils/utils"
    import GenericButton from "../shared/generic_button.svelte";
    import RivalInfo from "$lib/components/modals/content/rival_info.svelte";
    import DramaticArrow from "./dramatic_arrow.svelte";

    let { handle_live } = $props()

    let progress_percent = $derived(Math.min((CPs.current_time_spent / CPs.current_total_time) * 100, 100));
    let pending = $derived(CPs.is_live_pending);

    $effect(() => {
        if (pending) {
            TodoCardM.deactivateCurrentActiveCard();
        }
    })

    function open_rival_info() {
        ModalM.open({ component: RivalInfo, size: 'lg', closeable: true });
    }

    const info_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/></svg>`;
</script>

{#if CPs.is_terminal}
    <div class="bg-[var(--surface-card)] p-3 rounded-b-2xl shadow-md mb-1 w-full text-center text-sm font-semibold text-[var(--text-primary)]">
        You're already the top idol — no more rivals to face.
    </div>
{:else}
    <div class="bg-[var(--surface-card)] p-3 rounded-b-2xl shadow-md mb-1 w-full">
        <div class="flex justify-between items-center mb-2">
            <div class="pl-2 pb-1 text-base font-bold text-[var(--text-primary)]">Time till next LIVE!</div>
            <div class="flex items-center gap-2">
                <GenericButton
                    svg={info_svg}
                    onclick={open_rival_info}
                    variant='cute'
                    class={"p-1.5 text-xs"}
                    title="LIVE info"
                />
                <div class="relative">
                    <GenericButton
                        name={pending ? '🎤 Go To LIVE!' : 'Go To LIVE'}
                        onclick={handle_live}
                        variant={pending ? 'cute' : 'secondary'}
                        class={`px-4 py-1 text-xs ${pending ? 'font-bold tracking-wide glow-pending' : ''}`}
                    />
                    {#if pending}
                        <div class="absolute top-full left-1/2 -translate-x-1/2 mt-6 z-50">
                            <DramaticArrow />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="w-full bg-[var(--progress-bg)] rounded-full h-3 mb-2 overflow-hidden">
            <div
                class="h-3 w-full rounded-full will-change-transform"
                style="transform: scaleX({progress_percent / 100}); transform-origin: left; background: linear-gradient(90deg, var(--progress-from), var(--progress-to));"
            ></div>
        </div>
        <div class="text-center text-xs text-[var(--text-muted)]">{msToSecF(CPs.current_time_spent)}/{msToSecF(CPs.current_total_time)}s</div>
    </div>
{/if}

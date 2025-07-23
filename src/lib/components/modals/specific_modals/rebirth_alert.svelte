<script lang="ts">
	import GenericButton from "$lib/components/misc/generic_button.svelte";
	import { Rebirth } from "$lib/stores/rebirth.svelte";

    let { onClose } = $props()
    const type = 'rebirth_alert'

    function on_no() {
        onClose(type)
    }

    function on_yes() {
        Rebirth.on_rebirth()
        onClose(type)
    }
</script>

<div class="flex flex-col justify-between min-h-[20vh] p-4 text-center">
    <div class="my-4">
        <p>Are you sure you want to treat all this as a Dream?</p>
        <p class="text-sm font-normal">(You will inherit some stats from before.)</p>
    </div>
    <div class="flex justify-between p-2">
          <GenericButton name={"No"} onclick={on_no} variant="secondary" class="px-8 py-2" />
          <GenericButton name={"Yes"} onclick={on_yes} variant="primary" class="px-8 py-2" />
    </div>
</div>

import { TodoBase } from '$lib/data/todo_type';
import type { ActionParams, LocationDefinition } from './location_definition';
import { wake_up } from './wake_up';
import { living_room } from './living_room';
import { park } from './park';
import { school } from './school';
import { mall } from './mall';
import { gym } from './gym';
import { maid_cafe } from './maid_cafe';

export const allLocations: LocationDefinition[] = [
    wake_up,
    living_room,
    park,
    school,
    mall,
    gym,
    maid_cafe,
];

export const locationMap = new Map<string, LocationDefinition>(
    allLocations.map(loc => [loc.location.name, loc])
);

export function buildTodoBase(params: ActionParams, then_fn?: () => void): TodoBase {
    return new TodoBase({
        name: params.name,
        type: params.type,
        base_time: params.base_time,
        desc: params.desc,
        tooltip: params.tooltip,
        rewards: params.rewards,
        one_off: params.one_off,
        haste_efficiency: params.haste_efficiency,
        spendings: params.spendings,
        extra_reward_fn: params.extra_reward_fn,
        check_disabled_fn: params.check_disabled_fn,
        then_fn,
    });
}

export function buildLocationTodo(def: LocationDefinition, then_fn: () => void): TodoBase {
    return new TodoBase({
        name: def.location.name,
        type: 'location',
        base_time: def.location.base_time,
        desc: def.location.desc,
        tooltip: def.location.tooltip,
        rewards: def.location.rewards,
        check_disabled_fn: def.location.check_disabled_fn,
        then_fn,
    });
}

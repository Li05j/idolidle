import type { Todo } from '$lib/types'
import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/stats.svelte"

let locations: Todo[] = [
    { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
]

let actions: Todo[] = [
    { type: 'action', name: 'Sing', base_duration: 3000, reward: () => sing.base++ },
    { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
    { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
    { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
    { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
];
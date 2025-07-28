import type { TodoBase } from '$lib/data/todo_type';
import { a_gym, a_gym_vip } from './actions_data/gym';
import { a_living_room, a_living_room_upgrarde } from "./actions_data/living_room";
import { a_maid_cafe, a_maid_worker } from './actions_data/maid_cafe';
import { a_mall } from './actions_data/mall';
import { a_park } from './actions_data/park';
import { a_idol_club, a_school } from './actions_data/school';

export const actions_data: Map<string, TodoBase[]> = new Map([
    ["Living Room", a_living_room],
    ["Living Room+", a_living_room_upgrarde],
    ["Park", a_park],
    ["School", a_school],
    ["Idol Club", a_idol_club],
    ["Mall", a_mall],
    ["Gym", a_gym],
    ["Gym VIP", a_gym_vip],
    ["Maid Cafe", a_maid_cafe],
    ["Maid Worker", a_maid_worker],
]);
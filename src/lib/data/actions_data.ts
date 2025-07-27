import type { TodoBase } from '$lib/data/todo_type';
import { a_living_room, a_living_room_upgrarde } from "./actions_data/living_room";
import { a_park } from './actions_data/park';
import { a_idol_club, a_school } from './actions_data/school';

export const actions_data: Map<string, TodoBase[]> = new Map([
    ["Living Room", a_living_room],
    ["Living Room+", a_living_room_upgrarde],
    ["Park", a_park],
    ["School", a_school],
    ["Idol Club", a_idol_club],
]);
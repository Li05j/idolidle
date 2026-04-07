import type { LocationDef } from './location_definition';
import { wake_up } from './wake_up';
import { living_room } from './living_room';
import { park } from './park';
import { school } from './school';
import { mall } from './mall';
import { gym } from './gym';
import { maid_cafe } from './maid_cafe';

export const allLocations: LocationDef[] = [
    wake_up,
    living_room,
    park,
    school,
    mall,
    gym,
    maid_cafe,
];

export const locationMap = new Map<string, LocationDef>(
    allLocations.map(loc => [loc.name, loc])
);

export const time_till_next_checkpoint = createCheckpoints()

export const fans = createCurrency();
export const moni = createCurrency();

export const sta = createStat();
export const sing = createStat();
export const dance = createStat();
export const charm = createStat();
export const eloq = createStat();

function createCheckpoints() {
	const checkpoints = [200, 300, 400]
	let multi = $state([1.0, 1.0, 1.0])
	let final = ((idx: number) => checkpoints[idx] * multi[idx])
	let current_remaining_time = final(0)

	return {
		get remaining_time() { return current_remaining_time }, set remaining_time(t) { current_remaining_time = t },
		get_checkpoints(idx: number) { return checkpoints[idx] },
		get_multi(idx: number) { return multi[idx] }, set_multi(idx: number, val: number) { multi[idx] = val },
		get_final(idx: number) { return final(idx) }
	}
}

function createCurrency(baseInit = 0, multiInit = 1.0) {
    let base = $state(baseInit);
    let multi = $state(multiInit);
    const final = (() => base * multi);

    return { 
		get base() { return base }, set base(v) { base = v },
        get multi() { return multi }, set multi(v) { multi = v },
        get final() { return final() } 
	};
}

function createStat(baseInit = 1.0, flatInit = 0.0, multiInit = 1.0) {
  	let base = $state(baseInit);
  	let flat = $state(flatInit);
  	let multi = $state(multiInit);
  	const final = (() => (base + flat) * multi);

  	return { 
		get base() { return base }, set base(v) { base = v },
        get flat() { return flat }, set flat(v) { flat = v },
        get multi() { return multi }, set multi(v) { multi = v },
        get final() { return final() } 
	};
}
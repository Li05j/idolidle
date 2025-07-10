export const fans = createCurrency();
export const moni = createCurrency();

export const sta = createStat();
export const sing = createStat();
export const dance = createStat();
export const charm = createStat();
export const eloq = createStat();

function createCurrency(baseInit = 0, multiInit = 1.0) {
    let base = $state(baseInit);
    let multi = $state(multiInit);
    const final = (() => base * multi);

    return { get base() { return base }, set base(v) { base = v },
           	get multi() { return multi }, set multi(v) { multi = v },
           	get final() { return final() } };
}

function createStat(baseInit = 1.0, flatInit = 0.0, multiInit = 1.0) {
  	let base = $state(baseInit);
  	let flat = $state(flatInit);
  	let multi = $state(multiInit);
  	const final = (() => (base + flat) * multi);

  	return { get base() { return base }, set base(v) { base = v },
           	get flat() { return flat }, set flat(v) { flat = v },
           	get multi() { return multi }, set multi(v) { multi = v },
           	get final() { return final() } };
}
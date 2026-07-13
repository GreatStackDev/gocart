/**
 * tradrsAvenue — SA Zone-based Shipping Algorithm
 * Simple distance/zone-based cost calculation.
 */

const BASE_RATE = 50; // R50 base fee
const PER_KG_RATE = 10; // R10 per additional kg over 1kg

// Simplified zone matrix (origin_province -> destination_province = multiplier)
const ZONES = {
    "Gauteng": { "Gauteng": 1, "Western Cape": 1.5, "KwaZulu-Natal": 1.3, "default": 2 },
    "Western Cape": { "Western Cape": 1, "Gauteng": 1.5, "KwaZulu-Natal": 1.8, "default": 2 },
    "KwaZulu-Natal": { "KwaZulu-Natal": 1, "Gauteng": 1.3, "Western Cape": 1.8, "default": 2 },
    "default": { "default": 2 }
};

export function calculateShipping(storeProvince, buyerProvince, weightKg = 1, isFreeShipping = false) {
    if (isFreeShipping) return 0;

    const origin = ZONES[storeProvince] ? storeProvince : "default";
    const dest = ZONES[origin][buyerProvince] ? buyerProvince : "default";
    const multiplier = ZONES[origin][dest];

    const weightFee = weightKg > 1 ? (weightKg - 1) * PER_KG_RATE : 0;

    return (BASE_RATE + weightFee) * multiplier;
}

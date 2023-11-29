export interface DofusSpell {
    id: number;
    spellId: number;
    grade: number;
    spellBreed: number;
    apCost: number;
    minRange: number;
    range: number;
    castInLine: boolean;
    castInDiagonal: boolean;
    castTestLos: boolean;
    criticalHitProbability: number;
    needFreeCell: boolean;
    needTakenCell: boolean;
    needVisibleEntity: boolean;
    needCellWithoutPortal: boolean;
    portalProjectionForbidden: boolean;
    needFreeTrapCell: boolean;
    rangeCanBeBoosted: boolean;
    maxStack: number;
    maxCastPerTurn: number;
    maxCastPerTarget: number;
    minCastInterval: number;
    initialCooldown: number;
    globalCooldown: number;
    minPlayerLevel: number;
    hideEffects: boolean;
    hidden: boolean;
    playAnimation: boolean;
    statesCriterion: string;
    effects: DofusEffect[],
    criticalEffect: DofusEffect[],
    previewZones: [],
    nameId: number;
    descriptionId:number;
    iconId: number;
}

export interface DofusEffect {
    targetMask: string;
    diceNum: number;
    visibleInBuffUi: boolean;
    baseEffectId: number;
    visibleInFightLog: boolean;
    targetId: number;
    effectElement: number;
    effectUid: number;
    dispellable: number;
    triggers: string;
    spellId: number;
    duration: number;
    random: number;
    effectId: number;
    delay: number;
    diceSide: number;
    visibleOnTerrain: boolean;
    visibleInTooltip: boolean;
    rawZone: string;
    forClientOnly: boolean;
    value: number;
    order: number;
    group: number;
}

export interface DofusSet {
    id: string,
    items: number[],
    nameId: string,
    bonusIsSecret: boolean,
    effects: DofusEffect[],
    version: string
}

export interface DofusItem {
    id: number;
    nameId: number;
    typeId: number;
    descriptionId: number;
    iconId: number;
    level: number;
    realWeight: number;
    cursed: boolean;
    useAnimationId: number;
    usable: boolean;
    targetable: boolean;
    exchangeable: boolean;
    price: number;
    twoHanded: boolean;
    etheral: boolean;
    itemSetId: number;
    criteria: string;
    criteriaTarget: string;
    hideEffects: boolean;
    enhanceable: boolean;
    nonUsableOnAnother: boolean;
    appearanceId: number;
    secretRecipe: boolean;
    recipeSlots: number;
    recipeIds: [],
    dropMonsterIds: [],
    dropTemporisMonsterIds: [],
    objectIsDisplayOnWeb: boolean;
    bonusIsSecret: boolean;
}

export interface DofusPreviewZone {
    id: number;
    rawDisplayZone: string;
    isDefaultPreviewZoneHidden: boolean;
    casterMask: string;
    rawActivationZone: string;
    activationMask: string;
}
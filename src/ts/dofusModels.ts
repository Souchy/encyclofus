export interface DofusSpellNew {
    m_flags: number;
    id: number;
    nameId: number;
    descriptionId: number;
    typeId: number;
    order: number;
    scriptParams: string;
    scriptParamsCritical: string;
    scriptId: number;
    scriptIdCritical: number;
    iconId: number;
    spellLevels: number[],
    boundScriptUsageData: [];
    criticalHitBoundScriptUsageData: [];
    basePreviewZoneDescr: DofusPreviewZoneDescr;
    adminName: string;
}

export interface DofusPreviewZoneDescr {
    cellIds: [];
    shape: number;
    param1: number;
    param2: number;
    damageDecreaseStepPercent: number;
    maxDamageDecreaseApplyCount: number;
    isStopAtTarget: boolean;
}

export interface DofusSpellLevel {
    m_flags: number;
    id: number;
    spellId: number;
    grade: number;
    spellBreed: number;
    apCost: number;
    minRange: number;
    range: number;
    criticalHitProbability: number;
    maxStack: number;
    maxCastPerTurn: number;
    maxCastPerTarget: number;
    minCastInterval: number;
    initialCooldown: number;
    globalCooldown: number;
    minPlayerLevel: number;
    statesCriterion: string;
    effects: DofusEffectUnity[],
    criticalEffect: DofusEffectUnity[],
    previewZones: [],
}

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
    descriptionId: number;
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

export interface DofusEffectUnity {
    diceNum: number;
    diceSide: number;
    displayZero: boolean;
    value: number;
    m_flags: number;
    effectUid: number;
    baseEffectId: number;
    effectId: number;
    order: number;
    targetId: number;
    targetMask: string;
    duration: number;
    random: number;
    group: number;
    modificator: number;
    dispellable: number;
    delay: number;
    triggers: string;
    effectElement: number;
    spellId: number;
    effectTriggerDuration: number; 
    zoneDescr: DofusPreviewZoneDescr;
    // visibleInBuffUi: boolean;
    // visibleInFightLog: boolean;
    // visibleOnTerrain: boolean;
    // visibleInTooltip: boolean;
    // rawZone: string;
    // forClientOnly: boolean;
}


export interface DofusSet {
    id: number,
    items: number[],
    nameId: string,
    bonusIsSecret: boolean,
    effects: DofusEffect[][],
    version: string
    itemsData: DofusItem[]
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
    possibleEffects: DofusEffect[];
    evolutiveEffectIds: [],
    favoriteSubAreas: [],
    favoriteSubAreasBonus: number;
    craftXpRatio: number;
    needUseConfirm: boolean;
    isDestructible: boolean;
    isSaleable: boolean;
    isColorable: boolean;
    isLegendary: boolean;
    craftVisible: string;
    craftConditional: string;
    craftFeasible: string;
    visibility: string;
    recyclingNuggets: number;
    favoriteRecyclingSubareas: [],
    containerIds: [],
    resourcesBySubarea: [],
    importantNoticeId: number;
    changeVersion: string;
    tooltipExpirationDate: number;
    criticalHitProbability: number;
    range: number;
    castInLine: boolean;
    apCost: number;
    castInDiagonal: boolean;
    maxCastPerTurn: number;
    version: string;
}

export interface DofusPreviewZone {
    id: number;
    rawDisplayZone: string;
    isDefaultPreviewZoneHidden: boolean;
    casterMask: string;
    rawActivationZone: string;
    activationMask: string;
}

export interface DofusEffectModel {
    id: number;
    descriptionId: number;
    iconId: number;
    characteristic: number;
    category: number;
    operator: string;
    showInTooltip: boolean;
    useDice: boolean;
    forceMinMax: boolean;
    boost: boolean;
    active: boolean;
    oppositeId: number;
    theoreticalDescriptionId: number;
    theoreticalPattern: number;
    showInSet: boolean;
    bonusType: number;
    useInFight: boolean;
    effectPriority: number;
    effectPowerRate: number;
    elementId: number;
}

export interface DofusCharacteristic {
    id: number;
    keyword: string;
    nameId: number;
    asset: string;
    categoryId: number;
    visible: boolean;
    order: number;
    scaleFormulaId: number;
    upgradable: boolean;
}

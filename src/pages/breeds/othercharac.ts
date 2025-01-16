import { bindable, inject } from "aurelia";
import { I18N } from "@aurelia/i18n";
import { db } from '../../DofusDB/db';

export class othercharac {

	@bindable
	public spell;
	@bindable
	public spellid;
	@bindable
	public selectedGrade;

	public constructor(private db: db, @I18N private readonly i18n: I18N) {
	}

	public get spellLevel() {
		if(this.db.checkFeature("spelllevels")) {
			return this.db.data.getSpellLevel(this.spellid, this.selectedGrade);
		} else {
			return this.spell;
		}
	}

	public translate(obj: any) {
		return this.i18n.tr(obj as string);
	}

	public get castInLine() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 1) > 0;
		else
			return this.spellLevel.castInLine;
	}
	public get castInDiagonal() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 2) > 0;
		else
			return this.spellLevel.castInDiagonal;
	}
	public get castTestLos() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 4) > 0;
		else
			return this.spellLevel.castTestLos;
	}
	public get needFreeCell() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 8) > 0;
		else
			return this.spellLevel.needFreeCell;
	}
	public get needTakenCell() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 16) > 0;
		else
			return this.spellLevel.needTakenCell;
	}
	public get needFreeTrapCell() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 32) > 0;
		else
			return this.spellLevel.needFreeTrapCell;
	}
	public get rangeCanBeBoosted() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 64) > 0;
		else
			return this.spellLevel.rangeCanBeBoosted;
	}
	public get hideEffects() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 128) > 0;
		else
			return this.spellLevel.hideEffects;
	}
	public get hidden() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 256) > 0;
		else
			return this.spellLevel.hidden;
	}
	public get playAnimation() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 512) > 0;
		else
			return this.spellLevel.playAnimation;
	}
	public get needVisibleEntity() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 1024) > 0
		else
			return this.spellLevel.needVisibleEntity;
	}
	public get needCellWithoutPortal() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 2048) > 0;
		else return this.spellLevel.needCellWithoutPortal;
	}
	public get portalProjectionForbidden() {
		if (this.db.checkFeature("unity"))
			return (this.spellLevel.m_flags & 4096) > 0;
		else
			return this.spellLevel.portalProjectionForbidden;
	}

}

// public enum SpellLevelFlags {
// 	CastInLine = 1,
// 	CastInDiagonal = 2,
// 	CastTestLos = 4,
// 	NeedFreeCell = 8,
// 	NeedTakenCell = 16,
// 	NeedFreeTrapCell = 32,
// 	RangeCanBeBoosted = 64,
// 	HideEffects = 128,
// 	Hidden = 256,
// 	PlayAnimation = 512,
// 	NeedVisibleEntity = 1024,
// 	NeedCellWithoutPortal = 2048,
// 	PortalProjectionForbidden = 4096,
// }

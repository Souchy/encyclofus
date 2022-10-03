import { bindable, inject } from "aurelia";
import { I18N } from "@aurelia/i18n";

export class othercharac {
	
	@bindable
	public spell;

	public constructor(@I18N private readonly i18n: I18N) {
	}
	
	public translate(obj: any) {
		return this.i18n.tr(obj as string);
	}

}

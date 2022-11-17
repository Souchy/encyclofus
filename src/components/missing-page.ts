export class MissingPage {
	public static parameters = ['id'];
	public missingComponent: string ;
  
	public load(parameters: {id: string}): void {
	  this.missingComponent = parameters.id;

	  location.href = "/"
	}
  }
  
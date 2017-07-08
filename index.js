const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export class Model {
	error = {};

	constructor(validators){
		this.validators = validators;
	}

	valid(val){
		this.value = val;
		this.error = {};

		for (var i = this.validators.length - 1; i >= 0; i--) {
			let errors = this.validators[i](this.value);
			if(errors){
				this.error = { errors, ..this.error };
			} 

			this.valid = errors === null;
		}

		this.invalid = !this.valid;
	}

	hasError(name){
		return this.error[name];
	}
}

/**
 *
 * const myValidate = (val) => {
 *  return { isFail : 'ForMe' }
 * };
 *
 * var models = {
 *  name  : [ Validator.require(true), Validator.minLength(2), Validator.maxLength(5) ],
 *  email : [ Validator.require(false), Validator.email() ],
 *  years : [ Validator.min(18), Validator.min(100) ],
 *  url   : [ Validator.patern('[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)') ]
 *  coment: [ Validator.free() ]
 * };
 * 
 * var form = new Validator(models);
 * form.is('email', 'thisIsNotAEmail');
 * form.invalid // TRUE
 * form.valid // FALSE
 * form.email.valid // FALSE
 * form.email.hasError('email');
 * form.email.validators.push(Validator.require(true));
 * 
 */


export default class Validator {
	static free (){
		return (val) => null;
	}

	static require (is=true){
		return (val) => is && ( val == null || ( val + '' ).length === 0 ) ? { require : true } : null;
	}

	static email (){
		return (val) => EMAIL_REGEXP.test( val + '' ) ? null : { email : true };
	}

	static minLength (num){
		return (val) => ( val + '' ).length < num ? { minLength : true } : null;
	}

	static maxLength (num){
		return (val) => ( val + '' ).length <= num ? { maxLength : true } : null;
	}

	static patern (part){
		let pats = typeof part.test == 'function' ? part : new RegExp(part);
		return (val) => pats.test(val) ? null : { 'pattern': pats.toString() };
	}

	static max(num){
		return (val) => {
			let val = parseFloat(val);
			return val != NaN && val > num ? { 'max': num } : null;
		};
	}

	static min(num){
		return (val) => {
			let val = parseFloat(val);
			return val != NaN && val < num ? { 'max': num } : null;
		};
	}

	/**
	 * [constructor description]
	 * @param  {Object} models [description]
	 */
	constructor(models){
		for (let i in models) {
			this[models[i]] = new Model(models[i]);
		}
	}

	/**
	 * [is description]
	 * @param  {String}  name Name Model
	 * @param  {Any}     val  Value
	 * @return {Validator}
	 */
	is(name, val){
		this[name].valid(val);
		this.values = {};
		this.valid = true;

		for (let i in this) {
			if(this[i] instanceof Model ){
				this.values[i] = this[i].value;

				if(this[i].hasError('require')){
					this.valid = this[i].valid && this.valid;
				}
			}
		}

		this.invalid = !this.valid;

		return this;
	}

	/**
	 * [hasError description]
	 * @param  {String}  model Model Name
	 * @param  {String}  name  Error name
	 * @return {Any}
	 */
	hasError(model, error){
		return this[model].error[error];
	}
}
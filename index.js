const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export class Model {

	error = {};
	value = '';

	/**
	 * [constructor description]
	 * @param  {Functions[]} validators [description]
	 */
	constructor(validators){
		this.validators = validators;
		this.setValue('');
	}

	/**
	 * [setValue description]
	 * @param  {Any} val [description]
	 */
	setValue (val){
		this.val = val;
		this.error = {};

		for (var i = this.validators.length - 1; i >= 0; i--) {
			var error = this.validators[i](this.value);

			if(error){
				Object.assign(this.error, error);
			}
		}

		for (var i in this.error) {
			this.invalid = !!this.error[i];
		}
	}

	get valid(){
		return !this.invalid;
	}

	/**
	 * [hasError description]
	 * @param  {String}  name [description]
	 * @return {Boolean}      [description]
	 */
	hasError(name){
		return !!this.error[name];
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
	/**
	 * [require description]
	 * @param  {Boolean} is [description]
	 * @return {Any}
	 */
	static require (is=true){
		return (val) => is && ( val == null || ( val + '' ).length !== 0 ) ?
			{ require : true } : false;
	}

	/**
	 * [free description]
	 * @param  {Boolean} is [description]
	 * @return {Any}
	 */
	static free (is=false){
		return Validator.require(is);
	}

	/**
	 * [email description]
	 * @return {Any}
	 */
	static email (){
		return (val) => EMAIL_REGEXP.test( val + '' ) ?
			null : { email : true };
	}

	/**
	 * [minLength description]
	 * @param  {number} num
	 * @return {Any}
	 */
	static minLength (num){
		return (val) => ( val + '' ).length < num ?
			{ minLength : true } : false;
	}

	/**
	 * [maxLength description]
	 * @param  {number} num
	 * @return {Any}
	 */
	static maxLength (num){
		return (val) => ( val + '' ).length > num ?
			{ maxLength : true } : false;
	}

	/**
	 * [patern description]
	 * @param  {String|RegExp} part
	 * @return {Any}
	 */
	static patern (part){
		let pats = typeof part.test == 'function' ? part : new RegExp(part);
		return (val) => pats.test(val) ?
			null : { 'pattern': pats.toString() };
	}

	/**
	 * [max description]
	 * @param  {number} num
	 * @return {Any}
	 */
	static max (num){
		return (val) => {
			let vax = parseFloat(val);
			return vax != NaN && vax > num ? { 'max': num } : false;
		};
	}

	/**
	 * [min description]
	 * @param  {number} num [description]
	 * @return {Any}
	 */
	static min (num){
		return (val) => {
			let vax = parseFloat(val);
			return vax != NaN && vax < num ?
				{ 'max': num } : false;
		};
	}

	/**
	 * [select description]
	 * @param  {Object} obj
	 * @return {Any}
	 */
	static select (obj){
		return (val) => ( val == null || ( val + '' ).length !== 0 ) && obj[val] != null ?
			null : { 'select': true };
	}

	model = {};
	values = {};
	valid = true;

	/**
	 * [constructor description]
	 * @param  {Object} models [description]
	 */
	constructor (models){
		for (let i in models) {
			this.model[i] = new Model(models[i]);
		}
	}

	/**
	 * [is description]
	 * @param  {String}  name Name Model
	 * @param  {Any}     val  Value
	 * @return {Validator}
	 */
	is (name, val){
		this.model[name].setValue(val);
		this.values = {};
		this.valid = true;

		for (let i in this) {
			if(this.model[i] instanceof Model ){
				this.values[i] = this.model[i].value;
				this.valid = this.model[i].valid && this.valid;
			}
		}

		return this;
	}

	/**
	 * [hasError description]
	 * @param  {String}  model Model Name
	 * @param  {String}  name  Error name
	 * @return {Any}
	 */
	hasError (model, error){
		return this.model[model].error[error];
	}

	get names (){
		let name = [];
		for (let i in this) {
			if(this.model[i] instanceof Model ){
				name.push(i);
			}
		}

		return name;
	}

	get invalid(){
		return !this.valid;
	}
}
## Validator-Models

Install

	npm install validator-models

Used

	import Validator form 'validator-models';
	const myValidate = (val) => {
	  return { isFail : 'ForMe' }
	};

	var models = {
	  name  : [ Validator.require(true), Validator.minLength(2), Validator.maxLength(5) ],
	  email : [ Validator.require(false), Validator.email() ],
	  years : [ Validator.min(18), Validator.min(100) ],
	  url   : [ Validator.patern('[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)') ]
	  coment: [ Validator.free() ]
	};
	
	var form = new Validator(models);
	form.is('email', 'thisIsNotAEmail');
	form.invalid // TRUE
	form.valid // FALSE
	form.email.valid // FALSE
	form.email.hasError('email');
	form.email.validators.push(Validator.require(true));


In reactNative

	class MyCool extend compoment {
		static myForm = {
			name  : [ Validator.require(true), Validator.minLength(2), Validator.maxLength(5) ],
			email : [ Validator.require(false), Validator.email() ],
			years : [ Validator.min(18), Validator.min(100) ],
			url   : [ Validator.patern('[-a-zA-Z0-9@:%._\+~#=]{2,256}\.a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)') ]
			coment: [ Validator.free() ]
		};
		state = {};

		constructor(props){
			super(props);

			this.form = new Validator(MyCool.myForm);
		}

		change (model, val){
			this.form.is(model, val);
			this.setState({ data : this.form.value });
		}

		render(){
			return <View>
				<TextInput
					style={this.form.name.invalid ? style.error : style.normal }
					value={this.state.data.name}
					onChangeText={this.change.bind(this, 'name')}/>
				<TextInput
					style={this.form.email.hasError('email') ? style.error : style.normal  }
					value={this.state.data.email}
					onChangeText={this.change.bind(this, 'email')}/>
				<TextInput
					style={this.form.years.hasError('min') ? style.error : style.normal  }
					value={this.state.data.years}
					onChangeText={this.change.bind(this, 'years')}/>
				<TextInput
					style={this.form.url.hasError('patern') ? style.error : style.normal  }
					onChangeText={this.change.bind(this, 'url')}/>
				<TextInput
					style={this.form.coment.valid ? style.error : style.normal  }
					value={this.state.data.coment}
					onChangeText={this.change.bind(this, 'coment')}/>
				<Text>The form is {this.form.valid ? 'VALID' : 'INVALID'}</Text>
				<Text>The form is {this.form.invalid ? 'ERROR' : 'NOT ERROR'}</Text>
			</View>
		}
	}

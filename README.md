## Validator-Models

Install

	npm install validator-models

Used
```javascript
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
```

In reactNative

```jsx
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
    this.state = {
      form = new Validator(MyCool.myForm)
    };
  }
  change (model, val){
    this.setState({ form : this.state.form.is(model, val) });
  }
  render(){
    return <View>
      <TextInput
        style={this.state.form.name.invalid ? style.error : style.normal }
        value={this.state.form.name.value}
        onChangeText={this.change.bind(this, 'name')}/>
      <TextInput
        style={this.state.form.email.hasError('email') ? style.error : style.normal  }
        value={this.state.form.email.value}
        onChangeText={this.change.bind(this, 'email')}/>
      <TextInput
        style={this.state.form.years.hasError('min') ? style.error : style.normal  }
        value={this.state.form.years.value}
        onChangeText={this.change.bind(this, 'years')}/>
      <TextInput
        style={this.state.form.url.hasError('patern') ? style.error : style.normal  }
        onChangeText={this.change.bind(this, 'url')}/>
      <TextInput
        style={this.state.form.coment.valid ? style.error : style.normal  }
        value={this.state.form.coment.value}
        onChangeText={this.change.bind(this, 'coment')}/>
      <Text>The form is {this.state.form.valid ? 'VALID' : 'INVALID'}</Text>
      <Text>The form is {this.state.form.invalid ? 'ERROR' : 'NOT ERROR'}</Text>
    </View>
  }
}
```

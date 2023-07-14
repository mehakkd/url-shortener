import React from "react";
import { nanoid } from 'nanoid';
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri, isWebUrl } from 'valid-url';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            longURL: '',
            preferedAlias: '',
            generatedURL: '',
            loading: false,
            errors: [],
            errorMessage: {},
            toolTipMessage: 'Copy to Clip Board'
        }
    }

    //When the user clicks submit, this method is called
    onSubmit = async (event) => {
        event.preventDefault(); //prevents page from reloading when user clicks submit
        this.setState({
            loading: true,
            generatedURL: ''
        })

        //validate the input the user has submitted
        var isFormValid = await this.validateInput()
        if (!isFormValid) {
            return false
        }

        //if the user has a preferred alias we use it. if not, we generate another
        //using the nanoid() method
        var generatedKey = nanoid(5); //creates a random combo of 5 characters in length
        var generatedURL = "minilinkit.com/" + generatedKey; //name of my site + random combo

        if (this.state.preferedAlias !== '') {
            generatedKey = this.state.preferedAlias;
            generatedURL = "minilinkit.com/" + this.state.preferedAlias;
        }

        //write the contents of the generated url and og url to the database
        const db = getDatabase(); //creates a reference to the firebase database
        //writes the following information to the database with the reference of the key
        set(ref(db, '/' + generatedKey), {
            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: this.state.generatedURL,
        }).then((result) => {
            this.setState({
                generatedURL: generatedURL,
                loading: false,
            })
        }).catch((e) => {
            //Handle error
        })
    }

    //checks if field has an error
    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }

    //saves the content of the form as the user is typing
    handleChange = (e) => {
        const { id, value } = e.target;
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    //goes through form and makes sure it is all valid (called in isFormValid)
    validateInput = async () => {  //async means this function always returns a promise (makes result available to everythign else that needs it)
        var errors = [];
        var errorMessages = this.state.errorMessage; //make sure system isn't cleared, so use what msgs were there before

        //validate longURL
        if (this.state.longURL.length == 0) {
            errors.push("longURL");
            errorMessages["longURL"] = "Please enter your URL!";
        } else if (!isWebUri(this.state.longURL)) {
            errors.push("longURL");
            errorMessages["longURL"] = "Please enter a URL in the form of https://www....";
        }

        //validate preffered alias
        if (this.state.preferedAlias !== '') {
            if (this.state.preferedAlias.length > 7) { //if user's chosen alias is longer than 7 characters, send error
                errors.push("suggestedAlias");
                errorMessages["suggestedAlias"] = "Please enter an alias less than 7 characters";
            } else if (this.state.preferedAlias.indexOf(' ') > 0) { //if there is a space in the alias send error
                errors.push("suggestedAlias");
                errorMessages["suggestedAlias"] = "Spaces are not allowed in URLs";
            }

            //check if alias already exists in our database
            var keyExists = await this.checkKeyExists();

            if (keyExists.exists()) {
                errors.push("suggestedAlias");
                errorMessages["suggestedAlias"] = "The alias you have entered already exists. Please enter another one.";
            }
        }

        this.setState({
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        if (errors.length > 0) {
            return false;
        }
        return true;
    }

    checkKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, '/${this.state.preferedAlias}')).catch((error) => {
            return false;
        });
    }

    //saves the generatedURL as copied and changes text to show Copied!
    copyToClipBoard = () => {
        navigator.clipboard.writeText(this.state.generatedURL);
        this.setState({
            toolTipMessage: "Copied!"
        })
    }

    render() {
        return (
            <div className="container">
                <form autoComplete="off">
                    <h3>Url Shortner!</h3> 

                    <div className = "form-group">
                        <label>Enter your Long URL</label>
                        <input
                            id="longURL"
                            onChange={this.handleChange}
                            value={this.state.longURL} 
                            type="url"
                            required
                            className={
                                this.hasError("longURL")
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            placeholder="https://www..."
                        />
                    </div>

                    <div
                        className={
                            this.hasError("longURL") ? "text-danger" : "visually-hidden"
                        }
                    >
                        {this.state.errorMessage.longURL}
                    </div>

                    
                </form>
            </div>
        )
    }

}
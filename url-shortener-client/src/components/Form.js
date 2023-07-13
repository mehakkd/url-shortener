import React from "react";
import { nanoid } from 'nanoid';
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUrl } from 'valid-url';
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
        set (ref(db, '/'+ generatedKey), {
            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: this.state.generatedURL,
        }).then((result) => {
            this.setState({
                generatedURL: generatedURL,
                loading : false,
            })
        }).catch((e) => {
            //Handle error
        })
    }

}
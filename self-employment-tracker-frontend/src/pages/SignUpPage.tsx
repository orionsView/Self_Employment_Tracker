import { supabase } from '../supabaseClient'
import Header from "../components/Header"
import TextInputField from '../components/TextInputField'
import type { style } from '../components/TextInputField'
import { InputBase, BorderCard, LabelText } from '../constants/ui'
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'

type inputType = {
    email: string,
    password: string,
    confirmPassword: string
}
type validType = {
    email: boolean,
    password: boolean,
    confirmPassword: boolean
}
function SignUpPage() {
    function handleSignUp() {
        if (!(validity.email && validity.password && validity.confirmPassword)) {
            console.log("invalid state: ", validity)
            alert("Make sure you have filled out all required fields correctly")
        } else {
            supabase.auth.signUp({
                email: currentInput.email,
                password: currentInput.password
            }).then(({ error }) => {
                if (error) {
                    console.error('Sign up error:', error.message);
                    alert("Make sure you are using a valid email address")
                } else {
                    console.log('Sign up successful');
                    window.location.href = "/login";
                    alert('Account Created Successfully!');
                }
            });
        }
    }


    const textInputStyle: style = {
        ContainerStyle: "flex flex-row justify-between items-center w-[100%] ",
        InputStyle: InputBase,
        LabelStyle: LabelText
    }



    const [currentInput, setCurrentInput] = useState<inputType>(
        {
            email: "",
            password: "",
            confirmPassword: ""
        }
    );

    const [validity, setValidity] = useState<validType>(
        {
            email: false,
            password: false,
            confirmPassword: false
        }
    );

    const [passwordConfimationRegex, setPasswordConfirmationRegex] = useState<RegExp>(new RegExp(""));


    useEffect(() => {
        const escapeRegex = currentInput.password.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


        setPasswordConfirmationRegex(new RegExp(`^${escapeRegex}$`));

        console.log(passwordConfimationRegex);
        console.log(currentInput);
    }, [currentInput.password])

    const navigate = useNavigate();



    return (
        <>

            <div className="h-[100%] w-[100vw] flex flex-col items-center">

                <Header mainTitle="Sign Up" subTitle='Fill out the form to sign up' />
                {/* Sign In Form */}
                <div className={`flex flex-col h-[30%] w-[80%] items-center justify-between ${BorderCard}`} >
                    {/* Email */}
                    <TextInputField
                        Label="Email"
                        Placeholder="Email"
                        Type="text"
                        Style={textInputStyle}
                        validationRegex={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}

                        onChange={(e) => setCurrentInput({ email: e.target.value, password: currentInput.password, confirmPassword: currentInput.confirmPassword })}
                        currentValue={currentInput.email}
                        warningMessage='Please enter a valid email address (e.g., user@example.com).'
                        setValidity={(e) => setValidity({ email: e, password: validity.password, confirmPassword: validity.confirmPassword })}
                        onEnter={handleSignUp}
                    />

                    {/* Password */}
                    <TextInputField
                        Label="Password"
                        Placeholder="Password"
                        Type="password"
                        Style={textInputStyle}
                        validationRegex={/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/}
                        onChange={(e) => setCurrentInput({ email: currentInput.email, password: e.target.value, confirmPassword: currentInput.confirmPassword })}
                        currentValue={currentInput.password}
                        warningMessage='Must be at least 8 characters long. Must include at least one uppercase letter, number, and special character.'
                        setValidity={(e) => setValidity({ email: validity.email, password: e, confirmPassword: validity.confirmPassword })}
                        onEnter={handleSignUp}
                    />

                    {/* Confirm Password */}
                    <TextInputField
                        Label="Confirm Password"
                        Placeholder="Confirm Password"
                        Type="password"
                        Style={textInputStyle}
                        validationRegex={passwordConfimationRegex}
                        onChange={(e) => setCurrentInput({ email: currentInput.email, password: currentInput.password, confirmPassword: e.target.value })}
                        currentValue={currentInput.confirmPassword}
                        warningMessage='Passwords must match.'
                        setValidity={(e) => setValidity({ email: validity.email, password: validity.password, confirmPassword: e })}
                        onEnter={handleSignUp}
                    />
                    {/* Submit Button */}
                    <div className="flex justify-center items-center ">
                        <button onClick={handleSignUp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                        </button>
                    </div>
                </div>
                <p className="text-[4vw] text-nowrap text-blue-500 mt-4" onClick={() => { window.location.href = "/login" }}>Already have an account?</p>

            </div>
        </>
    )
}

export default SignUpPage
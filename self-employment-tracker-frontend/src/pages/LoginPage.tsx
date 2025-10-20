import Header from "../components/Header"
import { supabase } from '../supabaseClient'
import TextInputField from "../components/TextInputField"
import type { style } from "../components/TextInputField"
import { InputBase, BorderCard, LabelText } from '../constants/ui'
import { useState } from "react"
import GoogleLogo from '../assets/google-logo.svg'
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import SubmitButton from "../components/SubmitButton"

type inputType = { email: string, password: string }
function LoginPage() {


    const navigate = useNavigate();
    const logoClassName: string = "w-30"




    const handleGoogleLogin = async () => {
        // Use window.location.origin for dynamic base URL
        const redirectUrl = `${window.location.origin}/menu`;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        });

        console.log('Google login with: ', redirectUrl);

        if (error) {
            console.error('Google login error:', error.message);
        }
    }

    function handleLogin() {
        console.log("submitting login")
        supabase.auth.signInWithPassword({
            email: currentInput.email,
            password: currentInput.password
        }).then(({ error }) => {
            if (error) {
                console.error('Sign in error:', error.message);
                alert("Invalid email or password")
            } else {
                console.log('Sign in successful');
                navigate("/menu");
            }
        })

    }

    const inputTextStyle: style = {
        ContainerStyle: "flex flex-col items-center w-[100%] ",
        InputStyle: InputBase,
        LabelStyle: LabelText
    }

    const [currentInput, setCurrentInput] = useState<inputType>({ email: "", password: "" });


    return (
        <>
            <NavBar showMenu={false} />
            <div className="flex flex-col items-center h-[90%] w-[100%]">
                <Header mainTitle="Login" subTitle="Enter information/Sign in with Google" />


                <div className={`flex flex-col items-center h-[50%] w-[90vw] justify-between mb-4 `}>
                    {/* Sign In Form */}
                    <div className={`flex flex-col h-[50%] w-[100%] items-center justify-between rounded-lg ${BorderCard}`}>
                        {/* Email */}
                        <TextInputField
                            Label="Email"
                            Type="email"
                            Style={inputTextStyle}
                            Placeholder="Enter your email"
                            currentValue={currentInput.email}
                            validationRegex={/ /}
                            onChange={(e) => { setCurrentInput({ ...currentInput, email: e.target.value }) }}
                            warningMessage=""
                            setValidity={() => { }}
                            allowEmpty={true}
                            onEnter={handleLogin}
                        />

                        {/* Password */}
                        <TextInputField
                            Label="Password"
                            Type="password"
                            Style={inputTextStyle}
                            Placeholder="Enter your password"
                            currentValue={currentInput.password}
                            validationRegex={/ /}
                            onChange={(e) => { setCurrentInput({ ...currentInput, password: e.target.value }) }}
                            warningMessage=""
                            setValidity={() => { }}
                            allowEmpty={true}
                            onEnter={handleLogin}
                        />
                        {/* Submit Button */}
                        <div className="flex justify-center items-center ">
                            <SubmitButton onClick={handleLogin} text="Sign In" disabled={false} />
                        </div>
                    </div>

                    {/* <p className="font-bold text-[5vw]">OR</p> */}

                    <img className={`${logoClassName} `} src={GoogleLogo} alt="Google logo" onClick={handleGoogleLogin} />
                    {/* <img className={logoClassName} src="/src/assets/facebook-logo.svg" alt="Facebook logo" onClick={handleFacebookClick} />
                    <img className={logoClassName} src="/src/assets/linkedin-logo.svg" alt="Linkedin logo" onClick={handleLinkedinClick} />
                    <img className={logoClassName} src="/src/assets/apple-logo.svg" alt="Apple logo" onClick={handleAppleClick} /> */}
                    <p className="text-[4vw] text-nowrap text-mainColor " onClick={() => { window.location.href = "/signup" }}>Don't have an account?</p>
                </div>

            </div>
        </>
    )
}

export default LoginPage
import Header from "../components/Header"
import { supabase } from '../supabaseClient'
import TextInputField from "../components/TextInputField"
import type { style } from "../components/TextInputField"
import { useState } from "react"
import GoogleLogo from '../assets/google-logo.svg'

type inputType = { email: string, password: string }
function LoginPage() {
    const logoClassName: string = "w-30"


    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5173/menu', // or your deployed site URL
            },
        })

        if (error) {
            console.error('Google login error:', error.message)
        }
    }

    function handleLogin() {
        supabase.auth.signInWithPassword({
            email: currentInput.email,
            password: currentInput.password
        }).then(({ error }) => {
            if (error) {
                console.error('Sign in error:', error.message);
                alert("Invalid email or password")
            } else {
                console.log('Sign in successful');
                window.location.href = "/menu"; // redirect to menu on successful login
            }
        })

    }

    const inputTextStyle: style = {
        ContainerStyle: "flex flex-row justify-between items-center w-[100%] ",
        InputStyle: "w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm ",
        LabelStyle: "text-[4vw] text-nowrap"
    }

    const [currentInput, setCurrentInput] = useState<inputType>({ email: "", password: "" });


    return (
        <>
            <div className="flex flex-col items-center h-screen">
                <Header mainTitle="Login" subTitle="Select a provider!" />


                <div className="flex flex-col items-center h-[50%] w-[90vw] justify-between border-1 p-[1vh] rounded-lg shadow-lg bg-blue-200 mb-4">
                    {/* Sign In Form */}
                    <div className="flex flex-col h-[50%] w-[100%] items-center justify-between border-1 p-[1vh] rounded-lg shadow-lg">
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
                            onEnter={handleLogin}
                        />
                        {/* Submit Button */}
                        <div className="flex justify-center items-center ">
                            <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Submit
                            </button>
                        </div>
                    </div>

                    <p className="font-bold text-[5vw]">OR</p>

                    <img className={`${logoClassName} border-1 p-[1vh] rounded-lg shadow-lg`} src={GoogleLogo} alt="Google logo" onClick={handleGoogleLogin} />
                    {/* <img className={logoClassName} src="/src/assets/facebook-logo.svg" alt="Facebook logo" onClick={handleFacebookClick} />
                    <img className={logoClassName} src="/src/assets/linkedin-logo.svg" alt="Linkedin logo" onClick={handleLinkedinClick} />
                    <img className={logoClassName} src="/src/assets/apple-logo.svg" alt="Apple logo" onClick={handleAppleClick} /> */}
                </div>
                <p className="text-[4vw] text-nowrap text-blue-500" onClick={() => { window.location.href = "/signup" }}>Don't have an account?</p>

            </div>
        </>
    )
}

export default LoginPage
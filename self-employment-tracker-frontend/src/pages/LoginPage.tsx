import Header from "../components/Header"
import { supabase } from '../supabaseClient'
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
    const handleFacebookClick = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: 'http://localhost:5173/menu', // or your deployed site URL
            },
        })

        if (error) {
            console.error('Facebook login error:', error.message)
        }
    }

    const handleLinkedinClick = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'linkedin'
        })

        if (error) {
            console.error('Linkedin login error:', error.message)
        }
    }

    const handleAppleClick = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
                redirectTo: 'http://localhost:5173/menu', // or your deployed site URL
            },
        })

        if (error) {
            console.error('Apple login error:', error.message)
        }
    }

    return (
        <>
            <div className="flex flex-col items-center h-screen">
                <Header mainTitle="Login" subTitle="Select a provider!" />


                <div className="flex flex-col items-center h-[50%] w-[90vw] justify-between border-1 p-[1vh] rounded-lg shadow-lg bg-blue-200 mb-4">
                    <div className="flex flex-col h-[30%] items-center justify-between border-1 p-[1vh] rounded-lg shadow-lg">
                        <div className="flex flex-row justify-between items-center w-[100%] ">
                            <p className="text-[4vw] text-nowrap">UserName</p>
                            <input type="number" id="hoursWorked" className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                        </div>
                        <div className="flex flex-row justify-between items-center w-[100%] ">
                            <p className="text-[4vw] text-nowrap">Password</p>
                            <input type="number" id="hoursWorked" className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center items-center ">
                            <button onClick={() => { }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Submit
                            </button>
                        </div>
                    </div>

                    <p className="font-bold text-[5vw]">OR</p>

                    <img className={`${logoClassName} border-1 p-[1vh] rounded-lg shadow-lg`} src="/src/assets/google-logo.svg" alt="Google logo" onClick={handleGoogleLogin} />
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
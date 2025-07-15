import Header from "../components/Header"
import { supabase } from '../supabaseClient'
function LoginPage() {
    const logoClassName: string = "w-40 "


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

                <div className="h-[60%] w-[100vw] grid grid-cols-2 gap-4 justify-items-center items-center">
                    <img className={logoClassName} src="/src/assets/google-logo.svg" alt="Google logo" onClick={handleGoogleLogin} />
                    <img className={logoClassName} src="/src/assets/facebook-logo.svg" alt="Facebook logo" onClick={handleFacebookClick} />
                    <img className={logoClassName} src="/src/assets/linkedin-logo.svg" alt="Linkedin logo" onClick={handleLinkedinClick} />
                    <img className={logoClassName} src="/src/assets/apple-logo.svg" alt="Apple logo" onClick={handleAppleClick} />
                </div>
            </div>
        </>
    )
}

export default LoginPage
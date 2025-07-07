import Header from "../components/Header"
function LoginPage() {
    const logoClassName: string = "w-40 "
    function handleGoogleClick() { console.log("g clicked") }
    function handleFacebookClick() { console.log("f clicked") }
    function handleLinkedinClick() { console.log("l clicked") }
    function handleAppleClick() { console.log("a clicked") }
    return (
        <>
            <div className="flex flex-col items-center h-screen">
                <Header mainTitle="Login" subTitle="Select a provider!" />

                <div className="h-[60%] w-[100vw] grid grid-cols-2 gap-4 justify-items-center items-center">
                    <img className={logoClassName} src="/src/assets/google-logo.svg" alt="Google logo" onClick={handleGoogleClick} />
                    <img className={logoClassName} src="/src/assets/facebook-logo.svg" alt="Facebook logo" onClick={handleFacebookClick} />
                    <img className={logoClassName} src="/src/assets/linkedin-logo.svg" alt="Linkedin logo" onClick={handleLinkedinClick} />
                    <img className={logoClassName} src="/src/assets/apple-logo.svg" alt="Apple logo" onClick={handleAppleClick} />
                </div>
            </div>
        </>
    )
}

export default LoginPage
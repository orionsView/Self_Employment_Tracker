import FistLogo from "../assets/fist-logo.svg"
import MenuLogo from "../assets/menu-logo.svg"
function NavBar() {
    return (
        <>
            <div className="flex justify-between items-center w-[100%] h-[10%] border-b-2">
                <div className="flex flex-row items-center">
                    <img className="w-12" src={FistLogo} alt="fist" />
                    <p className="text-[6vw] font-bold">Punch The Clock</p>
                </div>

                <a href="/menu"><img className="w-12" src={MenuLogo} alt="menu" /></a>
            </div>
        </>
    )
}

export default NavBar
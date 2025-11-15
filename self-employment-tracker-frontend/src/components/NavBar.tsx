import FistLogo from "../assets/fist-logo.svg"
import MenuLogo from "../assets/menu-logo.svg"
function NavBar({ showMenu = true }: { showMenu?: boolean }) {
    return (
        <>
            <div className="flex justify-between items-center w-[100%] h-[10%] border-b-2">
                <a href="/menu" className="flex flex-row items-center bg-mainColor rounded-3xl p-2 h-[80%]" >
                    <img className="w-12" src={FistLogo} alt="fist" />
                    <p className="text-[7vw] text-tertiaryColor header-font">Punch The Clock</p>
                </a>

                {showMenu && <a href="/menu"><img className="w-16 bg-mainColor rounded-xl h-[80%] p-2" src={MenuLogo} alt="menu" /></a>}
            </div>
        </>
    )
}

export default NavBar
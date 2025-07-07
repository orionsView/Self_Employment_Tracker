function NavBar() {
    return (
        <>

            <div className="flex justify-between items-center w-[100%] h-[10%] border-b-2">
                <div className="flex flex-row items-center">
                    <img className="w-12" src="/src/assets/fist-logo.svg" alt="fist" />
                    <p className="text-[6vw] font-bold">Punch The Clock</p>
                </div>

                <a href="/menu"><img className="w-12" src="/src/assets/menu-logo.svg" alt="menu" /></a>
            </div>
        </>
    )
}

export default NavBar
type Props = {
    mainTitle: string
    subTitle?: string
}

function Header(Props: Props) {
    return (
        <div className="flex flex-col items-center justify-center h-[30%] w-[100%]">
            <div className="flex flex-col items-center justify-center h-[70%] w-[90%] bg-mainColor rounded-2xl p-5">

                <p className="text-[13vw] font-bold text-tertiaryColor pb-4 text-nowrap">{Props.mainTitle}</p>
                <p className="text-[5vw] italic text-tertiaryColor text-nowrap">{Props.subTitle}</p>
            </div>
        </div>
    )
}

export default Header
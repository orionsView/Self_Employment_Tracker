type Props = {
    mainTitle: string
    subTitle?: string
}

function Header(Props: Props) {
    return (
        <div className="flex flex-col items-center justify-center h-[30%]">
            <p className="text-[13vw] font-bold color-black pb-4 text-nowrap">{Props.mainTitle}</p>
            <p className="text-[5vw] italic color-black">{Props.subTitle}</p>
        </div>
    )
}

export default Header
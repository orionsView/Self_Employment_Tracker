type Props = {
    startDate?: string | null
    endDate?: string | null
    onChangeStart: (v: string) => void
    onChangeEnd: (v: string) => void
    className?: string
    startLabel?: string
    endLabel?: string
    startId?: string
    endId?: string
}

export default function DateRangePicker({
    startDate,
    endDate,
    onChangeStart,
    onChangeEnd,
    className = '',
    startLabel = 'Date Start',
    endLabel = 'Date End',
    startId = 'dateStart',
    endId = 'dateEnd'
}: Props) {
    return (
        <div className={className}>
            <div className="flex flex-row justify-between items-center w-[80%] ">
                <p className="text-[4vw] text-nowrap">{startLabel}</p>
                <input
                    type="date"
                    id={startId}
                    onChange={(e) => onChangeStart(e.target.value)}
                    value={startDate === null ? '' : startDate}
                    className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm "
                />
            </div>
            <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                <p className="text-[4vw] text-nowrap">{endLabel}</p>
                <input
                    type="date"
                    id={endId}
                    onChange={(e) => onChangeEnd(e.target.value)}
                    value={endDate === null ? '' : endDate}
                    className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm "
                />
            </div>
        </div>
    )
}

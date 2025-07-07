import Select from 'react-select';
import { useState } from 'react';
function ClientSelector() {
    const [selectedOptions, setSelectedOptions]: any = useState([]);
    const clients: string[] = ["Client 1", "Client 2", "Client 3", "Client 4", "Client 5", "Client 6", "Client 7", "Client 8", "Client 9", "Client 10"];

    // const wrapperRef = useRef<HTMLDivElement>(null);


    return (
        <>
            <div className="w-full">
                <Select
                    options={clients.map((client: string) => ({ value: client, label: client }))}
                    value={selectedOptions}
                    onChange={setSelectedOptions}

                    isMulti
                    placeholder="Select clients..."
                    className="text-sm"
                    components={{ Input: () => null }} // hide the default input
                />
            </div>
        </>
    )
}

export default ClientSelector
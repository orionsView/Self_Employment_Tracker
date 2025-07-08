import Select from 'react-select';




type Props = {
    setSelectedOptions: (selectedOptions: any) => void,
    selectMultiple: boolean
}

function ClientSelector({ setSelectedOptions, selectMultiple }: Props) {
    const clients: string[] = [
        "Client 1", "Client 2", "Client 3", "Client 4", "Client 5",
        "Client 6", "Client 7", "Client 8", "Client 9", "Client 10"
    ];




    return (
        <div className="w-full">
            <Select
                options={clients.map(client => ({ value: client, label: client }))}
                // value={selectedOptions}
                onChange={setSelectedOptions}
                isMulti={selectMultiple}
                placeholder="Select clients..."
                className="text-sm"
            />
        </div>
    );
}

export default ClientSelector;

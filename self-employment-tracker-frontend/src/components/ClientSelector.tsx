import Select from 'react-select';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';





type Props = {
    setSelectedOptions: (selectedOptions: any) => void,
    selectMultiple: boolean
}

function ClientSelector({ setSelectedOptions, selectMultiple }: Props) {
    // const clients: string[] = [
    //     "Client 1", "Client 2", "Client 3", "Client 4", "Client 5",
    //     "Client 6", "Client 7", "Client 8", "Client 9", "Client 10"
    // ];

    const [clients, setClients] = useState<string[]>([]);



    useEffect(() => {
        const fetchClients = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('Client')
                .select('FirstName, LastName')
                .eq('UserID', user?.id)

            if (error) {
                console.error('Error fetching clients:', error)
            } else {
                const clientNames = data.map(
                    (client) => `${client.FirstName} ${client.LastName}`
                )
                setClients(clientNames)
            }
        }

        fetchClients()
    }, [])


    useEffect(() => {
        console.log(clients)
    }, [clients])




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

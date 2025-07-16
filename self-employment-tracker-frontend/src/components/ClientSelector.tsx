import Select from 'react-select';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';





type Props = {
    setSelectedOptions: (selectedOptions: any) => void,
    selectMultiple: boolean
}

type client = {
    FirstName: string,
    LastName: string,
    id: string
}

function ClientSelector({ setSelectedOptions, selectMultiple }: Props) {


    const [clients, setClients] = useState<client[]>([]);



    useEffect(() => {
        const fetchClients = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            console.log(user?.id)

            const { data, error } = await supabase
                .from('Client')
                .select('FirstName, LastName, ID')
                .eq('UserID', user?.id)

            if (error) {
                console.error('Error fetching clients:', error)
            } else {
                const clientObjs = data.map((client: any) => ({ FirstName: client.FirstName, LastName: client.LastName, id: client.ID }))
                setClients(clientObjs)
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
                options={clients.map(client => ({ value: client, label: `${client.FirstName} ${client.LastName}` }))}
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

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function SuggestionModule() {
    const [suggestionType, setSuggestionType] = useState<string>();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const user = await supabase.auth.getUser();
        const { data, error } = await supabase.rpc('get_user_job_summary    ', {
            user_uuid: user.data.user?.id
        });
        if (error) {
            console.error("Error fetching financial data:", error.message);
        } else {
            setUserData(data);

        }
    }

    useEffect(() => {
        console.log('userData:', userData);
    }, [userData]);

    return (
        <>
            {/* Suggestion Type */}
            <select onChange={(e) => setSuggestionType(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" defaultValue={""}>
                <option value={""} disabled>Select a suggestion type</option>
                <option>Past Income Analysis</option>
                <option>Future Income Analysis</option>
                <option>Trip Analysis</option>
            </select>

            <div className="border p-4 mt-4 w-[95%] mb-4">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae corrupti nihil deserunt harum et assumenda ad veniam accusantium dolor exercitationem. Minima, mollitia soluta. Voluptates voluptas, earum nobis eum minima cupiditate.
            </div>

        </>
    );
}

export default SuggestionModule


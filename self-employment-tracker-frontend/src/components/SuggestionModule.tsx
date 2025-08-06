import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function SuggestionModule({ data }: any) {
    const [suggestionType, setSuggestionType] = useState<string>("");
    const [suggestion, setSuggestion] = useState<string>("Select an option and hit \"Get Suggestion\".");

    // useEffect(() => {
    //     getData();
    // }, []);



    async function getSuggestion() {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;




        // Use the freshly fetched data directly
        const response = await fetch(`${backendUrl}/getRecommendations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data,
                suggestionType
            })
        });
        const result = await response.json();
        setSuggestion(result.output);
    }


    useEffect(() => {
        console.log('suggestion:', suggestion);
    }, [suggestion]);

    return (
        <>
            {/* Suggestion Type */}
            <select onChange={(e) => setSuggestionType(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" defaultValue={""}>
                <option value={""} disabled>Select a suggestion type</option>
                <option>Past Income Analysis</option>
                <option>Future Income Analysis</option>
                <option>Trip Analysis</option>
            </select>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={getSuggestion}>Get Suggestion</button>

            <div className="border p-4 mt-4 w-[95%] mb-4">
                <p>{typeof suggestion === "string" ? suggestion : JSON.stringify(suggestion)}</p>
            </div>

        </>
    );
}

export default SuggestionModule


import { useState, useEffect } from "react";

function SuggestionModule({ data }: any) {
    // const [suggestionType, setSuggestionType] = useState<string>("");
    const [suggestion, setSuggestion] = useState<string>("Select A Graph To Get Suggestions");
    const [requestedRecently, setRequestedRecently] = useState<boolean>(false);

    // useEffect(() => {
    //     getData();
    // }, []);



    async function getSuggestion() {
        setRequestedRecently(true);

        setSuggestion("Thinking...");
        const backendUrl = import.meta.env.VITE_BACKEND_URL;




        // Use the freshly fetched data directly
        const suggestionType = "Past Income Analysis";
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

        startCountdown();
    }

    async function startCountdown() {
        setTimeout(() => {
            setRequestedRecently(false);
        }, 10000);
    }


    useEffect(() => {
        console.log('suggestion:', suggestion);
    }, [suggestion]);

    useEffect(() => {
        if (requestedRecently) {
            console.log('already requested recently');
            return
        }
        if (data && data.length > 0) {
            getSuggestion();
        } else {
            console.log('no data');
        }

    }, [data]);

    return (
        <>
            {/* Suggestion Type
            <select onChange={(e) => setSuggestionType(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" defaultValue={""}>
                <option value={""} disabled>Select a suggestion type</option>
                <option>Past Income Analysis</option>
                <option>Future Income Analysis</option>
                <option>Trip Analysis</option>
            </select> */}

            {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={getSuggestion}>Get Suggestion</button> */}

            <div className="border p-4 mt-4 w-[95%] mb-4">
                <p>{typeof suggestion === "string" ? suggestion : JSON.stringify(suggestion)}</p>
            </div>

        </>
    );
}

export default SuggestionModule


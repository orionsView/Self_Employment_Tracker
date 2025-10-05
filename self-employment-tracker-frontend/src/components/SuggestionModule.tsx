import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function SuggestionModule({ data }: any) {
    // const [suggestionType, setSuggestionType] = useState<string>("");
    const [suggestion, setSuggestion] = useState<string>("Select A Graph To Get Suggestions");




    async function getSuggestion() {
        if (localStorage.getItem("UserSettings") === null) {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            const typeResponse = await supabase.rpc('get_user_settings', {
                user_id: user?.id,
            });
            console.log(`typeResponse: ${JSON.stringify(typeResponse)}`);

            localStorage.setItem("UserSettings", JSON.stringify(typeResponse.data[0]));
        }

        // Now read settings (either existing or the one we just stored) and use it
        const settings = localStorage.getItem("UserSettings") || "";

        if (JSON.parse(settings).useRecs === false) {
            setSuggestion("Advice Disabled. Enable advice in settings.");
            return;
        }


        const suggestionType = settings ? JSON.parse(settings).AIFocus : "Past Results";
        console.log(`settings: ${settings}`);
        console.log(`suggestionType: ${suggestionType}`);


        setSuggestion("Thinking...");

        if (localStorage.getItem(JSON.stringify(data)) !== null) {
            setSuggestion(JSON.parse(localStorage.getItem(JSON.stringify(data)) || "").output);
            console.log("used cached suggestion");
            return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL;




        // const suggestionType = typeResponse.data[0].SuggestionType


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

        localStorage.setItem(JSON.stringify(data), JSON.stringify(result));
    }




    useEffect(() => {
        console.log('suggestion:', suggestion);
    }, [suggestion]);

    useEffect(() => {
        if (data.length > 0) {
            getSuggestion();
        }
    }, [data]);

    return (
        <>

            <div className="border p-4 mt-4 w-[95%] mb-4">
                <p>{typeof suggestion === "string" ? suggestion : JSON.stringify(suggestion)}</p>
            </div>

        </>
    );
}

export default SuggestionModule


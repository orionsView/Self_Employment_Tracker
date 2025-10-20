import Header from "../components/Header"
import NavBar from "../components/NavBar"
import { use, useEffect, useState } from "react"
import { supabase } from '../supabaseClient'
import { useNavigate } from "react-router-dom"
import { BorderCard } from "../constants/ui"
import SubmitButton from "../components/SubmitButton"
import { get } from "lodash"


type response = {
    defaultGraph: string,
    useMi: boolean,
    use12hr: boolean,
    useRecs: boolean,
    darkMode: darkModeOptions,
    AIFocus: string
}

enum darkModeOptions {
    True = "true",
    False = "false",
    UseSystem = "useSystem"
}

function SettingsPage() {
    const navigate = useNavigate();

    const getInitialOptions = (): response => {
        const stored = localStorage.getItem("UserSettings");
        if (stored && stored !== "undefined") {
            try {
                const parsed = JSON.parse(stored);
                // console.log("parsed: ", parsed);
                let parseDarkMode;
                console.log("parsed.darkMode: ", parsed.darkMode);
                if (parsed.darkMode === "true") parseDarkMode = darkModeOptions.True;
                else if (parsed.darkMode === "false") parseDarkMode = darkModeOptions.False;
                else if (parsed.darkMode === "useSystem") parseDarkMode = darkModeOptions.UseSystem;
                else parseDarkMode = undefined
                    ;
                return {
                    defaultGraph: parsed.defaultGraph ?? "None Selected",
                    useMi: parsed.useMi ?? true,
                    use12hr: parsed.use12hr ?? true,
                    useRecs: parsed.useRecs ?? true,
                    darkMode: parseDarkMode ?? darkModeOptions.False,
                    AIFocus: parsed.AIFocus ?? "None Selected"
                };
            } catch {
                // fallback to defaults if parsing fails
            }
        }
        return {
            defaultGraph: "None Selected",
            useMi: true,
            use12hr: true,
            useRecs: true,
            darkMode: darkModeOptions.False,
            AIFocus: "None Selected"
        };
    };
    const [selectedOptions, setSelectedOptions]: any = useState<response>(getInitialOptions());
    async function handleSubmit() {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('User not authenticated', userError);
            return;
        }
        // console.log(user.id);

        // Insert Settings
        const { error: settingsError } = await supabase.from('Settings').upsert({
            userID: user.id,
            defaultGraph: selectedOptions.defaultGraph,
            distanceUnits: selectedOptions.useMi ? "MI" : "KM",
            timeUnits: selectedOptions.use12hr ? "12" : "24",
            adviceLLM: selectedOptions.useRecs,
            darkMode: selectedOptions.darkMode,
            AIFocus: selectedOptions.AIFocus,
            timeUpdated: new Date()
        });

        if (settingsError) {
            console.error('Settings insert failed:', settingsError);
            alert("Error updating settings")
            return;
        }

        if (typeof localStorage !== "undefined" && localStorage.getItem("UserSettings") !== null) {
            localStorage.setItem("UserSettings", JSON.stringify(selectedOptions));
        }
        navigate("/menu");
        console.log('Settings updated successfully');
        alert("Settings updated successfully")
    }

    useEffect(() => {
        console.log(selectedOptions);
    }), [selectedOptions]

    useEffect(() => {
        // const userSettings = localStorage.getItem("UserSettings");
        // if (userSettings && userSettings !== "undefined") {
        //     setSelectedOptions(JSON.parse(userSettings));
        // } 

        getInitialOptions();
    }, []);
    // const borderStyle: string = "border-1 p-[1vh] rounded-lg shadow-lg";
    const borderStyle: string = BorderCard;
    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center h-[90%]">
                <Header mainTitle="Settings" subTitle="Customize your experience" />
                <div className={`h-[60%] w-[80%] flex flex-col justify-between items-center ${borderStyle}`}>
                    {/* DEFAULT GRAPH
                    <div className={`flex flex-row justify-between items-center w-[80%]  ${borderStyle}`}>
                        <p className="text-[4vw] text-nowrap">Default Graph</p>
                        <select
                            onChange={(e) => setSelectedOptions((selectedOptions: any) => ({
                                ...selectedOptions,
                                defaultGraph: e.target.value
                            }))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
                            defaultValue=""
                        >
                            <option value={""} disabled>Select a graph</option>
                            <option>Week by Week Income</option>
                            <option>Month by Month Income</option>
                            <option>Year by Year Income</option>
                        </select>
                    </div> */}

                    {/* UNITS */}
                    <div className={`flex flex-col justify-between items-center w-[80%] `}>
                        {/* <div className="flex flex-row justify-top items-center w-[100%] "> */}
                        <p className="text-[6vw] text-nowrap mb-4 font-bold">Units</p>
                        {/* </div> */}
                        <div className="flex flex-row justify-center items-center w-[100%] ">

                            <label className="mr-2" htmlFor="Miles">Miles</label>
                            <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useMi: true }))} type="radio" id="Miles" name="distanceUnits" value="Miles" checked={selectedOptions.useMi === true} />
                            <label className="mr-2 ml-8" htmlFor="Kilometers">Kilometers</label>
                            <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useMi: false }))} type="radio" id="Kilometers" name="distanceUnits" value="Kilometers" checked={selectedOptions.useMi === false} />
                        </div>
                        <div className="flex flex-row justify-center items-center w-[100%] ">

                            <label className="mr-2" htmlFor="12HR">12-HR</label>
                            <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, use12hr: true }))} type="radio" id="12HR" name="timeUnits" value="12HR" checked={selectedOptions.use12hr === true} />
                            <label className="mr-2 ml-8" htmlFor="24HR">24-HR</label>
                            <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, use12hr: false }))} type="radio" id="24HR" name="timeUnits" value="24HR" checked={selectedOptions.use12hr === false} />
                        </div>
                    </div>

                    {/* RECS */}
                    <div className={`flex flex-col justify-between items-center w-[80%] `} >

                        <div className={`flex flex-row justify-between items-center w-[100%]`}>

                            <p className="text-nowrap text-[4vw]">AI Analysis</p>

                            <div className="flex flex-row justify-center items-center w-[100%] ml-8">
                                <label className="mr-2" htmlFor="RecsOn">On</label>
                                <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useRecs: true }))} type="radio" id="RecsOn" name="recs" value="On" checked={selectedOptions.useRecs === true} />
                            </div>
                            <div className="flex flex-row justify-center items-center w-[100%] ">
                                <label className="mr-2" htmlFor="RecsOff">Off</label>
                                <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useRecs: false }))} type="radio" id="RecsOff" name="recs" value="Off" checked={selectedOptions.useRecs === false} />
                            </div>


                        </div>
                        {selectedOptions.useRecs && <div className={`flex flex-row justify-between items-center w-[100%]`}>
                            <p className="text-[4vw] text-nowrap">AI Focus</p>
                            <select
                                onChange={(e) => setSelectedOptions((selectedOptions: any) => ({
                                    ...selectedOptions,
                                    AIFocus: e.target.value
                                }))}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
                                value={selectedOptions.AIFocus}
                            >
                                <option value={""} disabled>Select an option</option>
                                <option>Past Analysis</option>
                                <option>Future Prediction</option>
                                <option>General Suggestions</option>
                                {/* <option>All Three</option> */}
                            </select>
                        </div>}
                    </div>

                    {/* DARK MODE */}
                    <div className={`flex flex-row justify-between items-center w-[80%]  `}>

                        <p className="text-nowrap text-[4vw]">Dark Mode</p>

                        <div className="flex flex-row justify-center items-center w-[80%] ml-8">
                            <label className="mr-2" htmlFor="DarkOn">On</label>
                            <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, darkMode: darkModeOptions.True }))} type="radio" id="DarkOn" name="Dark" value="On" checked={selectedOptions.darkMode === darkModeOptions.True} />
                        </div>
                        <div className="flex flex-row justify-center items-center w-[80%] ">
                            <label className="mr-2" htmlFor="DarkOff">Off</label>
                            <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, darkMode: darkModeOptions.False }))} type="radio" id="DarkOff" name="Dark" value="Off" checked={selectedOptions.darkMode === darkModeOptions.False} />
                        </div>
                        <div className="flex flex-row justify-center items-center w-[80%] ">
                            <label className="mr-2" htmlFor="UseSystem">Use Syetem Theme</label>
                            <input onChange={() => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, darkMode: darkModeOptions.UseSystem }))} type="radio" id="useSystem" name="Dark" value="Off" checked={selectedOptions.darkMode === darkModeOptions.UseSystem} />
                        </div>
                    </div>

                    {/* ZIP CODE
                    <div className={`flex flex-row justify-between items-center w-[80%]  ${borderStyle}`}>
                        <p>Zip Code</p>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" placeholder="Zip Code" />
                    </div> */}

                    {/* Submit Button */}
                    {/* <div className="flex justify-center items-center  h-[10%]">
                        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                        </button>
                    </div> */}
                    <SubmitButton onClick={handleSubmit} text="Submit" />
                </div>
            </div >
        </>
    )
}

export default SettingsPage
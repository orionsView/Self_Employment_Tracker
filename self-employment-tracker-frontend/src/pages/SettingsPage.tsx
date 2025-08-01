import Header from "../components/Header"
import NavBar from "../components/NavBar"
import { useEffect, useState } from "react"
import { supabase } from '../supabaseClient'


type response = {
    defaultGraph: string,
    useMi: boolean,
    use12hr: boolean,
    useRecs: boolean,
    useDarkMode: boolean
}
function SettingsPage() {
    const [selectedOptions, setSelectedOptions]: any = useState<response>({
        defaultGraph: "",
        useMi: true,
        use12hr: true,
        useRecs: true,
        useDarkMode: false
    });
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
            darkMode: selectedOptions.useDarkMode,
        });

        if (settingsError) {
            console.error('Settings insert failed:', settingsError);
            return;
        }
    }

    useEffect(() => {
        console.log(selectedOptions);
    }), [selectedOptions]
    const borderStyle: string = "border-1 p-[1vh] rounded-lg shadow-lg";
    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center h-[90%]">
                <Header mainTitle="Settings" subTitle="Customize your experience" />
                <div className="h-[60%] w-[100vw] flex flex-col justify-between items-center">
                    {/* DEFAULT GRAPH */}
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
                            <option value={""} disabled>Select a default</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                        </select>
                    </div>

                    {/* UNITS */}
                    <div className={`flex flex-col justify-between items-center w-[80%] ${borderStyle}`}>
                        <div className="flex flex-row justify-top items-center w-[100%] ">
                            <p className="text-[4vw] text-nowrap">Units</p>
                        </div>
                        <div className="flex flex-row justify-center items-center w-[100%] ">

                            <label className="mr-2" htmlFor="Miles">Miles</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useMi: e.target.checked }))} type="radio" id="Miles" name="distanceUnits" value="Miles" defaultChecked={true} />
                            <label className="mr-2 ml-8" htmlFor="Kilometers">Kilometers</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useMi: !(e.target.checked) }))} type="radio" id="Kilometers" name="distanceUnits" value="Kilometers" />
                        </div>
                        <div className="flex flex-row justify-center items-center w-[100%] ">

                            <label className="mr-2" htmlFor="12HR">12-HR</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, use12hr: e.target.checked }))} type="radio" id="12HR" name="timeUnits" value="12HR" defaultChecked={true} />
                            <label className="mr-2 ml-8" htmlFor="24HR">24-HR</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, use12hr: !(e.target.checked) }))} type="radio" id="24HR" name="timeUnits" value="24HR" />
                        </div>
                    </div>

                    {/* RECS */}
                    <div className={`flex flex-row justify-between items-center w-[80%]  ${borderStyle}`}>

                        <p className="text-nowrap text-[4vw]">Recommendations</p>

                        <div className="flex flex-row justify-center items-center w-[80%] ml-8">
                            <label className="mr-2" htmlFor="RecsOn">On</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useRecs: e.target.checked }))} type="radio" id="RecsOn" name="recs" value="On" defaultChecked={true} />
                        </div>
                        <div className="flex flex-row justify-center items-center w-[80%] ">
                            <label className="mr-2" htmlFor="RecsOff">Off</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useRecs: !(e.target.checked) }))} type="radio" id="RecsOff" name="recs" value="Off" />
                        </div>


                    </div>

                    {/* DARK MODE */}
                    <div className={`flex flex-row justify-between items-center w-[80%]  ${borderStyle}`}>

                        <p className="text-nowrap text-[4vw]">Dark Mode</p>

                        <div className="flex flex-row justify-center items-center w-[80%] ml-8">
                            <label className="mr-2" htmlFor="DarkOn">On</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useDarkMode: e.target.checked }))} type="radio" id="DarkOn" name="Dark" value="On" />
                        </div>
                        <div className="flex flex-row justify-center items-center w-[80%] ">
                            <label className="mr-2" htmlFor="DarkOff">Off</label>
                            <input onChange={(e) => setSelectedOptions((selectedOptions: any) => ({ ...selectedOptions, useDarkMode: !(e.target.checked) }))} type="radio" id="DarkOff" name="Dark" value="Off" defaultChecked={true} />
                        </div>
                    </div>

                    {/* ZIP CODE
                    <div className={`flex flex-row justify-between items-center w-[80%]  ${borderStyle}`}>
                        <p>Zip Code</p>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" placeholder="Zip Code" />
                    </div> */}

                    {/* Submit Button */}
                    <div className="flex justify-center items-center  h-[10%]">
                        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default SettingsPage
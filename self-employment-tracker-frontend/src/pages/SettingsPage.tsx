function SettingsPage() {
    return (
        <>
            <div className="flex flex-col items-center h-screen">
                <div className="flex flex-col items-center justify-center h-[30%]">
                    <p className="text-6xl font-bold color-black pb-4">Settings Page</p>
                    <p className="text-1xl italic color-black">Select your settings!</p>
                </div>

                <div className="h-[60%] w-[100vw] flex flex-col justify-between items-center">
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p>Default Graph</p>
                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" defaultValue={""}>
                            <option value={""} disabled>Select a default</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                        </select>
                    </div>

                    {/* UNITS */}
                    <div className="flex flex-row justify-top items-center w-[80%] ">
                        <p>Units</p>
                    </div>
                    <div className="flex flex-row justify-center items-center w-[80%] ">

                        <label className="mr-4" htmlFor="Miles">Miles</label>
                        <input type="radio" id="Miles" name="units" value="Miles" />
                        <label className="mr-4 ml-8" htmlFor="Kilometers">Kilometers</label>
                        <input type="radio" id="Kilometers" name="units" value="Kilometers" />
                    </div>
                    <div className="flex flex-row justify-center items-center w-[80%] ">

                        <label className="mr-4" htmlFor="12HR">12-HR</label>
                        <input type="radio" id="12HR" name="units" value="12HR" />
                        <label className="mr-4 ml-8" htmlFor="24HR">24-HR</label>
                        <input type="radio" id="24HR" name="units" value="24HR" />
                    </div>

                    {/* RECS */}
                    <div className="flex flex-row justify-top items-center w-[80%] ">
                        <p>Recommendations</p>
                    </div>
                    <div className="flex flex-row justify-center items-center w-[80%] ">

                        <label className="mr-4" htmlFor="On">On</label>
                        <input type="radio" id="On" name="recs" value="On" />
                        <label className="mr-4 ml-8" htmlFor="Off">Off</label>
                        <input type="radio" id="Off" name="recs" value="Off" />

                    </div>

                    {/* DARK MODE */}
                    <div className="flex flex-row justify-top items-center w-[80%] ">
                        <p>Dark Mode</p>
                    </div>
                    <div className="flex flex-row justify-center items-center w-[80%] ">

                        <label className="mr-4" htmlFor="On">On</label>
                        <input type="radio" id="On" name="recs" value="On" />
                        <label className="mr-4 ml-8" htmlFor="Off">Off</label>
                        <input type="radio" id="Off" name="recs" value="Off" />

                    </div>

                    {/* ZIP CODE */}
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p>Default Graph</p>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" placeholder="Zip Code" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsPage
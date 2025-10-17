function SubmitButton(props: any) {
    return (
        <>
            <button disabled={props.disabled} className="bg-secondaryColor text-white font-bold py-2 px-4 rounded" onClick={props.onClick}>{props.text}</button>
        </>
    )
}

export default SubmitButton;
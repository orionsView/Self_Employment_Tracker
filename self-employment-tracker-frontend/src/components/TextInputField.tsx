import { useEffect, useState } from "react"

type TextInputFieldProps = {
    Placeholder: string,
    Label: string,
    Type: string,
    Style: style,
    validationRegex: RegExp,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    currentValue: string,
    warningMessage: string,
    setValidity: (valid: boolean) => void
    onEnter: () => void

}

export type style = {
    ContainerStyle: string,
    InputStyle: string,
    LabelStyle: string
}

function TextInputField(props: TextInputFieldProps) {
    const [warningHidden, setWarningHidden] = useState(true);

    useEffect(() => {
        if (props.currentValue.match(props.validationRegex) || props.currentValue === "") {
            setWarningHidden(true)
            props.setValidity(true)
        } else {
            setWarningHidden(false)
        }
    }, [props.currentValue])

    return (
        <>
            <div className={props.Style.ContainerStyle}>
                <p className={props.Style.LabelStyle}>{props.Label}</p>
                <input type={props.Type} className={props.Style.InputStyle} placeholder={props.Placeholder} onChange={props.onChange} value={props.currentValue} onKeyDown={(e) => { if (e.key === "Enter") { props.onEnter() } }} />
            </div>

            <p className={`${warningHidden ? "hidden" : ""} text-red-500`}>{props.warningMessage}</p>
        </>
    )
}

export default TextInputField
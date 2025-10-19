import { useEffect, useState, useRef } from "react"

type TextInputFieldProps = {
    Placeholder?: string,
    Label: string,
    Type: string,
    Style: style,
    validationRegex?: RegExp,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    currentValue?: string,
    warningMessage?: string,
    setValidity?: (valid: boolean) => void,
    // when true, an empty string is treated as valid. Default: false
    allowEmpty?: boolean,
    onEnter?: () => void

}

export type style = {
    ContainerStyle: string,
    InputStyle: string,
    LabelStyle: string
}

function TextInputField(props: TextInputFieldProps) {
    const [warningHidden, setWarningHidden] = useState(true);
    const lastValidity = useRef<boolean | null>(null);


    useEffect(() => {
        // console.log("Validating input field:", props);
        if (!props.validationRegex || !props.setValidity) return;

        const isMatch = !!props.currentValue?.match(props.validationRegex);
        const isEmpty = props.currentValue === "";
        const valid = isMatch || (isEmpty && !!props.allowEmpty);

        // Only update if the visibility actually changes
        setWarningHidden((prev) => {
            if (prev === valid) return prev;
            return valid;
        });

        // Only call setValidity if it actually changed
        if (lastValidity.current !== valid) {
            lastValidity.current = valid;
            props.setValidity(valid);
        }
    }, [props.currentValue, props.allowEmpty, props.validationRegex]);


    return (
        <>
            <div className={props.Style.ContainerStyle}>
                <p className={props.Style.LabelStyle}>{props.Label}</p>
                <input type={props.Type} className={props.Style.InputStyle} placeholder={props.Placeholder} onChange={props.onChange} value={props.currentValue} onKeyDown={(e) => { if (e.key === "Enter") { if (props.onEnter) props.onEnter() } }} />
            </div>

            <p className={`${warningHidden ? "hidden" : ""} text-red-500`}>{props.warningMessage}</p>
        </>
    )
}

export default TextInputField
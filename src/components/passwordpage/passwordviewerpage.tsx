import { useState } from "react";

export const PasswordViewerPage = () => {
    const [num, setNum] = useState<number>(100)
    let num_old = 100;
    function increaseval() {
        console.log("Triggering")
        num_old = num_old + 100
        setNum(num + 100)
    }
    return (<div>
        From Password page {num_old} - {num}
        <div onClick={increaseval}>
            Increase num
        </div>
    </div>)
}
import { useEffect, useRef, useState } from "react";
import styles from "./Controls.module.css";
import TextareaAutosize from 'react-textarea-autosize';

export function Controls({ onSend, isDisabled = false }) {
    const textAreaRef = useRef(null)
    const [content, setContent] = useState("");

    useEffect(() => {
        if(!isDisabled) textAreaRef.current.focus();

    }, [isDisabled])

    function handleContentChange(event) {
        setContent(event.target.value);
    }

    function handleContentSend(){
        if(content.length > 0){
            onSend(content);
            setContent("");
        }
    }

    function handleEnterPress(event){
        if(event.key === "Enter" && !event.shiftKey){
            event.preventDefault();
            handleContentSend();
        }
    }

    return (
        <div className={styles.Controls}>
            <div className={styles.TextAreaContainer}>
                <TextareaAutosize 
                    placeholder="Message AI Chatbot" 
                    className={styles.TextArea} 
                    onChange={handleContentChange} 
                    value={content} 
                    minRows={1}
                    maxRows={4}
                    onKeyDown={handleEnterPress}
                    disabled={isDisabled}
                    ref={textAreaRef}
                />
            </div>
            <button className={styles.Button} onClick={handleContentSend} disabled={isDisabled}>
                <SendIcon />
            </button>
        </div>
    )
}

function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z"/>
        </svg>
    );
}
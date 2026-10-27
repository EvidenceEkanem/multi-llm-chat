import styles from "./Theme.module.css";

export function Theme() {
    function handleThemeChange(event) {
        const metaElement = document.querySelector('meta[name="color-scheme"]');
        metaElement.setAttribute("content", event.target.value);
    }

    return (
        <div className={styles.Theme}>
            <span>Theme:</span>
            <select defaultValue="light dark" onChange={handleThemeChange}>
                <option value="light dark">System</option>
                <option value="light">Light</option>
                <option value="dark">dark</option>
            </select>
        </div>
    );
}
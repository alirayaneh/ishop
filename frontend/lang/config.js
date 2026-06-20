/** ./i18n/i18n.config.ts */
import en from "./en.json"
import fa from "./fa.json"
import fr from "./fr.json"
import ar from "./fa.json"
import tr from "./tr.json"
import hi from "./hi.json"

export default defineI18nConfig(() => ({
    messages: {
        fa,
        en,
        fr,
        ar,
        tr,
        hi
    }
}))

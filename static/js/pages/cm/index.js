import { AppGuideline } from "./app-guildeline.js";
import { data } from "../sample-data/mQuestionAtom.js";

const clApp = new AppGuideline();
const element = clApp.getRootElement();
document.body.appendChild(element);

// Set
const sampleData = data[1].content;

clApp.setCardData(sampleData);
setTimeout(() => {
  clApp.setEditorData(sampleData);
}, 0);

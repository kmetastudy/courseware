import Lesson from "../molecules/Lesson.js"

const LessonChange = props => {
    return `
        <div class="flex justify-between">
            ${Lesson(props)}
            <button class="btn" onclick="chapter_modal.showModal()">수업 변경</button>
            <dialog id="chapter_modal" class="modal">
                <div class="modal-box">
                    <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <select class="select select-bordered select-sm w-full max-w-xs">
                        <option disabled selected>Who shot first?</option>
                        <option>Han Solo</option>
                        <option>Greedo</option>
                    </select>
                    <p class="py-4">Press ESC key or click on ✕ button to close</p>
                </div>
            </dialog>
        </div>
    `
}

export default LessonChange
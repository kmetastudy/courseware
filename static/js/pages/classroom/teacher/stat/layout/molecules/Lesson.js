const Lesson = props => {
    return `
        <div class="font-bold">
            <p class="badge badge-outline">${props.chapter}</p>
            <p><span class="px-2 text-xl">${props.lesson}차시</span> ${props.date}</p>
        </div>
    `

}

export default Lesson